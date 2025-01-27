import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useState } from 'react'
import { Dumbbell } from 'lucide-react'
import Button from './Button/Button'
import PropTypes from 'prop-types'

const DROPDOWN_MENUS = {
  trainings: [
    { to: '/trainings', label: 'My Trainings' },
    { to: '/trainings/all', label: 'All Trainings' },
    { to: '/trainings/add', label: 'Add Trainings' }
  ],
  exercises: [
    { to: '/exercises', label: 'My Exercises' },
    { to: '/exercises/all', label: 'All Exercises' },
    { to: '/exercises/add', label: 'Add Exercises' }
  ]
}

const COMMON_LINK_STYLES = "text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"

const DropdownLink = ({ to, label, onClick }) => (
  <Link 
    to={to} 
    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
    onClick={onClick}
  >
    {label}
  </Link>
)

DropdownLink.propTypes = {
  to: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired
}

const NavDropdown = ({ name, isOpen, onToggle }) => (
  <div className="relative">
    <button 
      onClick={() => onToggle(name)}
      className={`${COMMON_LINK_STYLES} flex items-center`}
    >
      {name.charAt(0).toUpperCase() + name.slice(1)}
      <svg className="ml-1 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
      </svg>
    </button>
    
    {isOpen && (
      <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
        <div className="py-1" role="menu">
          {DROPDOWN_MENUS[name].map(item => (
            <DropdownLink 
              key={item.to}
              {...item}
              onClick={() => onToggle(null)}
            />
          ))}
        </div>
      </div>
    )}
  </div>
)

NavDropdown.propTypes = {
  name: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired
}

const NavLink = ({ to, children }) => (
  <Link to={to} className={COMMON_LINK_STYLES}>
    {children}
  </Link>
)

NavLink.propTypes = {
  to: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired
}

const Navbar = () => {
  const navigate = useNavigate()
  const { isAuthenticated, logout } = useAuth()
  const [openDropdown, setOpenDropdown] = useState(null)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center x-2">
            <Dumbbell className="w-8 h-8 text-indigo-500 mr-5" />
            <Link to="/" className="flex-shrink-0">
              <span className="text-2xl font-bold text-white">Training App</span>
            </Link>
          </div>

          <div className="ml-10 flex items-baseline space-x-4">
            {isAuthenticated ? (
              <>
                {Object.keys(DROPDOWN_MENUS).map(menuName => (
                  <NavDropdown
                    key={menuName}
                    name={menuName}
                    isOpen={openDropdown === menuName}
                    onToggle={setOpenDropdown}
                  />
                ))}
                <button
                  onClick={handleLogout}
                  className={COMMON_LINK_STYLES}
                >
                  Logout 
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login">Login</NavLink>
                <Button to="/register" variant="primary">Register</Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar