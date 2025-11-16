import React from "react";

const Explore: React.FC = () => {
    return (
        <main className="flex flex-col w-full min-h-screen p-4">
            <h1 className="text-2xl font-bold mb-4">Explore Museums</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Museum list will go here */}
                <p className="text-gray-600">Museum list coming soon...</p>
            </div>
        </main>
    );
};

export default Explore;