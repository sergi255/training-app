import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Home = () => {
  const { isAuthenticated, isAdmin, username, logout, roles } = useAuth()

  console.log(isAdmin, roles)

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div className="divide-y divide-gray-200">
              {isAuthenticated ? (
                isAdmin ? (
                  <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                    <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                    <p className="text-gray-600">Manage your application settings and users.</p>
                    <div className="pt-6 flex gap-4">
                      <Link
                        to="/admin/users"
                        className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
                      >
                        Manage Users
                      </Link>
                      <Link
                        to="/admin/trainings"
                        className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
                      >
                        Manage Trainings
                      </Link>
                      <Link
                        to="/admin/exercises"
                        className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
                      >
                        Manage Exercises
                      </Link>

                    </div>
                  </div>
                ) : (
                  <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                    <h1 className="text-2xl font-bold text-gray-900">Welcome back, {username}!</h1>
                    <p className="text-gray-600">Ready for your next workout?</p>
                    <div className="pt-6 flex gap-4">
                      <Link
                        to="/trainings"
                        className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
                      >
                        Go to Trainings
                      </Link>
                      <button
                        onClick={logout}
                        className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )
              ) : (
                <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                  <h1 className="text-2xl font-bold text-gray-900">Welcome to Training App</h1>
                  <p className="text-gray-600">Start your fitness journey today!</p>
                  <div className="pt-6 flex gap-4">
                    <Link
                      to="/login"
                      className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/register"
                      className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
                    >
                      Register
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
