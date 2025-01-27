import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

const Button = ({ to, onClick, variant = 'primary', children }) => {
  const baseStyles = "px-4 py-2 rounded-md transition-colors"
  const variants = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700",
    secondary: "bg-gray-600 text-white hover:bg-gray-700"
  }

  if (to) {
    return (
      <Link to={to} className={`${baseStyles} ${variants[variant]}`}>
        {children}
      </Link>
    )
  }

  return (
    <button onClick={onClick} className={`${baseStyles} ${variants[variant]}`}>
      {children}
    </button>
  )
}

Button.propTypes = {
  to: PropTypes.string,
  onClick: PropTypes.func,
  variant: PropTypes.oneOf(['primary', 'secondary']),
  children: PropTypes.node.isRequired
}

export default Button