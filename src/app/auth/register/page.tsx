"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";

type FormState = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  country: string;
  additionalInfo: string;
  password: string;
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
};

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(initialForm);
  const [photo, setPhoto] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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
      setError("Email address is required. It will be used as your user ID.");
      return;
    }

    if (form.password.length < 8) {
      setError("Password must be at least 8 characters long.");
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
        return;
      }

      setSuccess("Registration complete. Signing you in...");

      const signInResult = await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
      });

      if (signInResult?.ok) {
        router.push("/");
        router.refresh();
        return;
      }

      router.push("/auth/signin");
    } catch (err) {
      console.error(err);
      setError("Something went wrong while creating your account.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-zinc-50 px-4 py-10 text-zinc-950">
      <section className="mx-auto w-full max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold">Register User</h1>
          <p className="mt-2 text-sm text-zinc-600">
            Your email address will be used as your user ID for login.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-lg border border-zinc-200 bg-white p-6 shadow-sm"
        >
          <div className="flex flex-col items-center gap-3 border-b border-zinc-200 pb-6">
            <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-zinc-900 text-4xl font-semibold text-white">
              {photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={photo} alt="Profile preview" className="h-full w-full object-cover" />
              ) : (
                fallbackInitial
              )}
            </div>
            <label className="cursor-pointer rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium transition hover:bg-zinc-100">
              Upload Photo
              <input
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={handlePhotoChange}
                disabled={loading}
              />
            </label>
          </div>

          {error && (
            <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}
          {success && (
            <div className="rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
              {success}
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-2 text-sm font-medium">
              First Name
              <input
                required
                value={form.firstName}
                onChange={(event) => updateField("firstName", event.target.value)}
                className="w-full rounded-md border border-zinc-300 px-3 py-2 outline-none focus:border-zinc-900"
                disabled={loading}
              />
            </label>
            <label className="space-y-2 text-sm font-medium">
              Last Name
              <input
                required
                value={form.lastName}
                onChange={(event) => updateField("lastName", event.target.value)}
                className="w-full rounded-md border border-zinc-300 px-3 py-2 outline-none focus:border-zinc-900"
                disabled={loading}
              />
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-2 text-sm font-medium">
              Email Address
              <input
                required
                type="email"
                value={form.email}
                onChange={(event) => updateField("email", event.target.value)}
                placeholder="user@example.com"
                className="w-full rounded-md border border-zinc-300 px-3 py-2 outline-none focus:border-zinc-900"
                disabled={loading}
              />
            </label>
            <label className="space-y-2 text-sm font-medium">
              Phone Number
              <input
                type="tel"
                value={form.phone}
                onChange={(event) => updateField("phone", event.target.value)}
                className="w-full rounded-md border border-zinc-300 px-3 py-2 outline-none focus:border-zinc-900"
                disabled={loading}
              />
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-2 text-sm font-medium">
              City
              <input
                value={form.city}
                onChange={(event) => updateField("city", event.target.value)}
                className="w-full rounded-md border border-zinc-300 px-3 py-2 outline-none focus:border-zinc-900"
                disabled={loading}
              />
            </label>
            <label className="space-y-2 text-sm font-medium">
              Country
              <input
                value={form.country}
                onChange={(event) => updateField("country", event.target.value)}
                className="w-full rounded-md border border-zinc-300 px-3 py-2 outline-none focus:border-zinc-900"
                disabled={loading}
              />
            </label>
          </div>

          <label className="space-y-2 text-sm font-medium">
            Additional Info
            <textarea
              value={form.additionalInfo}
              onChange={(event) => updateField("additionalInfo", event.target.value)}
              rows={4}
              className="w-full resize-none rounded-md border border-zinc-300 px-3 py-2 outline-none focus:border-zinc-900"
              disabled={loading}
            />
          </label>

          <label className="space-y-2 text-sm font-medium">
            Password
            <input
              required
              type="password"
              value={form.password}
              onChange={(event) => updateField("password", event.target.value)}
              className="w-full rounded-md border border-zinc-300 px-3 py-2 outline-none focus:border-zinc-900"
              disabled={loading}
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-zinc-950 px-4 py-3 font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-400"
          >
            {loading ? "Registering..." : "Register User"}
          </button>

          <p className="text-center text-sm text-zinc-600">
            Already registered?{" "}
            <Link href="/auth/signin" className="font-medium text-zinc-950 underline">
              Sign in
            </Link>
          </p>
        </form>
      </section>
    </main>
  );
}
