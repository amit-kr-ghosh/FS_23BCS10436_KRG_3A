import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLoginButton } from '../components/GoogleLoginButton';
import { useAuth } from '../context/AuthContext';
import { Search } from 'lucide-react';

export function Login() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-cyan-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-cyan-50 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
              <Search className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Lost & Found Portal
            </h1>
            <p className="text-gray-600">
              Sign in to report lost items or help reunite found items with their owners
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex flex-col items-center">
              <GoogleLoginButton />
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-500">
                By signing in, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          </div>

          <div className="border-t pt-6">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">24/7</div>
                <div className="text-xs text-gray-600">Available</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">Secure</div>
                <div className="text-xs text-gray-600">OAuth 2.0</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">Fast</div>
                <div className="text-xs text-gray-600">Quick Setup</div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-gray-600">
          <p>College students and staff only</p>
        </div>
      </div>
    </div>
  );
}
