import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export default function Demo() {
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const loginAsDemo = async () => {
      // Automatically login as demo user
      const success = await login('demo@example.com', 'demo123');
      if (success) {
        navigate('/dashboard');
      }
    };

    loginAsDemo();
  }, [login, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
      <div className="text-white text-center">
        <div className="animate-spin h-8 w-8 border-4 border-green-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p>Logging in as demo user...</p>
      </div>
    </div>
  );
}
