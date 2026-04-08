import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, Lock, Eye, EyeOff, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { COLORS } from '@/lib/management-design-system';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  const { toast } = useToast();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!token || !token.startsWith('reset_')) {
      setErrorMsg('This reset link is invalid or has already been used.');
    }
  }, [token]);

  const passwordStrength = (pwd: string) => {
    if (pwd.length === 0) return null;
    if (pwd.length < 8) return { label: 'Too short', color: '#ef4444' };
    const hasUpper = /[A-Z]/.test(pwd);
    const hasLower = /[a-z]/.test(pwd);
    const hasNum = /\d/.test(pwd);
    const hasSpecial = /[^A-Za-z0-9]/.test(pwd);
    const score = [hasUpper, hasLower, hasNum, hasSpecial].filter(Boolean).length;
    if (score <= 1) return { label: 'Weak', color: '#f59e0b' };
    if (score === 2) return { label: 'Fair', color: '#f59e0b' };
    if (score === 3) return { label: 'Good', color: '#3b82f6' };
    return { label: 'Strong', color: '#22c55e' };
  };

  const strength = passwordStrength(newPassword);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (newPassword.length < 8) {
      setErrorMsg('Password must be at least 8 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    try {
      const resp = await fetch('/.netlify/functions/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, new_password: newPassword }),
      });
      const data = await resp.json();

      if (data.success) {
        setDone(true);
        setTimeout(() => navigate('/management-portal/login'), 3000);
      } else {
        setErrorMsg(data.error || 'Failed to reset password. The link may have expired.');
      }
    } catch {
      setErrorMsg('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{ backgroundColor: COLORS.neutral[100] }}
    >
      {/* Background blobs */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
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
        {/* Header */}
        <div className="text-center mb-8">
          <div
            className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg"
            style={{ backgroundColor: COLORS.primary[600] }}
          >
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-2" style={{ color: COLORS.neutral[900] }}>
            Management Portal
          </h1>
          <p style={{ color: COLORS.neutral[600] }}>Set a new password</p>
        </div>

        <Card
          className="shadow-xl border-0"
          style={{
            backgroundColor: COLORS.neutral[50],
            boxShadow: `0 20px 25px -5px ${COLORS.neutral[900]}10, 0 10px 10px -5px ${COLORS.neutral[900]}05`,
          }}
        >
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold text-center" style={{ color: COLORS.neutral[900] }}>
              Reset Password
            </CardTitle>
            <CardDescription className="text-center" style={{ color: COLORS.neutral[600] }}>
              Enter and confirm your new password below.
            </CardDescription>
          </CardHeader>

          <CardContent>
            {/* Invalid token */}
            {errorMsg && !isLoading && !done && (
              <div
                className="flex items-start gap-3 rounded-lg p-4 mb-4"
                style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca' }}
              >
                <XCircle className="h-5 w-5 mt-0.5 shrink-0" style={{ color: '#ef4444' }} />
                <p className="text-sm" style={{ color: '#b91c1c' }}>{errorMsg}</p>
              </div>
            )}

            {/* Success state */}
            {done ? (
              <div className="py-4 text-center space-y-3">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center mx-auto"
                  style={{ backgroundColor: '#dcfce7' }}
                >
                  <CheckCircle className="h-7 w-7" style={{ color: '#16a34a' }} />
                </div>
                <p className="font-semibold text-lg" style={{ color: COLORS.neutral[900] }}>
                  Password updated!
                </p>
                <p className="text-sm" style={{ color: COLORS.neutral[600] }}>
                  Redirecting you to the login page…
                </p>
              </div>
            ) : errorMsg && !token?.startsWith('reset_') ? (
              // Invalid link — just show go-back
              <div className="text-center pt-2 pb-4">
                <Link
                  to="/management-portal/login"
                  className="text-sm font-medium hover:underline"
                  style={{ color: COLORS.primary[600] }}
                >
                  &larr; Back to login
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* New password */}
                <div className="space-y-2">
                  <Label htmlFor="new-password" className="text-sm font-medium" style={{ color: COLORS.neutral[700] }}>
                    New Password
                  </Label>
                  <div className="relative">
                    <Lock
                      className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4"
                      style={{ color: COLORS.neutral[500] }}
                    />
                    <Input
                      id="new-password"
                      type={showNew ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => { setNewPassword(e.target.value); setErrorMsg(''); }}
                      className="pl-10 pr-10 h-12 border-2"
                      style={{ borderColor: COLORS.neutral[300], backgroundColor: 'white' }}
                      placeholder="At least 8 characters"
                      disabled={isLoading}
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => setShowNew(!showNew)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-gray-100"
                    >
                      {showNew ? (
                        <EyeOff className="h-4 w-4" style={{ color: COLORS.neutral[500] }} />
                      ) : (
                        <Eye className="h-4 w-4" style={{ color: COLORS.neutral[500] }} />
                      )}
                    </button>
                  </div>
                  {strength && (
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1 rounded-full bg-gray-200">
                        <div
                          className="h-1 rounded-full transition-all"
                          style={{
                            width: strength.label === 'Too short' ? '15%' : strength.label === 'Weak' ? '30%' : strength.label === 'Fair' ? '55%' : strength.label === 'Good' ? '75%' : '100%',
                            backgroundColor: strength.color,
                          }}
                        />
                      </div>
                      <span className="text-xs font-medium" style={{ color: strength.color }}>{strength.label}</span>
                    </div>
                  )}
                </div>

                {/* Confirm password */}
                <div className="space-y-2">
                  <Label htmlFor="confirm-password" className="text-sm font-medium" style={{ color: COLORS.neutral[700] }}>
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Lock
                      className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4"
                      style={{ color: COLORS.neutral[500] }}
                    />
                    <Input
                      id="confirm-password"
                      type={showConfirm ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => { setConfirmPassword(e.target.value); setErrorMsg(''); }}
                      className="pl-10 pr-10 h-12 border-2"
                      style={{
                        borderColor: confirmPassword && confirmPassword !== newPassword ? '#fca5a5' : COLORS.neutral[300],
                        backgroundColor: 'white',
                      }}
                      placeholder="Repeat your password"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-gray-100"
                    >
                      {showConfirm ? (
                        <EyeOff className="h-4 w-4" style={{ color: COLORS.neutral[500] }} />
                      ) : (
                        <Eye className="h-4 w-4" style={{ color: COLORS.neutral[500] }} />
                      )}
                    </button>
                  </div>
                  {confirmPassword && confirmPassword !== newPassword && (
                    <p className="text-xs" style={{ color: '#ef4444' }}>Passwords do not match</p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isLoading || !newPassword || !confirmPassword}
                  className="w-full h-12 text-white font-medium rounded-lg shadow-lg"
                  style={{ backgroundColor: COLORS.primary[600] }}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" /> Updating…
                    </span>
                  ) : 'Set New Password'}
                </Button>

                <p className="text-center text-sm" style={{ color: COLORS.neutral[500] }}>
                  <Link
                    to="/management-portal/login"
                    className="hover:underline font-medium"
                    style={{ color: COLORS.primary[600] }}
                  >
                    &larr; Back to login
                  </Link>
                </p>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
