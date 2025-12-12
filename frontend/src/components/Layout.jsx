import React from 'react';
import Sidebar from './Sidebar';

const Layout = ({ children, currentFilter, setFilter, user }) => {
    return (
        <div className="flex min-h-screen">
            <Sidebar currentFilter={currentFilter} setFilter={setFilter} user={user} />
            <main className="flex-1 md:ml-72 p-4 md:p-8 min-h-screen transition-all duration-300">
                <div className="max-w-6xl mx-auto mt-4">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default Layout;
