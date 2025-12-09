import React, { useState, useContext, useMemo } from 'react';
import { AppContext } from '../App';
import type { MilkRecord, Cow } from '../types';
import { Gender } from '../types';

const AddMilkRecords: React.FC = () => {
  const appContext = useContext(AppContext);
  if (!appContext) return null;

  const { cows, milkRecords, setMilkRecords } = appContext;
  
  const today = new Date().toISOString().split('T')[0];

  const milkingCows = useMemo(() => cows.filter(c => c.gender === Gender.Female), [cows]);

  const getInitialRecords = () => {
    const initial: { [key: string]: string } = {};
    milkingCows.forEach(cow => {
      const existingRecord = milkRecords.find(r => r.cowId === cow.id && r.date === today);
      initial[cow.id] = existingRecord ? String(existingRecord.amount) : '';
    });
    return initial;
  };

  const [dailyRecords, setDailyRecords] = useState<{ [key: string]: string }>(getInitialRecords());
  const [feedbackMessage, setFeedbackMessage] = useState('');

  const handleInputChange = (cowId: string, amount: string) => {
    const newRecords = { ...dailyRecords, [cowId]: amount };
    setDailyRecords(newRecords);
  };

  const handleSaveAll = () => {
    const updatedMilkRecords: MilkRecord[] = [...milkRecords.filter(r => r.date !== today)];
    
    Object.entries(dailyRecords).forEach(([cowId, amountStr]) => {
      // Fix: Cast amountStr to string. In some TS configurations, Object.entries infers the value as 'unknown'.
      const amount = parseFloat(amountStr as string);
      if (!isNaN(amount) && amount >= 0) {
        updatedMilkRecords.push({
          cowId,
          date: today,
          amount,
        });
      }
    });

    setMilkRecords(updatedMilkRecords);
    setFeedbackMessage('Milk records saved successfully!');
    setTimeout(() => setFeedbackMessage(''), 3000);
  };
  
  const getYieldStatus = (cow: Cow) => {
      const amount = parseFloat(dailyRecords[cow.id]);
      if (isNaN(amount)) return null;
      
      const diff = amount - cow.expectedYield;
      if (diff > 2) return <span className="text-xs text-green-600">(+{diff.toFixed(1)}L Over)</span>;
      if (diff < -2) return <span className="text-xs text-red-600">({diff.toFixed(1)}L Under)</span>;
      return <span className="text-xs text-gray-500">(Normal)</span>;
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-brand-dark">Add Daily Milk Records</h1>
      <p className="text-gray-600">Enter milk production for {today}.</p>
      
      {feedbackMessage && (
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-md" role="alert">
            <p>{feedbackMessage}</p>
          </div>
        )}
        
      <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
        {milkingCows.map(cow => (
          <div key={cow.id} className="grid grid-cols-1 md:grid-cols-3 items-center gap-4 py-2 border-b last:border-b-0">
            <div className="font-semibold text-brand-dark">{cow.name} <span className="text-sm text-gray-400">({cow.tagId})</span></div>
            <div className="flex items-center">
              <input
                type="number"
                min="0"
                step="0.1"
                className="w-full md:w-32 p-2 border border-gray-300 rounded-md focus:ring-brand-primary focus:border-brand-primary"
                placeholder="Liters"
                value={dailyRecords[cow.id] || ''}
                onChange={e => handleInputChange(cow.id, e.target.value)}
              />
               <span className="ml-2 text-sm text-gray-500">Liters</span>
            </div>
             <div className="text-sm">
                Expected: {cow.expectedYield}L {getYieldStatus(cow)}
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex justify-end">
          <button
            onClick={handleSaveAll}
            className="px-6 py-3 bg-brand-primary text-white font-bold rounded-lg shadow-md hover:bg-green-800 transition-colors"
            >
            Save All Records
            </button>
      </div>

    </div>
  );
};

export default AddMilkRecords;
