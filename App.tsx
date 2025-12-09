
import React, { useState, createContext, useMemo } from 'react';
import type { User, Screen, Cow, MilkRecord } from './types';
import { USERS, COWS, MILK_RECORDS } from './constants';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import CowList from './components/CowList';
import Header from './components/Header';
import AddMilkRecords from './components/AddMilkRecords';
import Reminders from './components/Reminders';
import Reports from './components/Reports';
import QRScanner from './components/QRScanner';
import Settings from './components/Settings';

interface AppContextType {
  currentUser: User | null;
  cows: Cow[];
  milkRecords: MilkRecord[];
  users: User[];
  setCows: React.Dispatch<React.SetStateAction<Cow[]>>;
  setMilkRecords: React.Dispatch<React.SetStateAction<MilkRecord[]>>;
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  setCurrentScreen: React.Dispatch<React.SetStateAction<Screen>>;
}

export const AppContext = createContext<AppContextType | null>(null);

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentScreen, setCurrentScreen] = useState<Screen>('DASHBOARD');
  
  const [cows, setCows] = useState<Cow[]>(COWS);
  const [milkRecords, setMilkRecords] = useState<MilkRecord[]>(MILK_RECORDS);
  const [users, setUsers] = useState<User[]>(USERS);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setCurrentScreen('DASHBOARD');
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const contextValue = useMemo(() => ({
    currentUser,
    cows,
    milkRecords,
    users,
    setCows,
    setMilkRecords,
    setUsers,
    setCurrentScreen,
  }), [currentUser, cows, milkRecords, users]);

  const renderScreen = () => {
    switch (currentScreen) {
      case 'DASHBOARD':
        return <Dashboard />;
      case 'COWS':
        return <CowList />;
      case 'ADD_MILK':
        return <AddMilkRecords />;
      case 'REMINDERS':
        return <Reminders />;
      case 'REPORTS':
        return <Reports />;
      case 'QR_SCANNER':
        return <QRScanner />;
      case 'SETTINGS':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <AppContext.Provider value={contextValue}>
      <div className="flex flex-col md:flex-row min-h-screen bg-brand-light text-brand-dark">
        <Header currentScreen={currentScreen} onLogout={handleLogout} />
        <main className="flex-1 p-4 md:p-8 md:ml-64 lg:ml-72">
          {renderScreen()}
        </main>
      </div>
    </AppContext.Provider>
  );
};

export default App;
