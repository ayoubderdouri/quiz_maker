"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authHelpers } from "@/lib/authHelpers";
import {
  ArrowRight,
  Zap,
  Users,
  BarChart3,
  CheckCircle2,
  Clock,
  Shield,
  Sparkles,
  Target,
  GraduationCap,
  Building2,
  Award,
  TrendingUp,
  Lock,
  Share2,
  FileEdit,
  Send,
} from "lucide-react";
import GuestLayout from "@/components/GuestLayout";

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Si l'utilisateur est authentifié, le rediriger vers les quiz
    const token = authHelpers.getToken();
    if (token) {
      router.push("/dashboard");
    } else {
      setIsLoading(false);
    }
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-white to-blue-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <GuestLayout>
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-6 text-center">
        <div className="max-w-4xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-700">
              Propulsé par l'Intelligence Artificielle
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent leading-tight">
            La Plateforme de Quiz
            <br />
            Nouvelle Génération
          </h1>

          <p className="text-xl md:text-2xl text-zinc-600 mb-4 max-w-3xl mx-auto">
            Transformez vos idées en quiz interactifs en quelques secondes. L'IA
            génère les questions, vous récoltez les insights.
          </p>

          <p className="text-lg text-zinc-500 mb-10 max-w-2xl mx-auto">
            Parfait pour les formateurs, enseignants, recruteurs et équipes qui
            veulent évaluer efficacement et professionnellement.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link
              href="/auth/register"
              className="flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl w-full sm:w-auto justify-center text-lg"
            >
              Démarrer Gratuitement
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/auth/login"
              className="px-8 py-4 border-2 border-zinc-300 hover:border-zinc-400 hover:bg-zinc-50 text-zinc-900 rounded-lg font-semibold transition-all text-lg"
            >
              Se Connecter
            </Link>
          </div>

          {/* Social Proof */}
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-zinc-500 pt-8 border-t border-zinc-200">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <span>Aucune carte bancaire requise</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              <span>Configuration en 2 minutes</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-purple-600" />
              <span>Données sécurisées</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-zinc-900">
              Tout ce dont vous avez besoin
            </h2>
            <p className="text-xl text-zinc-600 max-w-2xl mx-auto">
              Une solution complète pour créer, partager et analyser vos quiz
              professionnels
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-xl bg-gradient-to-br from-blue-50 to-white border border-blue-200 hover:border-blue-300 shadow-sm hover:shadow-lg transition-all">
              <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center mb-6">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-bold text-2xl mb-3 text-zinc-900">
                Génération IA Instantanée
              </h3>
              <p className="text-zinc-600 leading-relaxed mb-4">
                Notre IA crée des questions pertinentes et variées en quelques
                secondes. Fournissez un sujet, obtenez un quiz complet.
              </p>
              <ul className="space-y-2 text-sm text-zinc-600">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>Questions adaptées au niveau</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>Formats variés (QCM, vrai/faux)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>Personnalisation complète</span>
                </li>
              </ul>
            </div>

            <div className="p-8 rounded-xl bg-gradient-to-br from-purple-50 to-white border border-purple-200 hover:border-purple-300 shadow-sm hover:shadow-lg transition-all">
              <div className="w-14 h-14 bg-purple-600 rounded-xl flex items-center justify-center mb-6">
                <Users className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-bold text-2xl mb-3 text-zinc-900">
                Partage Simplifié
              </h3>
              <p className="text-zinc-600 leading-relaxed mb-4">
                Diffusez vos quiz en un clic avec des liens sécurisés. Aucune
                inscription requise pour les participants.
              </p>
              <ul className="space-y-2 text-sm text-zinc-600">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                  <span>Liens uniques et sécurisés</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                  <span>Accès sans authentification</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                  <span>Responsive sur tous appareils</span>
                </li>
              </ul>
            </div>

            <div className="p-8 rounded-xl bg-gradient-to-br from-green-50 to-white border border-green-200 hover:border-green-300 shadow-sm hover:shadow-lg transition-all">
              <div className="w-14 h-14 bg-green-600 rounded-xl flex items-center justify-center mb-6">
                <BarChart3 className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-bold text-2xl mb-3 text-zinc-900">
                Analytics Temps Réel
              </h3>
              <p className="text-zinc-600 leading-relaxed mb-4">
                Suivez les performances et identifiez les tendances avec des
                tableaux de bord intuitifs et des statistiques détaillées.
              </p>
              <ul className="space-y-2 text-sm text-zinc-600">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Taux de réussite par question</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Statistiques détaillées</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Export des résultats</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-blue-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-zinc-900">
              Simple. Rapide. Efficace.
            </h2>
            <p className="text-xl text-zinc-600 max-w-2xl mx-auto">
              Créez votre premier quiz professionnel en 4 étapes
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="relative h-full">
              <div className="h-full bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-all border border-zinc-200">
                <FileEdit className="w-10 h-10 text-blue-600 mb-4" />
                <h3 className="font-bold text-xl mb-3 text-zinc-900">
                  Définissez le sujet
                </h3>
                <p className="text-zinc-600">
                  Indiquez le thème et le niveau de difficulté de votre quiz
                </p>
              </div>
              <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-blue-300"></div>
            </div>

            <div className="relative h-full">
              <div className="h-full bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-all border border-zinc-200">
                <Sparkles className="w-10 h-10 text-blue-600 mb-4" />
                <h3 className="font-bold text-xl mb-3 text-zinc-900">
                  L'IA génère
                </h3>
                <p className="text-zinc-600">
                  Notre intelligence artificielle crée des questions pertinentes
                  instantanément
                </p>
              </div>
              <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-blue-300"></div>
            </div>

            <div className="relative h-full">
              <div className="h-full bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-all border border-zinc-200">
                <Share2 className="w-10 h-10 text-blue-600 mb-4" />
                <h3 className="font-bold text-xl mb-3 text-zinc-900">
                  Partagez
                </h3>
                <p className="text-zinc-600">
                  Diffusez votre quiz via un lien sécurisé à vos participants
                </p>
              </div>
              <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-blue-300"></div>
            </div>

            <div className="h-full">
              <div className="h-full bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-all border border-zinc-200">
                <TrendingUp className="w-10 h-10 text-blue-600 mb-4" />
                <h3 className="font-bold text-xl mb-3 text-zinc-900">
                  Analysez
                </h3>
                <p className="text-zinc-600">
                  Consultez les résultats et les statistiques en temps réel
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-zinc-900">
              Pour tous vos besoins
            </h2>
            <p className="text-xl text-zinc-600 max-w-2xl mx-auto">
              Une solution adaptée à chaque contexte professionnel
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-xl bg-white border-2 border-zinc-200 hover:border-blue-400 transition-all shadow-sm hover:shadow-lg">
              <GraduationCap className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="font-bold text-2xl mb-3 text-zinc-900">
                Éducation & Formation
              </h3>
              <p className="text-zinc-600 mb-4">
                Créez des évaluations pour vos étudiants, des tests de
                compréhension et des examens blancs.
              </p>
              <ul className="space-y-2 text-sm text-zinc-600">
                <li className="flex items-start gap-2">
                  <Target className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>Évaluations formatives et sommatives</span>
                </li>
                <li className="flex items-start gap-2">
                  <Target className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>Révision et préparation aux examens</span>
                </li>
                <li className="flex items-start gap-2">
                  <Target className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>Certification et validation des acquis</span>
                </li>
              </ul>
            </div>

            <div className="p-8 rounded-xl bg-white border-2 border-zinc-200 hover:border-purple-400 transition-all shadow-sm hover:shadow-lg">
              <Building2 className="w-12 h-12 text-purple-600 mb-4" />
              <h3 className="font-bold text-2xl mb-3 text-zinc-900">
                Entreprises & RH
              </h3>
              <p className="text-zinc-600 mb-4">
                Évaluez les compétences des candidats, formez vos équipes et
                mesurez les connaissances.
              </p>
              <ul className="space-y-2 text-sm text-zinc-600">
                <li className="flex items-start gap-2">
                  <Target className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                  <span>Tests de recrutement et présélection</span>
                </li>
                <li className="flex items-start gap-2">
                  <Target className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                  <span>Formation et onboarding</span>
                </li>
                <li className="flex items-start gap-2">
                  <Target className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                  <span>Évaluation des compétences internes</span>
                </li>
              </ul>
            </div>

            <div className="p-8 rounded-xl bg-white border-2 border-zinc-200 hover:border-green-400 transition-all shadow-sm hover:shadow-lg">
              <Award className="w-12 h-12 text-green-600 mb-4" />
              <h3 className="font-bold text-2xl mb-3 text-zinc-900">
                Événements & Marketing
              </h3>
              <p className="text-zinc-600 mb-4">
                Engagez votre audience avec des quiz interactifs lors de vos
                événements et campagnes.
              </p>
              <ul className="space-y-2 text-sm text-zinc-600">
                <li className="flex items-start gap-2">
                  <Target className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Quiz d'engagement et gamification</span>
                </li>
                <li className="flex items-start gap-2">
                  <Target className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Collecte de leads qualifiés</span>
                </li>
                <li className="flex items-start gap-2">
                  <Target className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Sondages et études de marché</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-zinc-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-zinc-900">
              Pourquoi nous choisir ?
            </h2>
            <p className="text-xl text-zinc-600 max-w-2xl mx-auto">
              Des avantages concrets pour optimiser votre productivité
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex gap-4 p-6 bg-white rounded-xl border border-zinc-200 hover:border-blue-300 transition-all shadow-sm">
              <div className="flex-shrink-0">
                <Clock className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-xl mb-2 text-zinc-900">
                  Gain de temps considérable
                </h3>
                <p className="text-zinc-600">
                  Plus besoin de passer des heures à rédiger des questions. L'IA
                  fait le travail en quelques secondes, vous permettant de vous
                  concentrer sur l'essentiel.
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-6 bg-white rounded-xl border border-zinc-200 hover:border-purple-300 transition-all shadow-sm">
              <div className="flex-shrink-0">
                <Shield className="w-8 h-8 text-purple-600" />
              </div>
              <div>
                <h3 className="font-bold text-xl mb-2 text-zinc-900">
                  Qualité professionnelle
                </h3>
                <p className="text-zinc-600">
                  Des questions pertinentes, variées et adaptées au niveau
                  souhaité. Chaque quiz reflète votre professionnalisme.
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-6 bg-white rounded-xl border border-zinc-200 hover:border-green-300 transition-all shadow-sm">
              <div className="flex-shrink-0">
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <h3 className="font-bold text-xl mb-2 text-zinc-900">
                  Insights exploitables
                </h3>
                <p className="text-zinc-600">
                  Identifiez rapidement les points forts et les lacunes grâce à
                  des analytics détaillés et visuels.
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-6 bg-white rounded-xl border border-zinc-200 hover:border-orange-300 transition-all shadow-sm">
              <div className="flex-shrink-0">
                <Zap className="w-8 h-8 text-orange-600" />
              </div>
              <div>
                <h3 className="font-bold text-xl mb-2 text-zinc-900">
                  Simplicité d'utilisation
                </h3>
                <p className="text-zinc-600">
                  Interface intuitive, aucune formation nécessaire. Créez et
                  partagez vos quiz en quelques clics.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Security & Trust Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-zinc-900">
              Sécurité et Confidentialité
            </h2>
            <p className="text-xl text-zinc-600 max-w-2xl mx-auto">
              Vos données et celles de vos participants sont protégées
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-bold text-lg mb-2 text-zinc-900">
                Données chiffrées
              </h3>
              <p className="text-zinc-600 text-sm">
                Toutes les données sont chiffrées en transit et au repos avec
                les standards industriels les plus élevés.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-bold text-lg mb-2 text-zinc-900">
                Conformité RGPD
              </h3>
              <p className="text-zinc-600 text-sm">
                Nous respectons scrupuleusement le RGPD et les réglementations
                internationales sur la protection des données.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-bold text-lg mb-2 text-zinc-900">
                Fiabilité garantie
              </h3>
              <p className="text-zinc-600 text-sm">
                Infrastructure robuste avec des sauvegardes automatiques et une
                disponibilité maximale.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-blue-600 to-blue-800 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Prêt à créer votre premier quiz ?
          </h2>
          <p className="text-xl md:text-2xl mb-8 text-blue-100">
            Rejoignez les professionnels qui utilisent déjà notre plateforme
            pour évaluer efficacement.
          </p>
          <p className="text-lg mb-10 text-blue-200">
            Gratuit, sans engagement, configuration en 2 minutes
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/auth/register"
              className="flex items-center gap-2 px-10 py-4 bg-white text-blue-600 hover:bg-blue-50 rounded-lg font-bold transition-all shadow-xl hover:shadow-2xl text-lg w-full sm:w-auto justify-center"
            >
              Créer un compte gratuit
              <ArrowRight className="w-6 h-6" />
            </Link>
            <Link
              href="/auth/login"
              className="px-10 py-4 border-2 border-white text-white hover:bg-white hover:text-blue-600 rounded-lg font-bold transition-all text-lg"
            >
              J'ai déjà un compte
            </Link>
          </div>
        </div>
      </section>
    </GuestLayout>
  );
}
