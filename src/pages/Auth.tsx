import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, ArrowLeft, Loader2, Sparkles } from "lucide-react";

type AuthMode = "login" | "signup" | "forgot-password" | "reset-password";

export function Auth() {
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Check URL parameters for pre-filled email and mode
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const emailParam = urlParams.get("email");
    const modeParam = urlParams.get("mode");

    if (emailParam) {
      setEmail(decodeURIComponent(emailParam));
    }
    if (modeParam === "login") {
      setMode("login");
    } else if (modeParam === "signup") {
      setMode("signup");
    } else if (modeParam === "reset-password") {
      setMode("reset-password");
    }
  }, []);

  // Check if user is already logged in
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/app");
      }
    };
    checkSession();
  }, [navigate]);

  // Listen for auth state changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          toast({
            title: "Welcome!",
            description: "You've been logged in successfully.",
          });
          
          setTimeout(() => {
            navigate("/app");
          }, 500);
        } else if (event === 'PASSWORD_RECOVERY') {
          setMode("reset-password");
          toast({
            title: "Reset Your Password",
            description: "Please enter your new password below.",
          });
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate, toast]);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = async () => {
    if (!email || !password) {
      toast({
        title: "Missing Fields",
        description: "Please enter both email and password.",
        variant: "destructive",
      });
      return;
    }

    if (!validateEmail(email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (error) throw error;

      if (data.session) {
        localStorage.setItem("supabase-session", JSON.stringify(data.session));
        localStorage.setItem("supabase-user", JSON.stringify(data.user));
      }

      toast({
        title: "Welcome back!",
        description: "You've been logged in successfully.",
      });

      navigate("/app");
    } catch (error: any) {
      let errorMessage = "An error occurred during login.";

      if (error.message.includes("Invalid login credentials")) {
        errorMessage = "Invalid email or password. Please check your credentials.";
      } else if (error.message.includes("Email not confirmed")) {
        errorMessage = "Please verify your email before logging in. Check your inbox.";
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast({
        title: "Login Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async () => {
    if (!email || !password || !confirmPassword) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    if (!validateEmail(email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Weak Password",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Passwords Don't Match",
        description: "Please make sure your passwords match.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const redirectUrl = `${window.location.origin}/auth/callback`;

      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          emailRedirectTo: redirectUrl,
        },
      });

      if (error) {
        if (error.message.includes("User already registered")) {
          toast({
            title: "Account Exists",
            description: "An account with this email already exists. Please login instead.",
            variant: "destructive",
          });
          setMode("login");
          return;
        }
        throw error;
      }

      if (data.user && !data.session) {
        toast({
          title: "Check Your Email! 📧",
          description: "We've sent you a confirmation link to complete your registration.",
        });
        setResetEmailSent(true);
      } else if (data.session) {
        localStorage.setItem("supabase-session", JSON.stringify(data.session));
        localStorage.setItem("supabase-user", JSON.stringify(data.user));

        toast({
          title: "Welcome to GlamFlow! 🎉",
          description: "Your account has been created successfully.",
        });

        navigate("/app");
      }
    } catch (error: any) {
      toast({
        title: "Signup Failed",
        description: error.message || "An error occurred during signup.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return;
    }

    if (!validateEmail(email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(
        email.trim().toLowerCase(),
        {
          redirectTo: `${window.location.origin}/auth?mode=reset-password`,
        }
      );

      if (error) throw error;

      setResetEmailSent(true);
      toast({
        title: "Check Your Email! 📧",
        description: "We've sent you a password reset link. Please check your inbox.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send reset email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!password || !confirmPassword) {
      toast({
        title: "Missing Fields",
        description: "Please enter and confirm your new password.",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Weak Password",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Passwords Don't Match",
        description: "Please make sure your passwords match.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) throw error;

      toast({
        title: "Password Updated! 🎉",
        description: "Your password has been reset successfully. You can now login.",
      });

      setMode("login");
      setPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to reset password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: `${window.location.origin}/auth/callback` },
      });
    
      if (error) throw error;
    } catch (error: any) {
      toast({
        title: "Google Login Error",
        description: error.message || "Failed to login with Google. Please try again.",
        variant: "destructive",
      });
      setGoogleLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    switch (mode) {
      case "login":
        handleLogin();
        break;
      case "signup":
        handleSignup();
        break;
      case "forgot-password":
        handleForgotPassword();
        break;
      case "reset-password":
        handleResetPassword();
        break;
    }
  };

  const getTitle = () => {
    switch (mode) {
      case "login":
        return "Welcome Back";
      case "signup":
        return "Create Account";
      case "forgot-password":
        return "Forgot Password";
      case "reset-password":
        return "Reset Password";
    }
  };

  const getDescription = () => {
    switch (mode) {
      case "login":
        return "Enter your credentials to access your dashboard";
      case "signup":
        return "Create your GlamFlow account to get started";
      case "forgot-password":
        return "Enter your email and we'll send you a reset link";
      case "reset-password":
        return "Enter your new password below";
    }
  };

  const getButtonText = () => {
    if (loading) {
      return (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Please wait...
        </>
      );
    }
    switch (mode) {
      case "login":
        return "Sign In";
      case "signup":
        return "Create Account";
      case "forgot-password":
        return "Send Reset Link";
      case "reset-password":
        return "Update Password";
    }
  };

  // Email sent confirmation screen
  if (resetEmailSent && (mode === "forgot-password" || mode === "signup")) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-gray-900 p-4">
        <Card className="mx-auto max-w-md w-full shadow-xl border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
              <Mail className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Check Your Email
            </CardTitle>
            <CardDescription className="text-base mt-2">
              We've sent a {mode === "forgot-password" ? "password reset" : "confirmation"} link to
            </CardDescription>
            <p className="font-medium text-gray-900 dark:text-white mt-1">{email}</p>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <div className="bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 p-4 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-300 text-center">
                {mode === "forgot-password" 
                  ? "Click the link in the email to reset your password. The link will expire in 1 hour."
                  : "Click the link in the email to verify your account and start using GlamFlow."}
              </p>
            </div>
            <div className="text-center text-sm text-gray-500 dark:text-gray-400">
              Didn't receive the email?{" "}
              <button
                onClick={() => {
                  setResetEmailSent(false);
                  if (mode === "forgot-password") {
                    handleForgotPassword();
                  }
                }}
                className="text-pink-600 hover:text-pink-700 font-medium underline"
              >
                Resend
              </button>
            </div>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                setResetEmailSent(false);
                setMode("login");
              }}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-gray-900 p-4">
      <Card className="mx-auto max-w-md w-full shadow-xl border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto mb-4 flex items-center justify-center">
            <Sparkles className="h-10 w-10 text-pink-500" />
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            {getTitle()}
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            {getDescription()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email field - shown for all modes except reset-password */}
            {mode !== "reset-password" && (
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-11 border-gray-200 dark:border-gray-700 focus:border-pink-500 focus:ring-pink-500"
                    disabled={loading}
                  />
                </div>
              </div>
            )}

            {/* Password field - shown for login, signup, and reset-password */}
            {(mode === "login" || mode === "signup" || mode === "reset-password") && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-gray-700 dark:text-gray-300">
                    {mode === "reset-password" ? "New Password" : "Password"}
                  </Label>
                  {mode === "login" && (
                    <button
                      type="button"
                      onClick={() => setMode("forgot-password")}
                      className="text-sm text-pink-600 hover:text-pink-700 font-medium"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 h-11 border-gray-200 dark:border-gray-700 focus:border-pink-500 focus:ring-pink-500"
                    disabled={loading}
                  />
                </div>
              </div>
            )}

            {/* Confirm Password field - shown for signup and reset-password */}
            {(mode === "signup" || mode === "reset-password") && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-gray-700 dark:text-gray-300">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10 h-11 border-gray-200 dark:border-gray-700 focus:border-pink-500 focus:ring-pink-500"
                    disabled={loading}
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <Button 
              type="submit" 
              disabled={loading} 
              className="w-full h-11 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-medium shadow-lg shadow-pink-500/25"
            >
              {getButtonText()}
            </Button>

            {/* Back button for forgot-password and reset-password modes */}
            {(mode === "forgot-password" || mode === "reset-password") && (
              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={() => {
                  setMode("login");
                  setPassword("");
                  setConfirmPassword("");
                }}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Login
              </Button>
            )}

            {/* Divider - only for login and signup */}
            {(mode === "login" || mode === "signup") && (
              <>
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-200 dark:border-gray-700" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white dark:bg-gray-900 px-2 text-gray-500">
                      Or continue with
                    </span>
                  </div>
                </div>

                {/* Google Auth Button */}
                <Button 
                  type="button"
                  variant="outline" 
                  onClick={handleGoogleLogin} 
                  disabled={googleLoading}
                  className="w-full h-11 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  {googleLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                      />
                    </svg>
                  )}
                  {googleLoading ? "Connecting..." : "Continue with Google"}
                </Button>

                {/* Toggle between login and signup */}
                <div className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
                  {mode === "login" ? (
                    <>
                      Don't have an account?{" "}
                      <button
                        type="button"
                        onClick={() => setMode("signup")}
                        className="text-pink-600 hover:text-pink-700 font-medium"
                      >
                        Sign up
                      </button>
                    </>
                  ) : (
                    <>
                      Already have an account?{" "}
                      <button
                        type="button"
                        onClick={() => setMode("login")}
                        className="text-pink-600 hover:text-pink-700 font-medium"
                      >
                        Sign in
                      </button>
                    </>
                  )}
                </div>
              </>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
