"use client";
import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, Sparkles } from "lucide-react";
import { signIn } from "@/lib/auth-client"; 
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  // Framer motion entry animation rules for form card
  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };
  const router=useRouter();
  // Toggle state variables for managing secret visibility
  const [showPass, setShowPass] = useState(false);
  
  // Single comprehensive credentials input storage object
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Tracking individual validation strings underneath respective inputs
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  // Structural dynamic checker validating syntax metrics on field update
  const validateField = (name, value) => {
    let errorMsg = "";

    if (name === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        errorMsg = "Please enter a valid email address.";
      }
    }

    if (name === "password") {
      if (value.trim() === "") {
        errorMsg = "Password cannot be empty.";
      }
    }

    setErrors((prev) => ({ ...prev, [name]: errorMsg }));
  };

  // Synchronize targeted keyboard keystrokes directly with local component memory
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    validateField(name, value);
  };

  // Form valid check controller mapping whether submission button is enabled or disabled
  const isFormValid =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) &&
    formData.password.trim() !== "" &&
    !errors.email &&
    !errors.password;

  // Process credentials and fire API token authentication requests via BetterAuth
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) return; // Prevent submission attempts if form state is locked

    const { email, password } = formData;
    try {
      const { error } = await signIn.email({
        email: email,
        password: password,
      });

      if (error) {
        toast.error(error.message || "Invalid credentials!");
        return;
      }
      toast.success("Logged in successfully!");
      router.push('/');
    } catch (err) {
      toast.error(err.message || "An unexpected error occurred");
    }
  };
const handleGoogleLogin = async () => {
    await signIn.social({
      provider: "google",
      // callbackURL: "/", 
    });
    router.push('/');
  };
  return (
    <div className="min-h-screen mt-10 flex items-center justify-center bg-[#FDFBF7] dark:bg-[#0B0F19] text-[#1A1A1A] dark:text-[#F3F4F6] px-4 transition-colors duration-300 font-sans">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md bg-white dark:bg-[#111827] border border-gray-100 dark:border-gray-800/80 p-8 md:p-10 shadow-xl rounded-sm"
      >
        {/* Branding Title Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 text-[#C5A880] text-xs uppercase tracking-[0.2em] mb-2 font-medium">
            <Sparkles size={14} /> Welcome Back
          </div>
          <h2 className="font-serif text-3xl md:text-4xl font-light tracking-wide">
            Account Login
          </h2>
        </div>

        {/* Core Sign In Request Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email input interface section block */}
          <div>
            <label className="block text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400 font-medium mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <Mail size={16} />
              </span>
              <input
                required
                type="email"
                placeholder="name@example.com"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 dark:bg-[#1F2937]/40 border ${
                  errors.email ? "border-red-500 focus:border-red-500" : "border-gray-200 dark:border-gray-800 focus:border-[#C5A880]"
                } focus:outline-none transition-colors rounded-sm`}
              />
            </div>
            {errors.email && <p className="text-red-500 text-xs mt-1 font-medium">{errors.email}</p>}
          </div>

          {/* Secret Password input interface section block */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400 font-medium">
                Password
              </label>
              <Link href="/forgot-password" className="text-[11px] tracking-wide text-gray-400 hover:text-[#C5A880] transition">
                Forgot?
              </Link>
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <Lock size={16} />
              </span>
              <input
                required
                type={showPass ? "text" : "password"}
                placeholder="••••••••"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full pl-10 pr-10 py-2.5 text-sm bg-gray-50 dark:bg-[#1F2937]/40 border ${
                  errors.password ? "border-red-500 focus:border-red-500" : "border-gray-200 dark:border-gray-800 focus:border-[#C5A880]"
                } focus:outline-none transition-colors rounded-sm`}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-xs mt-1 font-medium">{errors.password}</p>}
          </div>

          {/* Conditional authentication dispatch control element */}
          <motion.button
            whileTap={isFormValid ? { scale: 0.98 } : {}}
            disabled={!isFormValid}
            type="submit"
            className={`w-full py-3 text-xs uppercase tracking-widest font-semibold rounded-sm shadow-md transition-all duration-300 ${
              isFormValid
                ? "bg-[#1A1A1A] dark:bg-[#C5A880] text-white dark:text-[#0B0F19] hover:bg-[#C5A880] dark:hover:bg-[#E2C799] cursor-pointer"
                : "bg-gray-300 dark:bg-gray-800 text-gray-500 dark:text-gray-600 cursor-not-allowed opacity-50"
            }`}
          >
            Sign In
          </motion.button>
        </form>

        {/* Layout divider visual separator accent */}
        <div className="relative flex py-5 items-center">
          <div className="grow border-t border-gray-200 dark:border-gray-800"></div>
          <span className="shrink mx-4 text-xs tracking-widest text-gray-400 uppercase">
            Or connect via
          </span>
          <div className="grow border-t border-gray-200 dark:border-gray-800"></div>
        </div>

        {/* Unified Native Google OAuth alternative connection node asset */}
        <button
          onClick={handleGoogleLogin}
          className="w-full py-2.5 flex items-center justify-center gap-3 bg-transparent border border-gray-200 dark:border-gray-800 text-sm font-medium hover:bg-gray-50 dark:hover:bg-[#1F2937]/40 transition-colors rounded-sm"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24">
            <path
              fill="#EA4335"
              d="M12.24 10.285V14.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.866-3.577-7.866-8s3.536-8 7.866-8c2.46 0 4.105 1.025 5.047 1.926l3.256-3.133C18.332 1.157 15.532 0 12.24 0c-6.63 0-12 5.37-12 12s5.37 12 12 12c6.923 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z"
            />
          </svg>
          Sign in with Google
        </button>

        {/* Dynamic linking redirection route leading directly towards registration layout */}
        <p className="text-center text-xs tracking-wide text-gray-500 dark:text-gray-400 mt-6">
          New to AuraCanvas?{" "}
          <Link
            href="/register"
            className="text-[#C5A880] font-semibold underline underline-offset-4 hover:text-[#1A1A1A] dark:hover:text-white transition"
          >
            Create an account
          </Link>
        </p>
      </motion.div>
    </div>
  );
}