"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState, useRef } from "react";
import { motion } from "framer-motion";
import { Camera, Edit2, Lock, Mail, MapPin, Phone, User } from "lucide-react";

type FormState = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  country: string;
  additionalInfo: string;
  password: string;
  confirmPassword: string;
};

const initialForm: FormState = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  city: "",
  country: "",
  additionalInfo: "",
  password: "",
  confirmPassword: "",
};

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(initialForm);
  const [photo, setPhoto] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fallbackInitial = useMemo(() => {
    return (form.firstName.trim()[0] || form.email.trim()[0] || "U").toUpperCase();
  }, [form.email, form.firstName]);

  function updateField(field: keyof FormState, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function handlePhotoChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    setError(null);

    if (!file) {
      setPhoto(null);
      return;
    }

    if (!file.type.startsWith("image/")) {
      setPhoto(null);
      setError("Please upload an image file for the profile photo.");
      return;
    }

    if (file.size > 1_000_000) {
      setPhoto(null);
      setError("Profile photo must be under 1 MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => setPhoto(reader.result as string);
    reader.onerror = () => setError("Could not read the selected photo.");
    reader.readAsDataURL(file);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (!form.firstName.trim() || !form.lastName.trim()) {
      setError("First name and last name are required.");
      return;
    }

    if (!form.email.trim()) {
      setError("Email address is required.");
      return;
    }

    if (form.password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }
    
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, image: photo }),
      });

      const result = (await response.json()) as { ok?: boolean; error?: string };

      if (!response.ok) {
        setError(result.error || "Registration failed. Please try again.");
        setLoading(false);
        return;
      }

      setSuccess("Account created successfully! Signing you in...");

      const signInResult = await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
      });

      if (signInResult?.ok) {
        router.push("/dashboard");
        router.refresh();
        return;
      }

      router.push("/auth/signin");
    } catch (err) {
      console.error(err);
      setError("Something went wrong while creating your account.");
      setLoading(false);
    }
  }

  const inputClass = (isError: boolean) => 
    `w-full rounded-xl border ${isError ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : 'border-[#E5E7EB] focus:border-[#2563EB] focus:ring-[#2563EB]/20'} bg-white py-2.5 px-4 text-[#111827] placeholder:text-slate-400 focus:outline-none focus:ring-4 transition-all duration-200`;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-xl mx-auto rounded-2xl bg-white/85 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.08)] backdrop-blur-xl border border-white/40 my-8 lg:my-0"
    >
      {/* Toggle */}
      <div className="mb-8 flex w-full rounded-xl bg-slate-100 p-1">
        <Link
          href="/auth/signin"
          className="flex w-1/2 items-center justify-center rounded-lg py-2.5 text-sm font-medium text-slate-500 transition-colors hover:text-slate-900"
        >
          Login
        </Link>
        <div className="flex w-1/2 items-center justify-center rounded-lg bg-white py-2.5 text-sm font-semibold text-slate-900 shadow-sm">
          Sign Up
        </div>
      </div>

      <motion.form 
        onSubmit={handleSubmit} 
        className="space-y-6"
        animate={error ? { x: [-10, 10, -10, 10, 0] } : {}}
        transition={{ duration: 0.4 }}
      >
        {/* Profile Photo Upload */}
        <div className="flex flex-col items-center justify-center pb-4">
          <div 
            className="relative h-28 w-28 overflow-hidden rounded-full shadow-md group cursor-pointer border-4 border-white bg-gradient-to-br from-[#2563EB] to-[#38BDF8]"
            onClick={() => fileInputRef.current?.click()}
          >
            {photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={photo} alt="Profile" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-4xl font-bold text-white">
                {fallbackInitial}
              </div>
            )}
            
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera className="h-8 w-8 text-white" />
            </div>
            
            {photo && (
              <div className="absolute bottom-1 right-1 bg-white p-1 rounded-full shadow-sm">
                <Edit2 className="h-3 w-3 text-slate-700" />
              </div>
            )}
          </div>
          <p className="mt-3 text-sm font-medium text-[#6B7280]">
            Upload Profile Photo
          </p>
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            className="hidden"
            onChange={handlePhotoChange}
            disabled={loading}
          />
        </div>

        {error && (
          <div className="rounded-xl border border-red-200/50 bg-red-50/50 p-4 text-sm text-red-600 flex items-start">
            {error}
          </div>
        )}
        
        {success && (
          <div className="rounded-xl border border-green-200/50 bg-green-50/50 p-4 text-sm text-green-600 flex items-start">
            {success}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-[#111827]">First Name</label>
            <input
              required
              placeholder="John"
              value={form.firstName}
              onChange={(e) => updateField("firstName", e.target.value)}
              className={inputClass(!!error && !form.firstName)}
              disabled={loading}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-[#111827]">Last Name</label>
            <input
              required
              placeholder="Doe"
              value={form.lastName}
              onChange={(e) => updateField("lastName", e.target.value)}
              className={inputClass(!!error && !form.lastName)}
              disabled={loading}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-[#111827]">Email Address</label>
          <input
            required
            type="email"
            placeholder="john@example.com"
            value={form.email}
            onChange={(e) => updateField("email", e.target.value)}
            className={inputClass(!!error && !form.email)}
            disabled={loading}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-[#111827]">City</label>
            <input
              placeholder="New York"
              value={form.city}
              onChange={(e) => updateField("city", e.target.value)}
              className={inputClass(false)}
              disabled={loading}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-[#111827]">Country</label>
            <input
              placeholder="United States"
              value={form.country}
              onChange={(e) => updateField("country", e.target.value)}
              className={inputClass(false)}
              disabled={loading}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-[#111827]">Phone Number</label>
          <input
            type="tel"
            placeholder="+1 (555) 000-0000"
            value={form.phone}
            onChange={(e) => updateField("phone", e.target.value)}
            className={inputClass(false)}
            disabled={loading}
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-[#111827]">Additional Info</label>
          <textarea
            rows={2}
            placeholder="Tell us a bit about your travel preferences..."
            value={form.additionalInfo}
            onChange={(e) => updateField("additionalInfo", e.target.value)}
            className={`${inputClass(false)} resize-none`}
            disabled={loading}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-[#111827]">Password</label>
            <input
              required
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => updateField("password", e.target.value)}
              className={inputClass(!!error && form.password.length < 8)}
              disabled={loading}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-[#111827]">Confirm Password</label>
            <input
              required
              type="password"
              placeholder="••••••••"
              value={form.confirmPassword}
              onChange={(e) => updateField("confirmPassword", e.target.value)}
              className={inputClass(!!error && form.password !== form.confirmPassword)}
              disabled={loading}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="relative flex w-full justify-center items-center rounded-xl bg-[#2563EB] py-3.5 text-sm font-bold text-white shadow-lg shadow-[#2563EB]/30 transition-all hover:bg-[#2563EB]/90 hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0 disabled:cursor-not-allowed overflow-hidden group mt-8"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              Creating Account...
            </span>
          ) : (
            <span className="relative z-10">Create Account</span>
          )}
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
        </button>
      </motion.form>
      
    </motion.div>
  );
}
