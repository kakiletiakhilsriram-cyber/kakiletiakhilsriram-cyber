
import React, { useContext, useMemo, useState } from 'react';
import { AppContext } from '../App';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { Cow } from '../types';

const Reports: React.FC = () => {
  const appContext = useContext(AppContext);
  const [selectedCowId, setSelectedCowId] = useState<string>('all');
  
  if (!appContext) return null;
  const { cows, milkRecords } = appContext;

  const chartData = useMemo(() => {
    const dateMap: { [date: string]: { date: string; total?: number; [cowId: string]: any } } = {};

    milkRecords.forEach(record => {
      if (!dateMap[record.date]) {
        dateMap[record.date] = { date: record.date };
      }
      dateMap[record.date][record.cowId] = record.amount;
    });

    const data = Object.values(dateMap).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    // Calculate total for 'all' option
    data.forEach(d => {
        d.total = cows.reduce((sum, cow) => sum + (d[cow.id] || 0), 0)
    });

    return data;

  }, [milkRecords, cows]);
  
  const todaySummary = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const todaysRecords = milkRecords.filter(r => r.date === today);
    const over: Cow[] = [];
    const under: Cow[] = [];
    const exact: Cow[] = [];

    cows.forEach(cow => {
      const record = todaysRecords.find(r => r.cowId === cow.id);
      if (record) {
        if (record.amount > cow.expectedYield) over.push(cow);
        else if (record.amount < cow.expectedYield) under.push(cow);
        else exact.push(cow);
      }
    });
    return { over, under, exact };
  }, [cows, milkRecords]);


  const selectedCow = cows.find(c => c.id === selectedCowId);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-brand-dark">Milk Production Analysis</h1>

      <div className="bg-white p-6 rounded-xl shadow-md">
        <div className="flex flex-col md:flex-row justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-brand-dark mb-2 md:mb-0">Production Trends</h2>
            <select
                value={selectedCowId}
                onChange={e => setSelectedCowId(e.target.value)}
                className="p-2 border border-gray-300 rounded-md focus:ring-brand-primary focus:border-brand-primary"
            >
                <option value="all">All Cows (Total)</option>
                {cows.filter(c => c.gender === 'Female').map(cow => (
                    <option key={cow.id} value={cow.id}>{cow.name}</option>
                ))}
            </select>
        </div>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis label={{ value: 'Milk (L)', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Legend />
            {selectedCowId === 'all' ? (
                 <Line type="monotone" dataKey="total" name="Total Production" stroke="#4A7C59" strokeWidth={2} />
            ) : (
                selectedCow && <Line type="monotone" dataKey={selectedCow.id} name={selectedCow.name} stroke="#F4A261" strokeWidth={2} />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-bold text-brand-dark mb-4">Today's Performance Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
                <h3 className="font-semibold text-green-600 mb-2">Over-performing Cows ({todaySummary.over.length})</h3>
                <ul className="text-sm space-y-1">
                    {todaySummary.over.map(c => <li key={c.id}>{c.name}</li>)}
                </ul>
            </div>
             <div>
                <h3 className="font-semibold text-red-600 mb-2">Under-performing Cows ({todaySummary.under.length})</h3>
                <ul className="text-sm space-y-1">
                    {todaySummary.under.map(c => <li key={c.id}>{c.name}</li>)}
                </ul>
            </div>
             <div>
                <h3 className="font-semibold text-gray-600 mb-2">Meeting Expectations ({todaySummary.exact.length})</h3>
                 <ul className="text-sm space-y-1">
                    {todaySummary.exact.map(c => <li key={c.id}>{c.name}</li>)}
                </ul>
            </div>
        </div>
        <div className="mt-6 flex justify-end">
            <button className="px-4 py-2 bg-brand-secondary text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors">
                Export Report (PDF)
            </button>
        </div>
      </div>
    </div>
  );
};

export default Reports;
