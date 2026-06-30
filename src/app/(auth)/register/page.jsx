"use client";
import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  Paintbrush,
  ShoppingBag,
} from "lucide-react";
import { signIn, signUp } from "@/lib/auth-client"; // Better-Auth client instance
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  // Framer motion entry animation rules for form wrapper card
  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };
  const router = useRouter();
  // Password hide/show layout states
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  // Clean single object instance mapping state values
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user", // Defaults to Standard Buyer ("user")
    confirmPassword: "",
  });

  // Track error messages for real-time display below inputs
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Comprehensive rule evaluator for validating field conditions on-the-fly
  const validateField = (name, value) => {
    let errorMsg = "";

    if (name === "name") {
      if (value.trim().length < 3)
        errorMsg = "Name must be at least 3 characters.";
    }

    if (name === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value))
        errorMsg = "Please enter a valid email address.";
    }

    // Modern strict structural validation rules for security compliance
    if (name === "password") {
      if (value.length < 8) {
        errorMsg = "Password must be at least 8 characters long.";
      } else if (!/[A-Z]/.test(value)) {
        errorMsg = "Password must contain at least one uppercase letter (A-Z).";
      } else if (!/[a-z]/.test(value)) {
        errorMsg = "Password must contain at least one lowercase letter (a-z).";
      } else if (!/[0-9]/.test(value)) {
        errorMsg = "Password must contain at least one number (0-9).";
      } else if (!/[@$!%*?&]/.test(value)) {
        errorMsg =
          "Password must contain at least one special character (e.g., @$!%*?&).";
      }
    }

    if (name === "confirmPassword") {
      if (value !== formData.password) errorMsg = "Passwords do not match.";
    }

    // Dynamic cross check: re-evaluate confirmation if primary password alters afterwards
    if (name === "password" && formData.confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword:
          value === formData.confirmPassword ? "" : "Passwords do not match.",
      }));
    }

    setErrors((prev) => ({ ...prev, [name]: errorMsg }));
  };

  // Sync keyboard changes directly with form data status
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    validateField(name, value);
  };

  // Handle updates for explicit role tabs safely
  const handleRoleChange = (selectedRole) => {
    setFormData((prevData) => ({
      ...prevData,
      role: selectedRole,
    }));
  };

  // Explicit inline master validation state checking for execution permissions
  const isFormValid =
    formData.name.trim().length >= 3 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) &&
    formData.password.length >= 8 &&
    /[A-Z]/.test(formData.password) &&
    /[a-z]/.test(formData.password) &&
    /[0-9]/.test(formData.password) &&
    /[@$!%*?&]/.test(formData.password) &&
    formData.password === formData.confirmPassword &&
    !errors.name &&
    !errors.email &&
    !errors.password &&
    !errors.confirmPassword;

  // Process and transmit data structures to endpoints via BetterAuth API references
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) return; // Client action safe guard blocking bypasses

    const { name, email, password, role } = formData;
    try {
      const plan = role === "user" ? "user_free" : "artist_free";
      const { error } = await signUp.email({
        name: name,
        email: email,
        password: password,
        // Programmatic fallback configuration linking unique placeholder avatars using DiceBear SVG profiles
        image: `https://api.dicebear.com/10.x/initials/svg?seed=${encodeURIComponent(name)}`,
        role: role || "user",
        plan: plan,
        // callbackURL: "/login",
      });

      if (error) {
        toast.error(error.message || "Registration failed!");
        return;
      }
      toast.success("Account created successfully!");
      router.push("/login");
    } catch (err) {
      toast.error(err.message || "An unexpected error occurred");
    }
  };
 const GoogleSignUp = async (e) => {
  e.preventDefault();
  try {
    const { error } = await signIn.social({
      provider: "google",
      additionalData: {
        role: formData.role, 
      },
      // callbackURL: "/login",
    });

    if (error) {
      toast.error(error.message || "Authentication failed");
    }
    router.push('/login');
  } catch (error) {
    toast.error(error.message || "An unexpected error occurred");
  }
};
  return (
    <div className="min-h-screen  mt-10 flex items-center justify-center bg-[#FDFBF7] dark:bg-[#0B0F19] text-[#1A1A1A] dark:text-[#F3F4F6] px-4 py-20 transition-colors duration-300 font-sans">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-lg bg-white dark:bg-[#111827] border border-gray-100 dark:border-gray-800/80 p-8 md:p-10 shadow-xl rounded-sm"
      >
        {/* Header Titles Branding segment */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 text-[#C5A880] text-xs uppercase tracking-[0.2em] mb-2 font-medium">
            <Sparkles size={14} /> Join AuraCanvas
          </div>
          <h2 className="font-serif text-3xl md:text-4xl font-light tracking-wide">
            Create Account
          </h2>
        </div>

        {/* Account Role Switching Matrix Selection Block */}
        <div className="mb-8">
          <label className="block text-xs uppercase tracking-widest text-[#C5A880] font-semibold mb-3 text-center">
            Select Your Role
          </label>
          <div className="grid grid-cols-2 gap-4">
            {/* Buyer Account Button Interface Option */}
            <button
              type="button"
              onClick={() => handleRoleChange("user")}
              className={`relative p-4 flex flex-col items-center justify-center border transition-all duration-300 rounded-sm ${
                formData.role === "user"
                  ? "border-[#C5A880] bg-[#FDFBF7] dark:bg-[#1F2937]/50"
                  : "border-gray-200 dark:border-gray-800 bg-transparent opacity-60"
              }`}
            >
              {formData.role === "user" && (
                <motion.div
                  layoutId="activeRoleBg"
                  className="absolute inset-0 border border-[#C5A880] pointer-events-none rounded-sm"
                />
              )}
              <ShoppingBag
                size={20}
                className={formData.role === "user" ? "text-[#C5A880]" : ""}
              />
              <span className="text-sm font-medium mt-2">Buyer (User)</span>
            </button>

            {/* Artist Account Button Interface Option */}
            <button
              type="button"
              onClick={() => handleRoleChange("artist")}
              className={`relative p-4 flex flex-col items-center justify-center border transition-all duration-300 rounded-sm ${
                formData.role === "artist"
                  ? "border-[#C5A880] bg-[#FDFBF7] dark:bg-[#1F2937]/50"
                  : "border-gray-200 dark:border-gray-800 bg-transparent opacity-60"
              }`}
            >
              {formData.role === "artist" && (
                <motion.div
                  layoutId="activeRoleBg"
                  className="absolute inset-0 border border-[#C5A880] pointer-events-none rounded-sm"
                />
              )}
              <Paintbrush
                size={20}
                className={formData.role === "artist" ? "text-[#C5A880]" : ""}
              />
              <span className="text-sm font-medium mt-2">Artist</span>
            </button>
          </div>
        </div>

        {/* Master Execution Action Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Full Name input block container layout */}
          <div>
            <label className="block text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400 font-medium mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <User size={16} />
              </span>
              <input
                required
                type="text"
                placeholder="your name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 dark:bg-[#1F2937]/40 border ${
                  errors.name
                    ? "border-red-500 focus:border-red-500"
                    : "border-gray-200 dark:border-gray-800 focus:border-[#C5A880]"
                } focus:outline-none transition-colors rounded-sm`}
              />
            </div>
            {errors.name && (
              <p className="text-red-500 text-xs mt-1 font-medium">
                {errors.name}
              </p>
            )}
          </div>

          {/* Email Address input block container layout */}
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
                  errors.email
                    ? "border-red-500 focus:border-red-500"
                    : "border-gray-200 dark:border-gray-800 focus:border-[#C5A880]"
                } focus:outline-none transition-colors rounded-sm`}
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-xs mt-1 font-medium">
                {errors.email}
              </p>
            )}
          </div>

          {/* Primary Security Password Input field layer configuration */}
          <div>
            <label className="block text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400 font-medium mb-1.5">
              Password
            </label>
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
                  errors.password
                    ? "border-red-500 focus:border-red-500"
                    : "border-gray-200 dark:border-gray-800 focus:border-[#C5A880]"
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
            {errors.password && (
              <p className="text-red-500 text-xs mt-1 font-medium">
                {errors.password}
              </p>
            )}
          </div>

          {/* Verification Confirm Password input verification block layout */}
          <div>
            <label className="block text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400 font-medium mb-1.5">
              Confirm Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <Lock size={16} />
              </span>
              <input
                required
                type={showConfirmPass ? "text" : "password"}
                placeholder="••••••••"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full pl-10 pr-10 py-2.5 text-sm bg-gray-50 dark:bg-[#1F2937]/40 border ${
                  errors.confirmPassword
                    ? "border-red-500 focus:border-red-500"
                    : "border-gray-200 dark:border-gray-800 focus:border-[#C5A880]"
                } focus:outline-none transition-colors rounded-sm`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPass(!showConfirmPass)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                {showConfirmPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1 font-medium">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Master Form Trigger Execution action button element wrapper */}
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
            Register As {formData.role === "user" ? "Buyer" : "Artist"}
          </motion.button>
        </form>

        {/* Decorative Divider Graphic asset spacer spacer block layout line */}
        <div className="relative flex py-5 items-center">
          <div className="grow border-t border-gray-200 dark:border-gray-800"></div>
          <span className="shrink mx-4 text-xs tracking-widest text-gray-400 uppercase">
            Or connect via
          </span>
          <div className="grow border-t border-gray-200 dark:border-gray-800"></div>
        </div>

        {/* Integrated Native Google Authentication Provider click entry handler layer */}
        <button
          onClick={GoogleSignUp}
          className="w-full py-2.5 flex items-center justify-center gap-3 bg-transparent border border-gray-200 dark:border-gray-800 text-sm font-medium hover:bg-gray-50 dark:hover:bg-[#1F2937]/40 transition-colors rounded-sm"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24">
            <path
              fill="#EA4335"
              d="M12.24 10.285V14.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.866-3.577-7.866-8s3.536-8 7.866-8c2.46 0 4.105 1.025 5.047 1.926l3.256-3.133C18.332 1.157 15.532 0 12.24 0c-6.63 0-12 5.37-12 12s5.37 12 12 12c6.923 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z"
            />
          </svg>
          Sign up with Google
        </button>

        {/* Alternative Route Redirection link footer layer navigation segment */}
        <p className="text-center text-xs tracking-wide text-gray-500 dark:text-gray-400 mt-6">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-[#C5A880] font-semibold underline underline-offset-4 hover:text-[#1A1A1A] dark:hover:text-white transition"
          >
            Log in here
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
