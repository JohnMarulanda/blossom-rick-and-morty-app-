import { Outlet } from 'react-router-dom';
import HomePage from '../pages/Home';

export default function MainLayout() {
  return (
    <div className="flex h-screen bg-gray-50">
      <div className="w-1/3 bg-white border-r border-gray-200 overflow-y-auto">
        <HomePage />
      </div>
      <div className="flex-1 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
}