
import React, { useContext, useMemo } from 'react';
import { AppContext } from '../App';
import { CowIcon, MilkIcon, BellIcon } from './icons';

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode; color: string }> = ({ title, value, icon, color }) => (
  <div className="bg-white p-6 rounded-xl shadow-md flex items-center space-x-4">
    <div className={`p-3 rounded-full ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-bold text-brand-dark">{value}</p>
    </div>
  </div>
);


const Dashboard: React.FC = () => {
  const appContext = useContext(AppContext);
  if (!appContext) return null;

  const { cows, milkRecords } = appContext;

  const dashboardData = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const todaysRecords = milkRecords.filter(r => r.date === today && r.amount > 0);
    const totalMilkToday = todaysRecords.reduce((sum, r) => sum + r.amount, 0);
    const milkingCows = new Set(todaysRecords.map(r => r.cowId)).size;
    
    const avgMilk = milkingCows > 0 ? (totalMilkToday / milkingCows).toFixed(1) : 0;
    
    const upcomingVaccinations = cows.filter(cow => {
        const nextDueDate = cow.vaccinations[cow.vaccinations.length-1]?.nextDueDate;
        if (!nextDueDate) return false;
        const diff = new Date(nextDueDate).getTime() - new Date().getTime();
        return diff > 0 && diff < 30 * 24 * 60 * 60 * 1000; // within 30 days
    }).length;

    const upcomingPregnancies = cows.filter(cow => {
        if (!cow.pregnancy.isPregnant || !cow.pregnancy.dueDate) return false;
        const diff = new Date(cow.pregnancy.dueDate).getTime() - new Date().getTime();
        return diff > 0 && diff < 30 * 24 * 60 * 60 * 1000; // within 30 days
    }).length;

    return {
      totalCows: cows.length,
      totalMilkToday,
      avgMilk,
      upcomingVaccinations,
      upcomingPregnancies
    };
  }, [cows, milkRecords]);


  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-brand-dark">Dashboard</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard title="Total Cows" value={dashboardData.totalCows} icon={<CowIcon className="w-6 h-6 text-white"/>} color="bg-blue-500" />
        <StatCard title="Today's Milk" value={`${dashboardData.totalMilkToday} L`} icon={<MilkIcon className="w-6 h-6 text-white"/>} color="bg-green-500" />
        <StatCard title="Average Yield" value={`${dashboardData.avgMilk} L`} icon={<MilkIcon className="w-6 h-6 text-white"/>} color="bg-yellow-500" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-bold text-brand-dark mb-4 flex items-center">
            <BellIcon className="w-6 h-6 mr-2 text-brand-accent"/> Alerts & Reminders
          </h2>
          <ul className="space-y-3">
            <li className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
              <span className="text-red-700">Upcoming Vaccinations (30 days)</span>
              <span className="font-bold text-red-900 bg-red-200 px-3 py-1 rounded-full text-sm">{dashboardData.upcomingVaccinations}</span>
            </li>
            <li className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <span className="text-blue-700">Expected Deliveries (30 days)</span>
              <span className="font-bold text-blue-900 bg-blue-200 px-3 py-1 rounded-full text-sm">{dashboardData.upcomingPregnancies}</span>
            </li>
             <li className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
              <span className="text-yellow-700">Cows under observation</span>
              <span className="font-bold text-yellow-900 bg-yellow-200 px-3 py-1 rounded-full text-sm">{cows.filter(c => c.healthStatus === 'Under Observation').length}</span>
            </li>
          </ul>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md">
           <h2 className="text-xl font-bold text-brand-dark mb-4">Quick Actions</h2>
           <div className="grid grid-cols-2 gap-4">
              <button onClick={() => appContext.setCurrentScreen('ADD_MILK')} className="p-4 bg-brand-primary text-white rounded-lg font-semibold hover:bg-green-800 transition-colors">Add Milk Records</button>
              <button onClick={() => appContext.setCurrentScreen('COWS')} className="p-4 bg-brand-secondary text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors">View All Cows</button>
              <button onClick={() => appContext.setCurrentScreen('REPORTS')} className="p-4 bg-brand-dark text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors">View Reports</button>
              <button onClick={() => appContext.setCurrentScreen('QR_SCANNER')} className="p-4 bg-brand-accent text-white rounded-lg font-semibold hover:bg-red-700 transition-colors">Scan QR Code</button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
