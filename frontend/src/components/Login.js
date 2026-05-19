import React, { useState } from "react";

import {
  Mail,
  Lock,
  Globe,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

import { authService } from "../api/authService";

const Login = ({
  onLoginSuccess,
}) => {
  const [isSignup, setIsSignup] =
    useState(false);

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const handleSubmit = async (
    e
  ) => {
    e.preventDefault();

    setError("");

    setLoading(true);

    try {
      let data;

      if (isSignup) {
        data =
          await authService.register(
            name,
            email,
            password
          );
      } else {
        data =
          await authService.login(
            email,
            password
          );
      }

      localStorage.setItem(
        "trueTraceToken",
        data.token
      );

      localStorage.setItem(
        "trueTraceUser",
        JSON.stringify(data.user)
      );

      onLoginSuccess(
        data.token,
        data.user
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      {/* LEFT SIDE */}
      <div className="hidden lg:flex w-1/2 bg-slate-900 items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500 via-transparent to-transparent"></div>

        <div className="relative z-10 max-w-md text-center">
          <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center mb-8 mx-auto shadow-2xl shadow-blue-500/20">
            <ShieldCheck
              size={40}
              className="text-white"
            />
          </div>

          <h1 className="text-4xl font-black text-white mb-6 tracking-tighter uppercase">
            TrueTrace
          </h1>

          <p className="text-slate-400 font-bold leading-relaxed">
            The industry standard
            for neural artifact
            analysis and digital
            media integrity.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-slate-800 tracking-tight">
              {isSignup
                ? "Create Account"
                : "Access Console"}
            </h2>

            <p className="text-slate-400 font-bold mt-2 tracking-tight italic uppercase text-[10px] tracking-[0.2em]">
              Forensic
              Authentication
              Required
            </p>
          </div>

          {error && (
            <div className="mb-4 bg-red-100 text-red-600 p-3 rounded-xl text-sm font-semibold">
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <button
              type="button"
              className="w-full flex items-center justify-center gap-3 bg-white border border-slate-200 py-3.5 rounded-2xl font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm"
            >
              <Globe
                size={20}
                className="text-blue-500"
              />

              Continue with SSO
            </button>

            <div className="flex items-center gap-4 py-4">
              <div className="flex-1 h-px bg-slate-100"></div>

              <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                or email
              </span>

              <div className="flex-1 h-px bg-slate-100"></div>
            </div>

            <div className="space-y-3">
              {isSignup && (
                <div className="relative">
                  <input
                    required
                    type="text"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) =>
                      setName(
                        e.target.value
                      )
                    }
                    className="w-full bg-white border border-slate-200 py-3.5 px-4 rounded-2xl outline-none focus:ring-2 focus:ring-blue-100 transition-all font-medium"
                  />
                </div>
              )}

              <div className="relative">
                <Mail
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                  size={18}
                />

                <input
                  required
                  type="email"
                  placeholder="Work Email"
                  value={email}
                  onChange={(e) =>
                    setEmail(
                      e.target.value
                    )
                  }
                  className="w-full bg-white border border-slate-200 py-3.5 pl-12 pr-4 rounded-2xl outline-none focus:ring-2 focus:ring-blue-100 transition-all font-medium"
                />
              </div>

              <div className="relative">
                <Lock
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                  size={18}
                />

                <input
                  required
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) =>
                    setPassword(
                      e.target.value
                    )
                  }
                  className="w-full bg-white border border-slate-200 py-3.5 pl-12 pr-4 rounded-2xl outline-none focus:ring-2 focus:ring-blue-100 transition-all font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
            >
              {loading
                ? "Please wait..."
                : isSignup
                ? "Initialize Profile"
                : "Login to Console"}

              {!loading && (
                <ArrowRight
                  size={18}
                />
              )}
            </button>
          </form>

          <p className="text-center mt-8 text-sm font-bold text-slate-400">
            {isSignup
              ? "Already registered?"
              : "New to TrueTrace?"}

            <button
              onClick={() =>
                setIsSignup(
                  !isSignup
                )
              }
              className="ml-2 text-blue-600 hover:underline"
            >
              {isSignup
                ? "Log In"
                : "Register Now"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;