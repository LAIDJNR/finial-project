import React from 'react';
import { Squares2X2Icon, CheckCircleIcon, ClockIcon, TagIcon, SparklesIcon } from '@heroicons/react/24/outline';

const Sidebar = ({ currentFilter, setFilter, user }) => {
    const menuItems = [
        { id: 'all', label: 'All Tasks', icon: Squares2X2Icon, color: 'text-blue-500' },
        { id: 'completed', label: 'Completed', icon: CheckCircleIcon, color: 'text-green-500' },
        { id: 'pending', label: 'Pending', icon: ClockIcon, color: 'text-yellow-500' },
        { id: 'category', label: 'Categories', icon: TagIcon, color: 'text-pink-500' },
    ];

    // Calculate XP Progress
    const currentXP = user?.xp || 0;
    const currentLevel = user?.level || 1;
    const xpForNextLevel = 100; // Fixed 100 per level for simplicity
    const progress = (currentXP % 100);

    return (
        <div className="md:w-72 h-screen p-4 fixed left-0 top-0 hidden md:block z-50">
            <div className="glass-dark w-full h-full rounded-3xl p-6 flex flex-col shadow-2xl relative overflow-hidden">
                {/* Decorative background vibe */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

                <h1 className="text-3xl font-display font-bold text-white mb-8 flex items-center gap-3 relative z-10">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                        <span className="text-white text-xl">T</span>
                    </div>
                    <span className="tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">TaskApp</span>
                </h1>

                {/* User Stats Card */}
                {user && (
                    <div className="mb-8 bg-white/5 rounded-2xl p-4 border border-white/10 backdrop-blur-sm">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-yellow-400 to-orange-500 flex items-center justify-center text-white font-bold shadow-lg">
                                {user.username.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <p className="text-white font-medium text-sm">{user.username}</p>
                                <div className="flex items-center gap-1 text-xs text-yellow-400 font-bold">
                                    <SparklesIcon className="w-3 h-3" />
                                    Level {currentLevel}
                                </div>
                            </div>
                        </div>
                        {/* XP Bar */}
                        <div className="w-full bg-gray-700/50 rounded-full h-2 mb-1">
                            <div
                                className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                        <div className="flex justify-between text-[10px] text-gray-400 font-medium">
                            <span>{progress} XP</span>
                            <span>100 XP</span>
                        </div>
                    </div>
                )}

                <nav className="flex-1 relative z-10">
                    <ul className="space-y-3">
                        {menuItems.map((item) => (
                            <li key={item.id}>
                                <button
                                    onClick={() => setFilter(item.id)}
                                    className={`flex items-center gap-4 w-full p-3.5 rounded-2xl transition-all duration-300 group ${currentFilter === item.id
                                            ? 'bg-white bg-opacity-10 text-white shadow-lg backdrop-blur-sm border border-white/10'
                                            : 'text-gray-400 hover:bg-white hover:bg-opacity-5 hover:text-white'
                                        }`}
                                >
                                    <item.icon className={`w-6 h-6 transition-transform group-hover:scale-110 ${currentFilter === item.id ? item.color : ''}`} />
                                    <span className="font-medium font-sans">{item.label}</span>
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>

            </div>
        </div>
    );
};

export default Sidebar;
