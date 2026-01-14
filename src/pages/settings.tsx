import React, { useState } from 'react';
import { User, Bell, Lock, X, KeyRound, IndianRupee } from 'lucide-react';
import UpdatePasswordForm from '@/components/settings/UpdatePasswordForm';
import BankAccountForm from '@/components/settings/BankAccountForm';
import AccountBalance from '@/components/settings/AccountBalance';
import ProfilePage from '@/pages/Profile'

// Import your actual UpdatePasswordForm component
// import UpdatePasswordForm from "@/components/settings/UpdatePasswordForm";

// For now, using a placeholder - replace with your actual import


const ProfileSettings = () => (
  <div className="space-y-6">
    <div>
      <h2 className="text-2xl font-semibold mb-4">Profile</h2>
      <div className="flex items-center gap-4 mb-6">
        <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
          KH
        </div>
        <div className="space-x-2">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700">
            Change picture
          </button>
          <button className="px-4 py-2 border rounded-md text-sm hover:bg-gray-50">
            Delete picture
          </button>
        </div>
      </div>
    </div>

    <div className="space-y-4 max-w-md">
      <div>
        <label className="block text-sm font-medium mb-2">Profile name</label>
        <input type="text" defaultValue="Kevin Heart" className="w-full px-3 py-2 border rounded-md" />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Username</label>
        <input type="text" defaultValue="@Kevin.heart" className="w-full px-3 py-2 border rounded-md bg-gray-50" disabled />
        <p className="text-xs text-gray-500 mt-1">Username can only be changed at 21-04-2024</p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Status currently</label>
        <select className="w-full px-3 py-2 border rounded-md">
          <option>On duty</option>
          <option>Off duty</option>
          <option>Busy</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">About me</label>
        <textarea
          className="w-full px-3 py-2 border rounded-md"
          rows={3}
          defaultValue="Discuss only you work hour, unless you wanna discuss about music :)"
        />
      </div>

      <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
        Save Changes
      </button>
    </div>
  </div>
);

// const NotificationSettings = () => (
//   <div className="space-y-4">
//     <h2 className="text-2xl font-semibold mb-4">Notifications</h2>
//     <div className="space-y-4 max-w-md">
//       <div className="flex items-center justify-between py-3 border-b">
//         <div>
//           <p className="font-medium">Push Notifications</p>
//           <p className="text-sm text-gray-500">Receive push notifications</p>
//         </div>
//         <input type="checkbox" defaultChecked className="w-4 h-4" />
//       </div>
//       <div className="flex items-center justify-between py-3 border-b">
//         <div>
//           <p className="font-medium">Email Notifications</p>
//           <p className="text-sm text-gray-500">Receive email updates</p>
//         </div>
//         <input type="checkbox" defaultChecked className="w-4 h-4" />
//       </div>
//       <div className="flex items-center justify-between py-3 border-b">
//         <div>
//           <p className="font-medium">SMS Notifications</p>
//           <p className="text-sm text-gray-500">Receive text messages</p>
//         </div>
//         <input type="checkbox" className="w-4 h-4" />
//       </div>
//     </div>
//   </div>    
// );


export default function Settings() {
  const [activeTab, setActiveTab] = useState('profile');

  const menuItems = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'account', label: 'Bank Account', icon: Lock },
    { id: 'account-balance', label: 'Account Balance', icon: IndianRupee },
    { id: 'password', label: 'Update Password', icon: KeyRound },
    // { id: 'notifications', label: 'Notifications', icon: Bell },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfilePage />;
      case 'account':
        return <BankAccountForm />;
      case 'password':
        return <UpdatePasswordForm />;
      case 'account-balance':
        return <AccountBalance />;
      //   case 'notifications':
      //     return <NotificationSettings />;
      default:
        return <ProfileSettings />;
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h1 className="text-lg font-semibold">Settings</h1>
          <button className="p-1 hover:bg-gray-100 rounded">
            {/* <X className="w-5 h-5" /> */}
          </button>
        </div>
        <nav className="p-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-left transition-colors ${activeTab === item.id
                    ? 'bg-gray-100 text-gray-900 font-medium'
                    : 'text-gray-600 hover:bg-gray-50'
                  }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto p-8">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}