"use client";

import React, { useState } from "react";
import { User, Lock, Eye, EyeOff, LogIn, AlertCircle, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();

  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!login.trim() || !password) {
      setErrorMessage("Silakan isi email/username dan password.");
      return;
    }

    setIsLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
      const response = await fetch(`${apiUrl}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          login: login.trim(),
          password: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            (data.errors
              ? Object.values(data.errors).flat().join(" ")
              : "Login gagal. Silakan periksa kembali akun Anda.")
        );
      }

      // Save token and user details to localStorage & Cookies
      if (data.token) {
        localStorage.setItem("trashure_token", data.token);
        localStorage.setItem("trashure_user", JSON.stringify(data.user));
        document.cookie = `trashure_token=${data.token}; path=/; max-age=${
          data.expires_in || 86400
        }; SameSite=Lax`;
      }

      setSuccessMessage("Login berhasil! Mengalihkan...");

      // Redirect after brief delay
      setTimeout(() => {
        const role = data.user?.role || "warga";
        // Default role routing (can be adjusted as needed)
        if (role === "admin") {
          router.push("/admin");
        } else if (role === "petugas") {
          router.push("/petugas");
        } else if (role === "pengepul") {
          router.push("/pengepul");
        } else {
          router.push("/warga");
        }
      }, 900);
    } catch (err: any) {
      setErrorMessage(
        err.message || "Terjadi kesalahan koneksi ke server. Pastikan backend aktif."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[440px] bg-white rounded-[24px] shadow-[0_12px_45px_rgba(0,0,0,0.07)] border border-gray-100/80 p-7 sm:p-9 relative z-10 transition-all">
      {/* Top Sprout Icon Badge */}
      <div className="flex justify-center mb-4">
        <div className="w-14 h-14 rounded-full bg-[#eaf6ee] flex items-center justify-center">
          <svg
            className="w-7 h-7"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M24 42C24 32 24 22 24 12"
              stroke="#167e41"
              strokeWidth="3.2"
              strokeLinecap="round"
            />
            <path
              d="M24 20C16 20 11 15 12 8C19 8 23 13 24 20Z"
              fill="#167e41"
            />
            <path
              d="M24 14C31 14 36 10 35 4C28 4 25 9 24 14Z"
              fill="#1da457"
            />
            <path
              d="M24 30C15 30 10 24 11 17C18 17 23 23 24 30Z"
              fill="#1da457"
            />
            <path
              d="M24 25C33 25 38 20 37 13C29 13 25 19 24 25Z"
              fill="#167e41"
            />
          </svg>
        </div>
      </div>

      {/* Header Titles */}
      <div className="text-center mb-6">
        <h1 className="text-[23px] sm:text-[25px] font-bold text-gray-900 tracking-tight">
          Selamat Datang
        </h1>
        <p className="text-[13px] sm:text-sm text-gray-500 mt-1">
          Masuk untuk mengakses akun Anda
        </p>
      </div>

      {/* Error Alert */}
      {errorMessage && (
        <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-start gap-2.5 animate-in fade-in duration-200">
          <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
          <span className="flex-1 leading-snug">{errorMessage}</span>
        </div>
      )}

      {/* Success Alert */}
      {successMessage && (
        <div className="mb-5 p-3.5 rounded-xl bg-green-50 border border-green-200 text-green-700 text-xs sm:text-sm flex items-center gap-2.5 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
          <span className="flex-1 font-medium">{successMessage}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email / Username Field */}
        <div>
          <label
            htmlFor="loginInput"
            className="block text-xs sm:text-[13px] font-semibold text-gray-800 mb-1.5"
          >
            Email atau Username
          </label>
          <div className="relative flex items-center">
            <User className="w-4 h-4 text-gray-400 absolute left-3.5 pointer-events-none" />
            <input
              id="loginInput"
              type="text"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              placeholder="Masukkan email atau username"
              autoComplete="username"
              required
              className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-white border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#167e41] focus:ring-4 focus:ring-[#167e41]/10 transition-all"
            />
          </div>
        </div>

        {/* Password Field */}
        <div>
          <label
            htmlFor="passwordInput"
            className="block text-xs sm:text-[13px] font-semibold text-gray-800 mb-1.5"
          >
            Password
          </label>
          <div className="relative flex items-center">
            <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 pointer-events-none" />
            <input
              id="passwordInput"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan password"
              autoComplete="current-password"
              required
              className="w-full pl-10 pr-11 py-2.5 sm:py-3 bg-white border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#167e41] focus:ring-4 focus:ring-[#167e41]/10 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
              aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
              className="absolute right-3.5 text-gray-400 hover:text-gray-600 focus:outline-none p-1 transition-colors"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Lupa Password */}
        <div className="flex justify-end pt-0.5">
          <a
            href="#lupa-password"
            onClick={(e) => {
              e.preventDefault();
              alert(
                "Silakan hubungi administrator bank sampah Trashure untuk me-reset password akun Anda."
              );
            }}
            className="text-xs sm:text-[13px] font-semibold text-[#167e41] hover:text-[#115e30] transition-colors"
          >
            Lupa Password?
          </a>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 sm:py-3.5 px-4 bg-[#167e41] hover:bg-[#126936] active:scale-[0.99] disabled:opacity-75 disabled:cursor-not-allowed text-white font-semibold text-sm sm:text-[15px] rounded-xl flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(22,126,65,0.28)] transition-all cursor-pointer"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <svg
                  className="animate-spin h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span>Memproses...</span>
              </div>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>Masuk</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
