import { FaHome, FaBook, FaCalendarAlt, FaCog, FaSignOutAlt, FaRegEnvelope, FaChartBar } from 'react-icons/fa';
import Link from 'next/link';

const navItems = [
  { href: '/', label: 'Home', icon: FaHome },
  { href: '/course', label: 'Kurse', icon: FaBook },
  { href: '/calendar', label: 'Termine', icon: FaCalendarAlt },
  { href: '/reports', label: 'Reports', icon: FaChartBar },
  { href: '/inbox', label: 'Inbox', icon: FaRegEnvelope },
  { href: '/settings', label: 'Einstellungen', icon: FaCog },
];

type SidebarProps = {
  isOpen: boolean;
}

const Sidebar = ({ isOpen }: SidebarProps) => {
  return (
    <nav 
      aria-label='site-navigation'
      className="{ isOpen ? 'w-64': 'w-16'}
      bg-gray-800 min-h-full 
      px-2 py-2 flex flex-col
      transition-all duration-200
    ">

    <ul className="flex-1 space-y-2 font-bold text-white">
      {navItems.map(({ href, label, icon: Icon }) => (
        <li key={href}>
          <Link
            href={href}
            className="flex items-center px-2 py-2 rounded hover:shadow hover:bg-blue-500 transition-colors"
        >
          <Icon className="w-6 h-6 mr-2" />
            { isOpen ? label: "" }
          </Link>
        </li>
      ))}
    </ul>

    <div className="mt-4">
      <a
        href="/logout"
        className="flex items-center px-3 py-2 text-red-400 hover:text-red-600 transition-colors"
      >
        <FaSignOutAlt className="w-6 h-6 mr-2" />
        { isOpen ? "Logout" : ""}
      </a>
    </div>
    </nav>
  );
};

export default Sidebar;
