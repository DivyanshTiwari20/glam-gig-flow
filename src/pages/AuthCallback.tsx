import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, CheckCircle, XCircle } from "lucide-react";

export default function AuthCallback() {
    const navigate = useNavigate();
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const [message, setMessage] = useState("Processing authentication...");

    useEffect(() => {
        const handleAuthCallback = async () => {
            try {
                // Get the URL hash/fragment for OAuth callbacks
                const hashParams = new URLSearchParams(window.location.hash.substring(1));
                const accessToken = hashParams.get("access_token");
                const refreshToken = hashParams.get("refresh_token");
                const type = hashParams.get("type");

                // Check URL search params for error
                const searchParams = new URLSearchParams(window.location.search);
                const error = searchParams.get("error");
                const errorDescription = searchParams.get("error_description");

                if (error) {
                    setStatus("error");
                    setMessage(errorDescription || "Authentication failed. Please try again.");
                    setTimeout(() => navigate("/auth"), 3000);
                    return;
                }

                // Handle password recovery
                if (type === "recovery") {
                    setMessage("Password reset link verified. Redirecting...");
                    setStatus("success");
                    setTimeout(() => {
                        navigate("/auth?mode=reset-password");
                    }, 1500);
                    return;
                }

                // Handle signup confirmation
                if (type === "signup") {
                    setMessage("Email verified successfully! Redirecting to dashboard...");
                    setStatus("success");
                    setTimeout(() => {
                        navigate("/app");
                    }, 1500);
                    return;
                }

                // If we have tokens, set them manually (for OAuth)
                if (accessToken && refreshToken) {
                    const { data, error } = await supabase.auth.setSession({
                        access_token: accessToken,
                        refresh_token: refreshToken,
                    });

                    if (error) throw error;

                    if (data.session) {
                        localStorage.setItem("supabase-session", JSON.stringify(data.session));
                        localStorage.setItem("supabase-user", JSON.stringify(data.user));
                        setMessage("Login successful! Redirecting to dashboard...");
                        setStatus("success");
                        setTimeout(() => {
                            navigate("/app");
                        }, 1500);
                        return;
                    }
                }

                // Try to get existing session
                const { data: { session }, error: sessionError } = await supabase.auth.getSession();

                if (sessionError) throw sessionError;

                if (session) {
                    localStorage.setItem("supabase-session", JSON.stringify(session));
                    localStorage.setItem("supabase-user", JSON.stringify(session.user));
                    setMessage("Login successful! Redirecting to dashboard...");
                    setStatus("success");
                    setTimeout(() => {
                        navigate("/app");
                    }, 1500);
                } else {
                    // No session found, redirect to auth
                    setMessage("Session expired. Redirecting to login...");
                    setTimeout(() => {
                        navigate("/auth");
                    }, 2000);
                }
            } catch (error: any) {
                console.error("Auth callback error:", error);
                setStatus("error");
                setMessage(error.message || "Authentication failed. Please try again.");
                setTimeout(() => navigate("/auth"), 3000);
            }
        };

        handleAuthCallback();
    }, [navigate]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-gray-900">
            <div className="text-center p-8 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl shadow-xl max-w-md w-full mx-4">
                {status === "loading" && (
                    <>
                        <Loader2 className="h-16 w-16 animate-spin mx-auto mb-6 text-pink-500" />
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                            Processing
                        </h2>
                    </>
                )}

                {status === "success" && (
                    <>
                        <div className="mx-auto mb-6 w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                            <CheckCircle className="h-10 w-10 text-white" />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                            Success!
                        </h2>
                    </>
                )}

                {status === "error" && (
                    <>
                        <div className="mx-auto mb-6 w-16 h-16 bg-gradient-to-br from-red-400 to-rose-500 rounded-full flex items-center justify-center">
                            <XCircle className="h-10 w-10 text-white" />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                            Something went wrong
                        </h2>
                    </>
                )}

                <p className="text-gray-600 dark:text-gray-400">{message}</p>
            </div>
        </div>
    );
}
