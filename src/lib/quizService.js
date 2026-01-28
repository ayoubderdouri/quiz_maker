// import initSqlJs from 'sql.js';

let db = null;

// Initialize database
async function initDB() {
  if (db) return db;

  const SQL = await initSqlJs({
    locateFile: file => `https://sql.js.org/dist/${file}`
  });

  // Try to load existing database from localStorage
  const savedDb = localStorage.getItem('quizDatabase');
  
  if (savedDb) {
    const uint8Array = new Uint8Array(JSON.parse(savedDb));
    db = new SQL.Database(uint8Array);
  } else {
    db = new SQL.Database();
    
    // Create tables
    db.run(`
      CREATE TABLE IF NOT EXISTS quizzes (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        status TEXT DEFAULT 'draft',
        surveyData TEXT NOT NULL,
        totalQuestions INTEGER DEFAULT 0,
        totalResponses INTEGER DEFAULT 0,
        averageScore REAL DEFAULT 0,
        tags TEXT,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL
      )
    `);
    
    saveDatabase();
  }

  return db;
}

// Save database to localStorage
function saveDatabase() {
  if (!db) return;
  const data = db.export();
  const buffer = Array.from(data);
  localStorage.setItem('quizDatabase', JSON.stringify(buffer));
}

/**
 * Génère un GUID unique
 */
export function generateGUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/**
 * Crée une nouvelle structure de quiz
 */
export function createQuizStructure(title = 'New Quiz', description = '') {
  return {
    id: generateGUID(),
    title,
    description,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: 'draft', // draft, published, archived
    surveyData: {
      title: title,
      description: description,
      logoPosition: 'right',
      pages: [
        {
          name: 'page1',
          elements: [
            {
              type: 'text',
              name: 'question1',
              title: 'Sample Question',
              isRequired: true
            }
          ]
        }
      ]
    },
    metadata: {
      totalQuestions: 1,
      totalResponses: 0,
      averageScore: 0,
      tags: []
    }
  };
}

/**
 * Sauvegarde un quiz
 */
export async function saveQuiz(quiz) {
  try {
    await initDB();
    
    const existingQuiz = await getQuizById(quiz.id);
    quiz.updatedAt = new Date().toISOString();
    
    const surveyDataStr = JSON.stringify(quiz.surveyData);
    const tagsStr = JSON.stringify(quiz.metadata?.tags || []);
    
    if (existingQuiz) {
      // Update existing quiz
      db.run(`
        UPDATE quizzes 
        SET title = ?, description = ?, status = ?, surveyData = ?, 
            totalQuestions = ?, totalResponses = ?, averageScore = ?, 
            tags = ?, updatedAt = ?
        WHERE id = ?
      `, [
        quiz.title,
        quiz.description,
        quiz.status,
        surveyDataStr,
        quiz.metadata?.totalQuestions || 0,
        quiz.metadata?.totalResponses || 0,
        quiz.metadata?.averageScore || 0,
        tagsStr,
        quiz.updatedAt,
        quiz.id
      ]);
    } else {
      // Insert new quiz
      db.run(`
        INSERT INTO quizzes (id, title, description, status, surveyData, 
                            totalQuestions, totalResponses, averageScore, 
                            tags, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        quiz.id,
        quiz.title,
        quiz.description,
        quiz.status,
        surveyDataStr,
        quiz.metadata?.totalQuestions || 0,
        quiz.metadata?.totalResponses || 0,
        quiz.metadata?.averageScore || 0,
        tagsStr,
        quiz.createdAt,
        quiz.updatedAt
      ]);
    }
    
    saveDatabase();
    return { success: true, quiz };
  } catch (error) {
    console.error('Error saving quiz:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Récupère tous les quiz
 */
export async function getAllQuizzes() {
  try {
    await initDB();
    
    const result = db.exec('SELECT * FROM quizzes ORDER BY updatedAt DESC');
    
    if (result.length === 0) return [];
    
    const columns = result[0].columns;
    const values = result[0].values;
    
    return values.map(row => {
      const quiz = {};
      columns.forEach((col, index) => {
        quiz[col] = row[index];
      });
      
      // Parse JSON fields
      quiz.surveyData = JSON.parse(quiz.surveyData);
      const tags = JSON.parse(quiz.tags || '[]');
      
      quiz.metadata = {
        totalQuestions: quiz.totalQuestions,
        totalResponses: quiz.totalResponses,
        averageScore: quiz.averageScore,
        tags
      };
      
      return quiz;
    });
  } catch (error) {
    console.error('Error loading quizzes:', error);
    return [];
  }
}

/**
 * Récupère un quiz par son ID
 */
export async function getQuizById(id) {
  try {
    await initDB();
    
    const result = db.exec('SELECT * FROM quizzes WHERE id = ?', [id]);
    
    if (result.length === 0 || result[0].values.length === 0) return null;
    
    const columns = result[0].columns;
    const row = result[0].values[0];
    
    const quiz = {};
    columns.forEach((col, index) => {
      quiz[col] = row[index];
    });
    
    // Parse JSON fields
    quiz.surveyData = JSON.parse(quiz.surveyData);
    const tags = JSON.parse(quiz.tags || '[]');
    
    quiz.metadata = {
      totalQuestions: quiz.totalQuestions,
      totalResponses: quiz.totalResponses,
      averageScore: quiz.averageScore,
      tags
    };
    
    return quiz;
  } catch (error) {
    console.error('Error loading quiz:', error);
    return null;
  }
}

/**
 * Supprime un quiz
 */
export async function deleteQuiz(id) {
  try {
    await initDB();
    
    db.run('DELETE FROM quizzes WHERE id = ?', [id]);
    saveDatabase();
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting quiz:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Met à jour les métadonnées d'un quiz
 */
export async function updateQuizMetadata(id, metadata) {
  const quiz = await getQuizById(id);
  if (!quiz) return { success: false, error: 'Quiz not found' };
  
  quiz.metadata = { ...quiz.metadata, ...metadata };
  return saveQuiz(quiz);
}

/**
 * Change le statut d'un quiz
 */
export async function updateQuizStatus(id, status) {
  const quiz = await getQuizById(id);
  if (!quiz) return { success: false, error: 'Quiz not found' };
  
  quiz.status = status;
  return saveQuiz(quiz);
}
