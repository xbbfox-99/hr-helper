
import React, { useState, useMemo } from 'react';
import { Person } from '../types';

interface Props {
  people: Person[];
  onUpdate: (people: Person[]) => void;
}

const NameListManager: React.FC<Props> = ({ people, onUpdate }) => {
  const [inputText, setInputText] = useState('');
  const [activeInput, setActiveInput] = useState<'csv' | 'text'>('text');

  // 偵測重複姓名
  const duplicateNames = useMemo(() => {
    const names = people.map(p => p.name);
    return names.filter((name, index) => names.indexOf(name) !== index);
  }, [people]);

  const hasDuplicates = duplicateNames.length > 0;

  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const rows = text.split(/\r?\n/);
      const newPeople: Person[] = rows
        .map(row => row.trim())
        .filter(row => row.length > 0)
        .map(row => {
          const name = row.split(',')[0].trim();
          return { id: crypto.randomUUID(), name };
        });
      onUpdate([...people, ...newPeople]);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleTextSubmit = () => {
    const names = inputText.split('\n')
      .map(n => n.trim())
      .filter(n => n.length > 0);
    
    const newPeople: Person[] = names.map(name => ({
      id: crypto.randomUUID(),
      name
    }));
    
    onUpdate([...people, ...newPeople]);
    setInputText('');
  };

  const loadSampleData = () => {
    const samples = [
      "陳小明", "林翠花", "張大千", "李思思", "王小二", 
      "陳小明", "趙六", "孫七", "周八", "林翠花", 
      "鄭九", "何十"
    ];
    const newPeople: Person[] = samples.map(name => ({
      id: crypto.randomUUID(),
      name
    }));
    onUpdate(newPeople);
  };

  const removeDuplicates = () => {
    const seen = new Set();
    const uniquePeople = people.filter(p => {
      if (seen.has(p.name)) return false;
      seen.add(p.name);
      return true;
    });
    onUpdate(uniquePeople);
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
      <div className="flex justify-between items-start mb-6">
        <h2 className="text-xl font-bold text-slate-800 flex items-center">
          <span className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center mr-3">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
          </span>
          名單管理
        </h2>
        <button 
          onClick={loadSampleData}
          className="text-xs font-bold text-indigo-500 hover:text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100 transition-colors"
        >
          💡 載入模擬名單
        </button>
      </div>

      <div className="flex gap-4 mb-6 p-1 bg-slate-100 rounded-xl w-fit">
        <button 
          onClick={() => setActiveInput('text')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeInput === 'text' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
        >
          手動輸入
        </button>
        <button 
          onClick={() => setActiveInput('csv')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeInput === 'csv' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
        >
          CSV 上傳
        </button>
      </div>

      {activeInput === 'text' ? (
        <div className="space-y-4">
          <textarea
            className="w-full h-40 p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none transition-all"
            placeholder="請輸入姓名，一行一個名字..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          <button
            onClick={handleTextSubmit}
            disabled={!inputText.trim()}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors disabled:opacity-50"
          >
            添加至名單
          </button>
        </div>
      ) : (
        <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:border-indigo-300 transition-colors cursor-pointer relative">
          <input
            type="file"
            accept=".csv"
            onChange={handleCsvUpload}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
          <div className="text-slate-400">
            <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
            <p className="font-medium text-slate-700">點擊或拖拽 CSV 檔案至此</p>
            <p className="text-sm">第一欄將被識別為姓名</p>
          </div>
        </div>
      )}

      {people.length > 0 && (
        <div className="mt-8 border-t border-slate-100 pt-6">
          {hasDuplicates && (
            <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center gap-3 text-amber-800">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                <p className="text-sm font-bold">偵測到 {duplicateNames.length} 個重複的姓名！</p>
              </div>
              <button 
                onClick={removeDuplicates}
                className="text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white px-3 py-1.5 rounded-lg transition-colors"
              >
                一鍵移除重複
              </button>
            </div>
          )}

          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-slate-700">目前名單 ({people.length} 人)</h3>
            <button 
              onClick={() => onUpdate([])}
              className="text-sm text-red-500 hover:text-red-600 font-medium"
            >
              全部清除
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
            {people.map(p => {
              const isDuplicate = people.filter(x => x.name === p.name).length > 1;
              return (
                <div 
                  key={p.id} 
                  className={`border rounded-lg px-3 py-2 text-sm flex justify-between items-center group transition-colors ${
                    isDuplicate ? 'bg-amber-50 border-amber-200' : 'bg-slate-50 border-slate-100'
                  }`}
                >
                  <span className={`truncate ${isDuplicate ? 'text-amber-700 font-bold' : ''}`}>
                    {p.name}
                    {isDuplicate && <span className="ml-1 text-[10px] opacity-60">(重複)</span>}
                  </span>
                  <button 
                    onClick={() => onUpdate(people.filter(x => x.id !== p.id))}
                    className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default NameListManager;
