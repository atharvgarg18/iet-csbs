import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, User, Lock, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/components/auth/AuthProvider';
import { COLORS, COMPONENTS } from '@/lib/management-design-system';

export default function ManagementLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({ email: '', password: '' });
  const { user, login, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (user && !authLoading && (user.role === 'admin' || user.role === 'editor' || user.role === 'viewer')) {
      navigate('/management-portal');
    }
  }, [user, authLoading, navigate]);

  const validateForm = () => {
    const newErrors = { email: '', password: '' };
    let isValid = true;

    if (!email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
      isValid = false;
    }

    if (!password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const result = await login(email, password);
      
      if (result.success) {
        toast({
          title: "Welcome Back",
          description: "Successfully logged into Management Portal",
        });
      } else {
        toast({
          title: "Authentication Failed",
          description: result.error || "Invalid email or password",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: COLORS.neutral[100] }}
      >
        <div className="text-center space-y-4">
          <div 
            className="w-12 h-12 rounded-full animate-spin mx-auto border-4 border-t-transparent"
            style={{ 
              borderColor: COLORS.neutral[300],
              borderTopColor: COLORS.primary[600]
            }}
          />
          <p style={{ color: COLORS.neutral[600] }}>Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-6"
      style={{ backgroundColor: COLORS.neutral[100] }}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `
              radial-gradient(circle at 25% 25%, ${COLORS.primary[200]}40 0%, transparent 50%),
              radial-gradient(circle at 75% 75%, ${COLORS.accent[200]}40 0%, transparent 50%)
            `,
          }}
        />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div 
            className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg"
            style={{ backgroundColor: COLORS.primary[600] }}
          >
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h1 
            className="text-3xl font-bold mb-2"
            style={{ color: COLORS.neutral[900] }}
          >
            Management Portal
          </h1>
          <p style={{ color: COLORS.neutral[600] }}>
            Sign in to access your dashboard
          </p>
        </div>

        {/* Login Card */}
        <Card 
          className="shadow-xl border-0"
          style={{ 
            backgroundColor: COLORS.neutral[50],
            boxShadow: `0 20px 25px -5px ${COLORS.neutral[900]}10, 0 10px 10px -5px ${COLORS.neutral[900]}05`
          }}
        >
          <CardHeader className="pb-6">
            <CardTitle 
              className="text-xl font-semibold text-center"
              style={{ color: COLORS.neutral[900] }}
            >
              Welcome Back
            </CardTitle>
            <CardDescription 
              className="text-center"
              style={{ color: COLORS.neutral[600] }}
            >
              Enter your credentials to continue
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <Label 
                  htmlFor="email" 
                  className="text-sm font-medium"
                  style={{ color: COLORS.neutral[700] }}
                >
                  Email Address
                </Label>
                <div className="relative">
                  <User 
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4"
                    style={{ color: COLORS.neutral[500] }}
                  />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
                    }}
                    className={`pl-10 h-12 border-2 transition-all duration-200 focus:ring-0 ${
                      errors.email 
                        ? 'border-red-300 focus:border-red-500' 
                        : 'border-gray-200 focus:border-blue-500'
                    }`}
                    style={{
                      backgroundColor: COLORS.neutral[50],
                      borderColor: errors.email ? COLORS.error[300] : COLORS.neutral[300],
                    }}
                    placeholder="Enter your email"
                    disabled={isLoading}
                  />
                </div>
                {errors.email && (
                  <p className="text-sm" style={{ color: COLORS.error[600] }}>
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label 
                  htmlFor="password" 
                  className="text-sm font-medium"
                  style={{ color: COLORS.neutral[700] }}
                >
                  Password
                </Label>
                <div className="relative">
                  <Lock 
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4"
                    style={{ color: COLORS.neutral[500] }}
                  />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password) setErrors(prev => ({ ...prev, password: '' }));
                    }}
                    className={`pl-10 pr-10 h-12 border-2 transition-all duration-200 focus:ring-0 ${
                      errors.password 
                        ? 'border-red-300 focus:border-red-500' 
                        : 'border-gray-200 focus:border-blue-500'
                    }`}
                    style={{
                      backgroundColor: COLORS.neutral[50],
                      borderColor: errors.password ? COLORS.error[300] : COLORS.neutral[300],
                    }}
                    placeholder="Enter your password"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-md hover:bg-gray-100 transition-colors"
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" style={{ color: COLORS.neutral[500] }} />
                    ) : (
                      <Eye className="h-4 w-4" style={{ color: COLORS.neutral[500] }} />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm" style={{ color: COLORS.error[600] }}>
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 text-white font-medium rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: COLORS.primary[600],
                  '&:hover': { backgroundColor: COLORS.primary[700] }
                }}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
                    />
                    <span>Signing In...</span>
                  </div>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm" style={{ color: COLORS.neutral[500] }}>
            Protected by advanced security measures
          </p>
        </div>
      </div>
    </div>
  );
}