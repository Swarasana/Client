import React from "react";

const Profile: React.FC = () => {
    return (
        <main className="flex flex-col w-full min-h-screen p-4">
            <h1 className="text-2xl font-bold mb-4">Profile</h1>
            <div className="flex flex-col space-y-4">
                {/* Profile content will go here */}
                <p className="text-gray-600">Profile settings coming soon...</p>
            </div>
        </main>
    );
};

export default Profile;