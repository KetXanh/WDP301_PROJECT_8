import React from 'react';
// import { useSelector } from 'react-redux';
import { Bell, Search, User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export const Header = () => {
  // const { user } = useSelector((state) => state.auth);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h2 className="text-lg font-medium text-gray-900">Sale Staff Portal</h2>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Tìm kiếm..."
                className="pl-10 w-64"
              />
            </div>

            {/* Notifications */}
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>

            {/* User menu */}
            <div className="flex items-center space-x-3">
              {/* <Avatar>
                <AvatarImage src={user?.avatar?.url} alt={user?.username} />
                <AvatarFallback>
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar> */}
              {/* <div className="hidden md:block">
                <div className="text-sm font-medium text-gray-900">
                  {user?.username || 'Sale Staff'}
                </div>
                <div className="text-xs text-gray-500">
                  {user?.email || 'staff@example.com'}
                </div>
              </div> */}
              <div className="p-4 border-b">
                <h2 className="text-lg font-semibold text-primary">
                  {open ? "Nhân viên bán hàng" : "NVBH"}
                </h2>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}; 