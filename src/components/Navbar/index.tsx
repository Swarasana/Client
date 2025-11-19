import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Compass, User } from 'lucide-react';

const Navbar: React.FC = () => {
    const location = useLocation();
    
    const navItems = [
        { path: '/', label: 'Explore', icon: Compass },
        { path: '/profile', label: 'Profile', icon: User }
    ];

    const isActive = (path: string) => location.pathname === path;
    const showMobileNavbar = location.pathname === '/' || location.pathname === '/profile';

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="hidden md:flex md:flex-col md:fixed md:left-0 md:top-0 md:h-full md:w-64 bg-gray-900 text-white z-50">
                <div className="p-6 border-b border-gray-700">
                    <h1 className="text-xl font-bold text-center">Swarasana</h1>
                </div>
                <nav className="flex-1 p-4">
                    <ul className="space-y-2">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <li key={item.path}>
                                    <NavLink
                                        to={item.path}
                                        className={({ isActive }) =>
                                            `flex items-center px-4 py-3 rounded-lg transition-colors duration-200 ${
                                                isActive
                                                    ? 'bg-blue-600 text-white'
                                                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                                            }`
                                        }
                                    >
                                        <Icon className="w-5 h-5 mr-3" />
                                        <span className="font-medium">{item.label}</span>
                                        {isActive(item.path) && (
                                            <motion.div
                                                className="absolute right-0 w-1 h-8 bg-blue-400 rounded-l"
                                                layoutId="activeIndicator"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ duration: 0.2 }}
                                            />
                                        )}
                                    </NavLink>
                                </li>
                            );
                        })}
                    </ul>
                </nav>
            </aside>

            {/* Mobile Bottom Navigation */}
            {showMobileNavbar && (
                <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
                    <div className="flex justify-around items-center py-2">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const active = isActive(item.path);
                            return (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    className="flex flex-col items-center py-1 px-4 relative"
                                >
                                    <motion.div
                                        className={`flex flex-col items-center ${
                                            active ? 'text-blue1' : 'text-gray-600'
                                        }`}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <div className={`px-5 py-1 mb-1 ${active ? 'bg-blue1/30 rounded-2xl' : ''}`}>
                                            <Icon className={`w-5 h-5 ${active ? 'text-blue1' : 'text-gray-600'}`} />
                                        </div>
                                        <span className={`text-xs ${active ? 'text-blue1 font-medium' : 'text-gray-600'}`}>
                                            {item.label}
                                        </span>
                                    </motion.div>
                                </NavLink>
                            );
                        })}
                    </div>
                </nav>
            )}
        </>
    );
};

export default Navbar;