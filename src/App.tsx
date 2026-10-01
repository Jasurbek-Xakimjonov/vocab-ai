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
import { Practice } from './pages/Practice';
import { MyWords } from './pages/MyWords';
import { Progress } from './pages/Progress';
import { VocabularyWord, UserStats } from './types/vocabulary';
import { Storage } from './utils/storage';

export function AppContent() {
  const [currentTab, setCurrentTab] = useState<NavTab>('home');
  const [words, setWords] = useState<VocabularyWord[]>([]);
  const [stats, setStats] = useState<UserStats>(() => Storage.getUserStats());

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
  }, [refreshWords, refreshStats]);

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

          {currentTab === 'import' && (
            <ImportVocabulary
              onNavigate={setCurrentTab}
              onRefreshWords={refreshWords}
            />
          )}

          {currentTab === 'flashcards' && (
            <Flashcards
              words={words}
              onRefreshWords={refreshWords}
              onNavigate={setCurrentTab}
            />
          )}

          {currentTab === 'practice' && (
            <Practice
              words={words}
              onRefreshWords={refreshWords}
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

          {currentTab === 'progress' && (
            <Progress
              words={words}
              stats={stats}
              onRefreshStats={refreshStats}
              onNavigate={setCurrentTab}
            />
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav currentTab={currentTab} onSelectTab={setCurrentTab} />
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}
