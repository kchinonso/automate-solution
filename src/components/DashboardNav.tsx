'use client';

import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';

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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/');
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-white shadow-sm border-b fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Left side - Logo and page title */}
          <div className="flex items-center space-x-4">
            <h1 className="text-lg md:text-xl font-bold text-gray-900 whitespace-nowrap">
              AutoMate Solutions
            </h1>
            <span className="text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded hidden sm:block">
              {pageTitle}
            </span>
          </div>
          
          {/* Right side - User info and navigation */}
          <div className="flex items-center space-x-2 md:space-x-4">
            {/* User info - hidden on mobile, visible on tablet and up */}
            <div className="hidden sm:block">
              <span className="text-sm text-gray-700">
                {user.companyName || user.email}
                {user.role === 'admin' && (
                  <span className="ml-2 text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                    Admin
                  </span>
                )}
              </span>
            </div>

            {/* Dashboard button - hidden on mobile, visible on tablet and up */}
            <button 
              onClick={() => router.push('/dashboard')}
              className="hidden md:block text-gray-700 hover:text-gray-900 text-sm px-3 py-2 rounded-md hover:bg-gray-100 transition duration-200"
            >
              Dashboard
            </button>
            
            {/* Account dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-1 text-gray-700 hover:text-gray-900 text-sm px-3 py-2 rounded-md border border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50 transition duration-200"
              >
                <span className="hidden sm:inline">Account</span>
                <svg 
                  className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {/* Dropdown menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                  {/* Mobile-only user info */}
                  <div className="block sm:hidden px-4 py-2 text-xs text-gray-500 border-b border-gray-100">
                    <div className="font-medium text-gray-700 truncate">
                      {user.companyName || user.email}
                    </div>
                    {user.role === 'admin' && (
                      <span className="text-xs bg-purple-100 text-purple-800 px-2 py-0.5 rounded">
                        Admin
                      </span>
                    )}
                  </div>

                  {/* Mobile-only dashboard link */}
                  <button 
                    onClick={() => {
                      router.push('/dashboard');
                      setIsDropdownOpen(false);
                    }}
                    className="block md:hidden w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border-b border-gray-100"
                  >
                    Dashboard
                  </button>

                  {user.role === 'admin' && (
                    <button
                      onClick={() => {
                        router.push('/dashboard/admin');
                        setIsDropdownOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-purple-600 hover:bg-gray-100 border-b border-gray-100"
                    >
                      Admin Dashboard
                    </button>
                  )}
                  <button
                    onClick={() => {
                      router.push('/dashboard/profile');
                      setIsDropdownOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border-b border-gray-100"
                  >
                    Update Profile
                  </button>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsDropdownOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile page title - visible only on mobile */}
        <div className="sm:hidden pb-3">
          <span className="text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded">
            {pageTitle}
          </span>
        </div>
      </div>
    </nav>
  );
}
