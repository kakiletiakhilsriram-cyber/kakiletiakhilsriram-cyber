
import React, { useContext } from 'react';
import { AppContext } from '../App';
import type { Screen } from '../types';
import { DashboardIcon, CowIcon, MilkIcon, BellIcon, ChartIcon, QRIcon, SettingsIcon, LogoutIcon } from './icons';

interface HeaderProps {
  currentScreen: Screen;
  onLogout: () => void;
}

const NavItem: React.FC<{
  screen: Screen;
  currentScreen: Screen;
  onClick: (screen: Screen) => void;
  children: React.ReactNode;
}> = ({ screen, currentScreen, onClick, children }) => {
  const isActive = screen === currentScreen;
  return (
    <button
      onClick={() => onClick(screen)}
      className={`flex items-center w-full px-4 py-3 text-left transition-colors duration-200 rounded-lg ${
        isActive
          ? 'bg-brand-primary text-white shadow-md'
          : 'text-gray-600 hover:bg-green-100 hover:text-brand-dark'
      }`}
    >
      {children}
    </button>
  );
};

const Header: React.FC<HeaderProps> = ({ currentScreen, onLogout }) => {
  const appContext = useContext(AppContext);

  if (!appContext) return null;
  const { setCurrentScreen, currentUser } = appContext;
  
  const navItems = [
    { screen: 'DASHBOARD' as Screen, icon: <DashboardIcon className="w-6 h-6 mr-3" />, label: 'Dashboard' },
    { screen: 'COWS' as Screen, icon: <CowIcon className="w-6 h-6 mr-3" />, label: 'Cow Info' },
    { screen: 'ADD_MILK' as Screen, icon: <MilkIcon className="w-6 h-6 mr-3" />, label: 'Add Milk' },
    { screen: 'REMINDERS' as Screen, icon: <BellIcon className="w-6 h-6 mr-3" />, label: 'Reminders' },
    { screen: 'REPORTS' as Screen, icon: <ChartIcon className="w-6 h-6 mr-3" />, label: 'Reports' },
    { screen: 'QR_SCANNER' as Screen, icon: <QRIcon className="w-6 h-6 mr-3" />, label: 'QR Scan' },
    { screen: 'SETTINGS' as Screen, icon: <SettingsIcon className="w-6 h-6 mr-3" />, label: 'Settings' },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full p-4 space-y-2">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-brand-primary">Dairy Farm</h1>
        <p className="text-sm text-gray-500">Welcome, {currentUser?.name}</p>
      </div>
      <nav className="flex-1 space-y-2">
        {navItems.map(item => (
          <NavItem key={item.screen} screen={item.screen} currentScreen={currentScreen} onClick={setCurrentScreen}>
            {item.icon}
            <span className="font-medium">{item.label}</span>
          </NavItem>
        ))}
      </nav>
      <div>
        <button
          onClick={onLogout}
          className="flex items-center w-full px-4 py-3 text-left text-red-600 hover:bg-red-100 rounded-lg transition-colors"
        >
          <LogoutIcon className="w-6 h-6 mr-3" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Sidebar for Desktop */}
      <aside className="hidden md:block fixed top-0 left-0 w-64 lg:w-72 h-full bg-white shadow-lg z-10">
        {sidebarContent}
      </aside>

      {/* Bottom Nav for Mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.1)] z-20">
        <div className="flex justify-around">
          {navItems.slice(0, 5).map(item => ( // Show first 5 icons on mobile
            <button
              key={item.screen}
              onClick={() => setCurrentScreen(item.screen)}
              className={`flex flex-col items-center justify-center p-2 w-full transition-colors ${
                currentScreen === item.screen ? 'text-brand-primary' : 'text-gray-500'
              }`}
            >
              {React.cloneElement(item.icon, { className: 'w-6 h-6 mb-1' })}
              <span className="text-xs">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </>
  );
};

export default Header;
