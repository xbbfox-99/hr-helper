
import React, { useState } from 'react';
import { Person, AppTab } from './types';
import NameListManager from './components/NameListManager';
import LuckyDraw from './components/LuckyDraw';
import Grouping from './components/Grouping';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.NAME_LIST);
  const [people, setPeople] = useState<Person[]>([]);

  const renderContent = () => {
    switch (activeTab) {
      case AppTab.NAME_LIST:
        return <NameListManager people={people} onUpdate={setPeople} />;
      case AppTab.LUCKY_DRAW:
        return <LuckyDraw people={people} />;
      case AppTab.GROUPING:
        return <Grouping people={people} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.628.282a2 2 0 01-1.808 0l-.628-.282a6 6 0 00-3.86-.517l-2.387.477a2 2 0 00-1.022.547l-1.168 1.168a2 2 0 00.556 3.212 9.035 9.035 0 007.146 0 2 2 0 00.556-3.212l-1.168-1.168z" /></svg>
            </div>
            <h1 className="text-xl font-black text-slate-800 tracking-tight">HR <span className="text-indigo-600">TOOLBOX</span></h1>
          </div>
          <div className="hidden sm:flex items-center gap-1">
             <div className="px-3 py-1 bg-slate-100 rounded-full text-xs font-bold text-slate-500">v1.0</div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 mb-8 bg-slate-200/50 p-1.5 rounded-2xl w-fit">
          <button 
            onClick={() => setActiveTab(AppTab.NAME_LIST)}
            className={`px-6 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${activeTab === AppTab.NAME_LIST ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:bg-slate-200/50'}`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
            名單管理
          </button>
          <button 
            onClick={() => setActiveTab(AppTab.LUCKY_DRAW)}
            className={`px-6 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${activeTab === AppTab.LUCKY_DRAW ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:bg-slate-200/50'}`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" /></svg>
            驚喜抽籤
          </button>
          <button 
            onClick={() => setActiveTab(AppTab.GROUPING)}
            className={`px-6 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${activeTab === AppTab.GROUPING ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:bg-slate-200/50'}`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
            自動分組
          </button>
        </div>

        {/* Dynamic Section */}
        <div className="animate-in fade-in duration-500">
          {renderContent()}
        </div>
      </main>

      {/* Sticky Quick View Footer (Mobile) */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 sm:hidden flex justify-around items-center z-40">
         <button onClick={() => setActiveTab(AppTab.NAME_LIST)} className={`p-2 rounded-lg ${activeTab === AppTab.NAME_LIST ? 'text-indigo-600 bg-indigo-50' : 'text-slate-400'}`}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
         </button>
         <button onClick={() => setActiveTab(AppTab.LUCKY_DRAW)} className={`p-2 rounded-lg ${activeTab === AppTab.LUCKY_DRAW ? 'text-indigo-600 bg-indigo-50' : 'text-slate-400'}`}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" /></svg>
         </button>
         <button onClick={() => setActiveTab(AppTab.GROUPING)} className={`p-2 rounded-lg ${activeTab === AppTab.GROUPING ? 'text-indigo-600 bg-indigo-50' : 'text-slate-400'}`}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
         </button>
      </footer>
    </div>
  );
};

export default App;
