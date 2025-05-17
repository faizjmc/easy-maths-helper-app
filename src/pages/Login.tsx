
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Login = () => {
  const { signInWithGoogle, currentUser, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Only redirect if auth is initialized and we have a currentUser
    if (currentUser && !loading) {
      navigate('/', { replace: true }); // Use replace instead of push to prevent back button issues
    }
  }, [currentUser, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  // Don't render the login page if user is already logged in
  if (currentUser) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-gray-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-xl">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-purple-800">Maths Scribe</h1>
          <p className="mt-2 text-gray-600">Sign in to access your equations</p>
        </div>
        
        <div className="mt-10 space-y-6">
          <Button 
            onClick={signInWithGoogle}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-6"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
              <path d="M15.545 6.558a9.42 9.42 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.689 7.689 0 0 1 5.352 2.082l-2.284 2.284A4.347 4.347 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.792 4.792 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.702 3.702 0 0 0 1.599-2.431H8v-3.08h7.545z"/>
            </svg>
            Sign in with Google
          </Button>
        </div>
        
        <p className="mt-10 text-center text-sm text-gray-500">
          By signing in, you agree to our terms and conditions.
        </p>
      </div>
    </div>
  );
};

export default Login;
