"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/auth/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";

export default function AuthForm() {
  const {
    user,
    loginWithGoogle,
    loginWithEmail,
    register,
    resetPassword
  } = useAuth();

  const router = useRouter();
  const params = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"login" | "signup" | "reset">("login");

  const redirect = params.get("redirect") || "/dashboard";

  // 🔥 MAIN FIX — already logged in → redirect
  useEffect(() => {
    if (user) {
      router.push(redirect);
    }
  }, [user, router, redirect]);

  const handleSubmit = async () => {
    try {
      if (mode === "login") {
        await loginWithEmail(email, password);
      } else if (mode === "signup") {
        await register(email, password);
      } else {
        await resetPassword(email);
        alert("Reset link sent to your email");
        setMode("login");
      }
    } catch (err) {
      alert((err as Error)?.message || "Authentication failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="glass-panel p-8 w-[360px] space-y-5">

        <h1 className="text-xl font-semibold text-center">
          {mode === "login" && "Login"}
          {mode === "signup" && "Create Account"}
          {mode === "reset" && "Reset Password"}
        </h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 bg-slate-900 border border-slate-700 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {mode !== "reset" && (
          <input
            type="password"
            placeholder="Password"
            className="w-full p-2 bg-slate-900 border border-slate-700 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        )}

        <button
          onClick={handleSubmit}
          className="btn-gradient w-full"
        >
          {mode === "login" && "Login"}
          {mode === "signup" && "Sign Up"}
          {mode === "reset" && "Send Reset Link"}
        </button>

        {/* 🔥 GOOGLE */}
        {mode !== "reset" && (
          <button
            onClick={loginWithGoogle}
            className="w-full flex items-center justify-center gap-2 border border-slate-700 rounded py-2 hover:bg-slate-800"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              className="w-5 h-5"
            />
            Continue with Google
          </button>
        )}

        {/* 🔁 SWITCH */}
        <div className="text-xs text-slate-400 text-center space-y-1">
          {mode === "login" && (
            <>
              <p onClick={() => setMode("signup")} className="cursor-pointer hover:text-white">
                Create account
              </p>
              <p onClick={() => setMode("reset")} className="cursor-pointer hover:text-white">
                Forgot password?
              </p>
            </>
          )}

          {mode === "signup" && (
            <p onClick={() => setMode("login")} className="cursor-pointer hover:text-white">
              Already have account?
            </p>
          )}

          {mode === "reset" && (
            <p onClick={() => setMode("login")} className="cursor-pointer hover:text-white">
              Back to login
            </p>
          )}
        </div>

      </div>
    </div>
  );
}