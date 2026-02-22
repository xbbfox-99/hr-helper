
import React, { useState } from 'react';
import { Person, Group } from '../types';
import { generateTeamNames } from '../services/geminiService';

interface Props {
  people: Person[];
}

const Grouping: React.FC<Props> = ({ people }) => {
  const [groupSize, setGroupSize] = useState(4);
  const [groups, setGroups] = useState<Group[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const performGrouping = async () => {
    if (people.length < 2) return;
    
    setIsProcessing(true);
    
    // Shuffle people
    const shuffled = [...people].sort(() => Math.random() - 0.5);
    const numberOfGroups = Math.ceil(shuffled.length / groupSize);
    
    // Optional: Get cool names from Gemini
    let teamNames: string[] = [];
    try {
      teamNames = await generateTeamNames(numberOfGroups);
    } catch {
      teamNames = Array.from({ length: numberOfGroups }, (_, i) => `第 ${i + 1} 組`);
    }

    const newGroups: Group[] = [];
    for (let i = 0; i < numberOfGroups; i++) {
      newGroups.push({
        id: i,
        name: teamNames[i] || `第 ${i + 1} 組`,
        members: shuffled.slice(i * groupSize, (i + 1) * groupSize)
      });
    }

    setGroups(newGroups);
    setIsProcessing(false);
  };

  const exportToCsv = () => {
    if (groups.length === 0) return;

    let csvContent = "\ufeff組別名稱,成員姓名\n";
    groups.forEach(group => {
      group.members.forEach(member => {
        csvContent += `${group.name},${member.name}\n`;
      });
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `分組結果_${new Date().toLocaleDateString()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (people.length === 0) {
    return (
      <div className="bg-white p-12 rounded-2xl shadow-sm border border-slate-100 text-center">
        <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
        </div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">請先建立名單</h2>
        <p className="text-slate-500">名單為空時無法進行分組</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
          分組設定
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
          <div className="space-y-3">
            <label className="text-sm font-semibold text-slate-600 block">每組人數</label>
            <div className="flex items-center gap-4">
              <input 
                type="range" 
                min="2" 
                max={Math.min(people.length, 20)} 
                value={groupSize}
                onChange={(e) => setGroupSize(parseInt(e.target.value))}
                className="flex-1 accent-indigo-600"
              />
              <span className="w-12 h-10 flex items-center justify-center bg-indigo-50 text-indigo-700 font-bold rounded-lg border border-indigo-100">
                {groupSize}
              </span>
            </div>
          </div>
          <button
            onClick={performGrouping}
            disabled={isProcessing}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition-all transform active:scale-95 disabled:opacity-50"
          >
            {isProcessing ? '正在智能命名分組...' : '開始隨機分組'}
          </button>
        </div>

        <div className="mt-4 text-xs text-slate-400">
          總人數: {people.length} 人，預計分為 {Math.ceil(people.length / groupSize)} 組
        </div>
      </div>

      {groups.length > 0 && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-slate-700">分組結果</h3>
            <button 
              onClick={exportToCsv}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold py-2 px-4 rounded-lg transition-all shadow-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              下載分組 CSV
            </button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-6 duration-500">
            {groups.map((group) => (
              <div key={group.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <div className="bg-indigo-50 px-4 py-3 border-b border-indigo-100 flex justify-between items-center">
                  <h3 className="font-bold text-indigo-900 truncate">{group.name}</h3>
                  <span className="text-xs bg-white text-indigo-600 px-2 py-0.5 rounded-full border border-indigo-100 font-medium">
                    {group.members.length} 人
                  </span>
                </div>
                <div className="p-4 bg-white space-y-2">
                  {group.members.map((member, idx) => (
                    <div key={member.id} className="flex items-center gap-3 text-slate-600">
                      <span className="text-[10px] text-slate-300 font-mono w-4">#{idx + 1}</span>
                      <span className="font-medium text-sm">{member.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Grouping;
