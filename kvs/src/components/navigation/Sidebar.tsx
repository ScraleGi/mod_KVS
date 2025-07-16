import { FaHome, FaCalendarAlt, FaCog, FaSignOutAlt, FaRegEnvelope, FaChartBar, FaThLarge, FaLayerGroup, FaUsers, FaChalkboardTeacher, FaCalendarDay } from 'react-icons/fa';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/', label: 'Startseite', icon: FaHome },
  { href: '/program', label: 'Programme', icon: FaLayerGroup },
  { href: '/area', label: 'Bereiche', icon: FaThLarge },
  { href: '/participant', label: 'Teilnehmer', icon: FaUsers },
  { href: '/trainer', label: 'Trainer', icon: FaChalkboardTeacher },
  { href: '/coursedays', label: 'Kurstage', icon: FaCalendarDay },
  { href: '/calendar', label: 'Termine', icon: FaCalendarAlt },
  { href: '/reports', label: 'Berichte', icon: FaChartBar },
  { href: '/inbox', label: 'Posteingang', icon: FaRegEnvelope },
  { href: '/settings', label: 'Einstellungen', icon: FaCog },
];

type SidebarProps = {
  isOpen: boolean;
}

const Tooltip = ({ children }: { children: React.ReactNode }) => (
  <span className="
    pointer-events-none
    absolute left-full top-1/2 -translate-y-1/2 ml-3
    whitespace-nowrap bg-gray-900 text-white text-xs font-medium
    rounded shadow-lg px-3 py-1
    opacity-0 scale-95 translate-x-2
    group-hover:opacity-100 group-hover:scale-100 group-hover:translate-x-0
    transition-all duration-200 z-30
  " role="tooltip">
    {children}
  </span>
);

const Sidebar = ({ isOpen }: SidebarProps) => {
  const pathname = usePathname();

  return (
    <nav 
      aria-label='site-navigation'
      className="{ isOpen ? 'w-64': 'w-16'}
      bg-gray-800 min-h-full 
      px-2 py-2 flex flex-col
      transition-all duration-200
    ">

    <ul className="flex-1 space-y-2 font-bold text-white">
      {navItems.map(({ href, label, icon: Icon }) => {
        const isActive = pathname === href;
        return (
          <li key={href} className='relative group'>
            <Link
              href={href}
              className={`flex items-center px-2 py-2 rounded hover:shadow hover:bg-blue-500 transition-colors${isActive ? ' bg-blue-500 shadow' : ''}`}
            >
              <Icon className="w-6 h-6 mr-2" />
              {isOpen && <span>{label}</span>}
            </Link>
            {!isOpen && <Tooltip>{label}</Tooltip>}
          </li>
        );
      })}
    </ul>

    <div className="mt-4">
      <div className="relative group">
        <a
          href="/auth/logout"
          className="flex items-center px-3 py-2 text-red-400 hover:text-red-600 transition-colors"
        >
          <FaSignOutAlt className="w-6 h-6 mr-2" />
          {isOpen && <span>Abmelden</span>}
        </a>
        {!isOpen && <Tooltip>Abmelden</Tooltip>}
      </div>
    </div>
    </nav>
  );
};

export default Sidebar;
