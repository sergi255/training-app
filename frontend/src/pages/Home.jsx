import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, Users, Calendar, Star, Dumbbell, Timer } from 'lucide-react';


const Home = () => {
  const { isAuthenticated, isAdmin, username} = useAuth();

  // Authenticated User Content
  const AuthenticatedContent = () => {
    if (isAdmin) {
      return (
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="text-center">
            <div className="mb-8">
              <h1 className="text-5xl font-bold text-white mb-6">Admin Dashboard</h1>
              <p className="text-xl text-gray-300 mb-8">Manage your application settings and users.</p>
            </div>
            <div className="flex justify-center space-x-4">
              <Link
                to="/admin/users"
                className="bg-indigo-600 text-white px-6 py-3 rounded-lg text-2xl hover:bg-indigo-700 transition-colors inline-flex items-center"
              >
                Manage Users
                <Users className="w-5 h-5 ml-2" />
              </Link>
              <Link
                to="/admin/trainings"
                className="bg-indigo-600 text-white px-6 py-3 rounded-lg text-2xl hover:bg-indigo-700 transition-colors inline-flex items-center"
              >
                Manage Trainings
                <Timer className="w-5 h-5 ml-2" />
              </Link>
              <Link
                to="/admin/exercises"
                className="bg-indigo-600 text-white px-6 py-3 rounded-lg text-2xl hover:bg-indigo-700 transition-colors inline-flex items-center"
              >
                Manage Exercises
                <Dumbbell className="w-5 h-5 ml-2" />
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center">
          <div className="mb-8">
            <h1 className="text-5xl font-bold text-white mb-6">Welcome back, {username}!</h1>
            <p className="text-xl text-gray-300 mb-8">Ready for your next workout?</p>
          </div>
          <div className="flex justify-center space-x-4">
            <Link
              to="/trainings"
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg text-2xl hover:bg-indigo-700 transition-colors inline-flex items-center"
            >
              Go to Trainings
              <Dumbbell className="w-6 h-6 ml-2" />
            </Link>
          </div>
        </div>
      </div>
    );
  };

  const LandingContent = () => (
    <>
      <div className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-white mb-6">
            Transform Your Fitness Journey Today
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Personalized workouts, expert guidance, and a supportive community to help you reach your fitness goals.
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              to="/register"
              className="bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 flex items-center"
            >
              Get Started
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link
              to="/login"
              className="border border-gray-500 text-white px-8 py-3 rounded-lg hover:bg-gray-700"
            >
              Sign In
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="bg-gray-800 p-6 rounded-xl">
            <Calendar className="w-12 h-12 text-indigo-500 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">
              Personalized Plans
            </h3>
            <p className="text-gray-300">
              Custom workout schedules tailored to your goals and fitness level
            </p>
          </div>
          <div className="bg-gray-800 p-6 rounded-xl">
            <Users className="w-12 h-12 text-indigo-500 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">
              Community Support
            </h3>
            <p className="text-gray-300">
              Explore another users training and exericses
            </p>
          </div>
          <div className="bg-gray-800 p-6 rounded-xl">
            <Star className="w-12 h-12 text-indigo-500 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">
              Progress Tracking
            </h3>
            <p className="text-gray-300">
              Monitor your achievements and stay motivated with detailed analytics
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-20 text-center">
          <div>
            <div className="text-4xl font-bold text-indigo-500 mb-2">10K+</div>
            <div className="text-gray-300">Active Users</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-indigo-500 mb-2">500+</div>
            <div className="text-gray-300">Workout Plans</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-indigo-500 mb-2">98%</div>
            <div className="text-gray-300">Satisfaction Rate</div>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-800 to-gray-700">
      {isAuthenticated ? <AuthenticatedContent /> : <LandingContent />}
    </div>
  );
};

export default Home;