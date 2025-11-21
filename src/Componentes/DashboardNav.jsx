import React from 'react';
import { User, Heart, ShoppingBag, ChevronRight } from 'lucide-react';

export default function DashboardNav({ activeTab, setActiveTab }) {
    const buttonClasses = (tabId) => 
        `flex items-center w-full p-3 md:p-4 text-left rounded-lg transition-all font-semibold space-x-3 
        ${activeTab === tabId 
            ? 'bg-cyan-600 text-gray-900 shadow-md shadow-cyan-900/50' 
            : 'bg-gray-700 text-white hover:bg-gray-600'}`;

    return (
        <nav className="md:col-span-1 lg:col-span-1 bg-gray-800 p-4 rounded-xl shadow-lg border border-gray-700 mb-8 md:mb-0">
            <h3 className="text-xs font-bold uppercase text-gray-400 tracking-widest mb-4 border-b border-gray-700 pb-2 hidden md:block">
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
                        <ChevronRight className={`w-3 h-3 ${activeTab === 'profile' ? 'text-gray-900' : 'text-cyan-500'}`} />
                    </button>
                </li>
                <li>
                    <button 
                        className={buttonClasses('favorites')}
                        onClick={() => setActiveTab('favorites')}
                    >
                        <Heart className="w-5 h-5" />
                        <span className="flex-grow">Favoritos</span>
                        <ChevronRight className={`w-3 h-3 ${activeTab === 'favorites' ? 'text-gray-900' : 'text-cyan-500'}`} />
                    </button>
                </li>
                <li>
                    <button 
                        className={buttonClasses('purchases')}
                        onClick={() => setActiveTab('purchases')}
                    >
                        <ShoppingBag className="w-5 h-5" />
                        <span className="flex-grow">Mis Compras</span>
                        <ChevronRight className={`w-3 h-3 ${activeTab === 'purchases' ? 'text-gray-900' : 'text-cyan-500'}`} />
                    </button>
                </li>
            </ul>
        </nav>
    );
}
