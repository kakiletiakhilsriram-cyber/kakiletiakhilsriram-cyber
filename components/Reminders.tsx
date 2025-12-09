
import React, { useContext, useMemo } from 'react';
import { AppContext } from '../App';
import type { Cow } from '../types';

const ReminderCard: React.FC<{ cow: Cow; date: string; type: 'Vaccination' | 'Delivery' }> = ({ cow, date, type }) => {
    const isOverdue = new Date(date) < new Date();
    const daysUntil = Math.ceil((new Date(date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

    return (
        <div className={`p-4 rounded-lg flex items-center space-x-4 ${type === 'Vaccination' ? 'bg-red-50' : 'bg-blue-50'}`}>
            <img src={cow.imageUrl} alt={cow.name} className="w-16 h-16 rounded-full object-cover" />
            <div>
                <p className="font-bold text-lg text-brand-dark">{cow.name} <span className="text-sm text-gray-500">({cow.tagId})</span></p>
                <p className={`font-semibold ${type === 'Vaccination' ? 'text-red-700' : 'text-blue-700'}`}>
                    {type} Due: {date}
                </p>
                 <p className={`text-sm ${isOverdue ? 'text-red-600 font-bold' : 'text-gray-600'}`}>
                   {isOverdue ? `${Math.abs(daysUntil)} days overdue` : `In ${daysUntil} days`}
                </p>
            </div>
        </div>
    );
};

const Reminders: React.FC = () => {
  const appContext = useContext(AppContext);
  if (!appContext) return null;

  const { cows } = appContext;
  
  const upcomingVaccinations = useMemo(() => {
    return cows
      .map(cow => ({
        cow,
        dueDate: cow.vaccinations[cow.vaccinations.length - 1]?.nextDueDate,
      }))
      .filter(item => {
        if (!item.dueDate) return false;
        const diff = new Date(item.dueDate).getTime() - new Date().getTime();
        return diff < 30 * 24 * 60 * 60 * 1000; // within next 30 days or overdue
      })
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  }, [cows]);
  
  const upcomingDeliveries = useMemo(() => {
    return cows
      .filter(cow => cow.pregnancy.isPregnant && cow.pregnancy.dueDate)
      .map(cow => ({
          cow,
          dueDate: cow.pregnancy.dueDate!,
      }))
      .filter(item => {
        const diff = new Date(item.dueDate).getTime() - new Date().getTime();
        return diff < 60 * 24 * 60 * 60 * 1000; // within next 60 days or overdue
      })
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  }, [cows]);


  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-brand-dark">Reminders</h1>
      
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-brand-dark border-b-2 border-brand-primary pb-2">Upcoming Vaccinations</h2>
        {upcomingVaccinations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {upcomingVaccinations.map(({ cow, dueDate }) => (
              <ReminderCard key={`${cow.id}-vac`} cow={cow} date={dueDate} type="Vaccination" />
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No upcoming vaccinations in the next 30 days.</p>
        )}
      </div>
      
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-brand-dark border-b-2 border-brand-primary pb-2">Expected Deliveries</h2>
         {upcomingDeliveries.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {upcomingDeliveries.map(({ cow, dueDate }) => (
                    <ReminderCard key={`${cow.id}-preg`} cow={cow} date={dueDate} type="Delivery" />
                ))}
            </div>
            ) : (
            <p className="text-gray-500">No expected deliveries in the next 60 days.</p>
            )}
      </div>
    </div>
  );
};

export default Reminders;
