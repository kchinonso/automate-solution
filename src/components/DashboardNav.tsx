'use client';

import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface DashboardNavProps {
  user: {
    email: string;
    companyName?: string;
    role?: string;
  };
  pageTitle: string;
}

export default function DashboardNav({ user, pageTitle }: DashboardNavProps) {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/');
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-900">AutoMate Solutions</h1>
            <span className="ml-4 text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded">
              {pageTitle}
            </span>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-700">
              {user.companyName || user.email}
              {user.role === 'admin' && (
                <span className="ml-2 text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                  Admin
                </span>
              )}
            </span>
            
            <div className="relative group">
              <button className="flex items-center space-x-1 text-gray-700 hover:text-gray-900 text-sm">
                <span>Account</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block border border-gray-200">
                {user.role === 'admin' && (
                  <button
                    onClick={() => router.push('/dashboard/admin')}
                    className="block w-full text-left px-4 py-2 text-sm text-purple-600 hover:bg-gray-100"
                  >
                    Admin Dashboard
                  </button>
                )}
                <button
                  onClick={() => router.push('/dashboard/profile')}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Update Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            </div>
            
            <button 
              onClick={() => router.push('/dashboard')}
              className="text-gray-700 hover:text-gray-900 text-sm"
            >
              Dashboard
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}