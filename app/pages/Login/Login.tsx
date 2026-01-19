"use client";

import { useAuthActions, useAuthLoading, useIsAuthenticated } from "@/app/store/authStore";
import { FormEvent, useState, useEffect } from "react";
import { FormLogin } from "./component/Form";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

export default function Login() {
  const [isDark, setIsDark] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    username: "",
  });

  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuthActions();
  const isLoading = useAuthLoading();
  const isAuthenticated = useIsAuthenticated();

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      const redirect = searchParams.get("redirect") || "/pokemon";
      router.push(redirect);
    }
  }, [isAuthenticated, router, searchParams]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await login(formData.email, formData.password);
    
    // Después del login exitoso, redirigir
    const redirect = searchParams.get("redirect") || "/pokemon";
    router.push(redirect);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className={isDark ? "dark" : ""}>
      <div className="min-h-screen bg-gradient-to-br from-pokemon-primary via-pokemon-secondary to-pokemon-accent transition-colors duration-300">
        {/* Theme Toggle */}
        <button
          onClick={() => setIsDark(!isDark)}
          className="absolute top-4 right-4 p-3 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all"
        >
          {isDark ? "☀️" : "🌙"}
        </button>

        <div className="flex items-center justify-center min-h-screen p-4">
          <div className="w-full max-w-md">
            {/* Pokeball Decoration */}
            <div className="flex justify-center mb-8">
              <div className="relative w-24 h-24">
                <div className="absolute inset-0 bg-pokemon-pokeball-top rounded-t-full"></div>
                <div className="absolute bottom-0 w-full h-12 bg-pokemon-pokeball-bottom rounded-b-full"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full border-4 border-pokemon-text"></div>
                <div className="absolute top-1/2 left-0 right-0 h-1 bg-pokemon-text"></div>
              </div>
            </div>

            {/* Card */}
            <div className="bg-pokemon-card backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20">
              {/* Title */}
              <h1 className="text-4xl font-bold text-center mb-2 text-pokemon-text">
                Welcome Back!
              </h1>
              <p className="text-center text-pokemon-text/70 mb-8">
                Login to continue your journey
              </p>

              {/* Form */}
              <div className="space-y-5">
                <FormLogin
                  isLoading={isLoading}
                  onSubmitAction={handleSubmit}
                  emailValue={formData.email}
                  passwordValue={formData.password}
                  emailValueAction={handleChange}
                  passwordValueAction={handleChange}
                />

                <div className="flex justify-end">
                  <button className="text-sm text-pokemon-accent hover:text-pokemon-accent/80 transition-colors">
                    Forgot password?
                  </button>
                </div>
              </div>

              {/* Toggle */}
              <div className="mt-6 text-center">
                <p className="text-pokemon-text/70">
                  Don't have an account?{" "}
                  <Link
                    href={"/register"}
                    className="text-pokemon-accent font-semibold hover:text-pokemon-accent/80 transition-colors"
                  >
                    Register
                  </Link>
                </p>
              </div>

              {/* Divider */}
              <div className="flex items-center my-6">
                <div className="flex-1 border-t border-pokemon-text/20"></div>
                <span className="px-4 text-sm text-pokemon-text/50">
                  or continue with
                </span>
                <div className="flex-1 border-t border-pokemon-text/20"></div>
              </div>

              {/* Social Buttons */}
              <div className="grid grid-cols-2 gap-4">
                <button className="py-3 px-4 rounded-xl bg-pokemon-input hover:bg-pokemon-input/80 text-pokemon-text font-medium transition-all flex items-center justify-center gap-2">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
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
                  Google
                </button>
                <button className="py-3 px-4 rounded-xl bg-pokemon-input hover:bg-pokemon-input/80 text-pokemon-text font-medium transition-all flex items-center justify-center gap-2">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                  GitHub
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
