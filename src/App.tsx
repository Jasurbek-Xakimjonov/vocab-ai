/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { ToastProvider } from './components/Toast';
import { Sidebar, NavTab } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { MobileNav } from './components/MobileNav';
import { Dashboard } from './pages/Dashboard';
import { ImportVocabulary } from './pages/ImportVocabulary';
import { Flashcards } from './pages/Flashcards';
import { IrregularVerbs } from './pages/IrregularVerbs';
import { Speaking } from './pages/Speaking';
import { SpeakingVideos } from './pages/SpeakingVideos';
import { SpeakingBuddy } from './pages/SpeakingBuddy';
import { Grammar } from './pages/Grammar';
import { Practice } from './pages/Practice';
import { MyWords } from './pages/MyWords';
import { Progress } from './pages/Progress';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { VocabularyWord, UserStats } from './types/vocabulary';
import { IrregularVerb } from './types/irregularVerbs';
import { GrammarTopic } from './types/grammar';
import { Storage } from './utils/storage';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AuthModal } from './components/AuthModal';

export function AppContent() {
  const { user, profile, loading } = useAuth();
  const [currentTab, setCurrentTab] = useState<NavTab>('home');
  const [words, setWords] = useState<VocabularyWord[]>([]);
  const [stats, setStats] = useState<UserStats>(() => Storage.getUserStats());

  // Global search & deep-link states
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedVerbFromSearch, setSelectedVerbFromSearch] = useState<IrregularVerb | null>(null);
  const [selectedTopicFromSearch, setSelectedTopicFromSearch] = useState<GrammarTopic | null>(null);

  // Refresh words & stats
  const refreshWords = useCallback(() => {
    setWords(Storage.getWords());
  }, []);

  const refreshStats = useCallback(() => {
    setStats(Storage.getUserStats());
  }, []);

  useEffect(() => {
    refreshWords();
    refreshStats();

    const handleWordsUpdate = () => refreshWords();
    const handleStatsUpdate = () => refreshStats();

    window.addEventListener('vocabai_words_updated', handleWordsUpdate);
    window.addEventListener('vocabai_stats_updated', handleStatsUpdate);

    return () => {
      window.removeEventListener('vocabai_words_updated', handleWordsUpdate);
      window.removeEventListener('vocabai_stats_updated', handleStatsUpdate);
    };
  }, [user, refreshWords, refreshStats]);

  // Global shortcut (Ctrl/Cmd + K) for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Loading Screen
  if (loading) {
    return (
      <div className="min-h-screen bg-[#070a11] text-slate-100 flex flex-col items-center justify-center p-6 space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-300 via-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-black shadow-2xl shadow-amber-400/20 text-2xl animate-pulse">
          V
        </div>
        <div className="text-amber-300 text-sm font-semibold tracking-wide">
          VocabAI yuklanmoqda...
        </div>
      </div>
    );
  }

  // Auth Protection Gate: Non-logged in users must login/register
  if (!user) {
    return (
      <div className="min-h-screen bg-[#070a11] text-slate-100 flex flex-col justify-center items-center p-4">
        <AuthModal isOpen={true} canClose={false} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070a11] text-slate-100 flex flex-col lg:flex-row antialiased">
      {/* Desktop Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        stats={stats}
        totalWordsCount={words.length}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen pb-20 lg:pb-10">
        {/* Top Navbar */}
        <Navbar
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          stats={stats}
          totalWords={words.length}
          onOpenSearch={() => setIsSearchOpen(true)}
        />

        {/* Workspace */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-in fade-in duration-200">
          {currentTab === 'home' && (
            <Dashboard
              words={words}
              stats={stats}
              onNavigate={setCurrentTab}
            />
          )}

          {currentTab === 'my-words' && (
            <MyWords
              words={words}
              onRefreshWords={refreshWords}
              onNavigate={setCurrentTab}
            />
          )}

          {currentTab === 'flashcards' && (
            <Flashcards
              words={words}
              onRefreshWords={refreshWords}
              onNavigate={setCurrentTab}
            />
          )}

          {currentTab === 'irregular-verbs' && (
            <IrregularVerbs
              onNavigate={setCurrentTab}
              selectedVerbFromSearch={selectedVerbFromSearch}
            />
          )}

          {currentTab === 'speaking' && (
            <Speaking />
          )}

          {currentTab === 'speaking-videos' && (
            <SpeakingVideos
              onRefreshWords={refreshWords}
              onNavigate={setCurrentTab}
            />
          )}

          {currentTab === 'ai-speaking' && (
            <SpeakingBuddy
              onRefreshWords={refreshWords}
              onNavigate={setCurrentTab}
            />
          )}

          {currentTab === 'grammar' && (
            <Grammar
              selectedTopicFromSearch={selectedTopicFromSearch}
            />
          )}

          {currentTab === 'practice' && (
            <Practice
              words={words}
              onRefreshWords={refreshWords}
              onNavigate={setCurrentTab}
            />
          )}

          {currentTab === 'progress' && (
            <Progress
              words={words}
              stats={stats}
              onRefreshStats={refreshStats}
              onNavigate={setCurrentTab}
            />
          )}

          {currentTab === 'import' && (
            <ImportVocabulary
              onNavigate={setCurrentTab}
              onRefreshWords={refreshWords}
            />
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav currentTab={currentTab} onSelectTab={setCurrentTab} />

      {/* Global Search Modal */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={setCurrentTab}
        words={words}
        onOpenVerbDetail={(v) => {
          setSelectedVerbFromSearch(v);
          setCurrentTab('irregular-verbs');
        }}
        onOpenGrammarTopic={(g) => {
          setSelectedTopicFromSearch(g);
          setCurrentTab('grammar');
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ToastProvider>
  );
}
