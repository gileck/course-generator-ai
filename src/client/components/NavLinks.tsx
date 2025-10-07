import { NavItem } from './layout/types';
import { Home, Settings, Library, Clock } from 'lucide-react';

export const navItems: NavItem[] = [
  { path: '/', label: 'Home', icon: <Home size={18} /> },
  { path: '/courses', label: 'Courses', icon: <Library size={18} /> },
  { path: '/recent', label: 'Recent', icon: <Clock size={18} /> },
  { path: '/settings', label: 'Settings', icon: <Settings size={18} /> },
];

export const menuItems: NavItem[] = [
  { path: '/', label: 'Home', icon: <Home size={18} /> },
  { path: '/courses', label: 'Courses', icon: <Library size={18} /> },
  { path: '/recent', label: 'Recent', icon: <Clock size={18} /> },
  { path: '/settings', label: 'Settings', icon: <Settings size={18} /> },
];
