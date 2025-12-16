import React from 'react';
import { User, Heart, ShoppingBag, ChevronRight } from 'lucide-react';
import { useTheme } from '../Context/ThemeContext'; // <-- Importamos ThemeContext

export default function DashboardNav({ activeTab, setActiveTab }) {
  const { theme } = useTheme(); // <-- Extraemos theme

  const buttonClasses = (tabId) => {
    const base = `flex items-center w-full p-3 md:p-4 text-left rounded-lg transition-all font-semibold space-x-3`;
    const active = theme === "dark" 
      ? 'bg-cyan-600 text-gray-900 shadow-md shadow-cyan-900/50'
      : 'bg-cyan-500 text-gray-900 shadow-md shadow-cyan-400/50';
    const inactive = theme === "dark" 
      ? 'bg-gray-700 text-white hover:bg-gray-600'
      : 'bg-gray-200 text-gray-900 hover:bg-gray-300';

    return `${base} ${activeTab === tabId ? active : inactive}`;
  };

  const navClasses = theme === "dark"
    ? "md:col-span-1 lg:col-span-1 bg-gray-800 p-4 rounded-xl shadow-lg border border-gray-700 mb-8 md:mb-0"
    : "md:col-span-1 lg:col-span-1 bg-white p-4 rounded-xl shadow-lg border border-gray-300 mb-8 md:mb-0";

  const headerClasses = theme === "dark"
    ? "text-xs font-bold uppercase text-gray-400 tracking-widest mb-4 border-b border-gray-700 pb-2 hidden md:block"
    : "text-xs font-bold uppercase text-gray-600 tracking-widest mb-4 border-b border-gray-300 pb-2 hidden md:block";

  return (
    <nav className={navClasses}>
      <h3 className={headerClasses}>
        Navegación
      </h3>
      <ul className="space-y-3 md:space-y-2 flex flex-col md:block">
        <li>
          <button 
            className={buttonClasses('profile')}
            onClick={() => setActiveTab('profile')}
          >
            <User className="w-5 h-5" />
            <span className="flex-grow">Mi Perfil</span>
            <ChevronRight className={`w-3 h-3 ${activeTab === 'profile' ? 'text-gray-900' : theme === 'dark' ? 'text-cyan-500' : 'text-cyan-600'}`} />
          </button>
        </li>
        <li>
          <button 
            className={buttonClasses('favorites')}
            onClick={() => setActiveTab('favorites')}
          >
            <Heart className="w-5 h-5" />
            <span className="flex-grow">Favoritos</span>
            <ChevronRight className={`w-3 h-3 ${activeTab === 'favorites' ? 'text-gray-900' : theme === 'dark' ? 'text-cyan-500' : 'text-cyan-600'}`} />
          </button>
        </li>
        <li>
          <button 
            className={buttonClasses('purchases')}
            onClick={() => setActiveTab('purchases')}
          >
            <ShoppingBag className="w-5 h-5" />
            <span className="flex-grow">Mis Compras</span>
            <ChevronRight className={`w-3 h-3 ${activeTab === 'purchases' ? 'text-gray-900' : theme === 'dark' ? 'text-cyan-500' : 'text-cyan-600'}`} />
          </button>
        </li>
      </ul>
    </nav>
  );
}
