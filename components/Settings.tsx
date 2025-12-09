
import React, { useContext } from 'react';
import { AppContext } from '../App';
import { Role } from '../types';

const Settings: React.FC = () => {
  const appContext = useContext(AppContext);
  if (!appContext) return null;

  const { users, currentUser } = appContext;

  const isAdmin = currentUser?.role === Role.Admin;

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-brand-dark">Settings</h1>

      {/* User Management */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-bold text-brand-dark mb-4">User Management</h2>
        {isAdmin ? (
          <div className="space-y-3">
            {users.map(user => (
              <div key={user.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-semibold">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.email} - <span className="font-medium">{user.role}</span></p>
                </div>
                <div className="flex space-x-2">
                  <button className="text-sm text-blue-600 hover:underline">Edit</button>
                  <button className="text-sm text-red-600 hover:underline">Remove</button>
                </div>
              </div>
            ))}
            <button className="mt-4 px-4 py-2 bg-brand-primary text-white font-semibold rounded-lg hover:bg-green-800 transition-colors">
              + Add New User
            </button>
          </div>
        ) : (
          <p className="text-gray-500">You do not have permission to manage users. Please contact an admin.</p>
        )}
      </div>

      {/* Notification Preferences */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-bold text-brand-dark mb-4">Notification Preferences</h2>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label htmlFor="vaccine-notif" className="text-gray-700">Vaccination Reminders</label>
            <input type="checkbox" id="vaccine-notif" className="form-checkbox h-5 w-5 text-brand-primary rounded" defaultChecked />
          </div>
           <div className="flex justify-between items-center">
            <label htmlFor="preg-notif" className="text-gray-700">Pregnancy Reminders</label>
            <input type="checkbox" id="preg-notif" className="form-checkbox h-5 w-5 text-brand-primary rounded" defaultChecked />
          </div>
           <div className="flex justify-between items-center">
            <label htmlFor="milk-alert" className="text-gray-700">Low/High Milk Alerts</label>
            <input type="checkbox" id="milk-alert" className="form-checkbox h-5 w-5 text-brand-primary rounded" />
          </div>
        </div>
      </div>
      
      {/* Data Management */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-bold text-brand-dark mb-4">Data Management</h2>
        <div className="flex space-x-4">
             <button className="px-4 py-2 bg-brand-dark text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors">
                Backup Data
            </button>
             <button className="px-4 py-2 bg-gray-200 text-brand-dark font-semibold rounded-lg hover:bg-gray-300 transition-colors">
                Restore Data
            </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
