"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Bell, Camera, Globe, Lock, Moon, Save, Shield, Trash2, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { toast } from "sonner";
import { type DashboardUser } from "@/data/mock-dashboard";

type SettingsPageProps = {
  user: DashboardUser;
};

export function SettingsPage({ user }: SettingsPageProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photoUrl, setPhotoUrl] = useState(user.image || "");
  const [photoSaving, setPhotoSaving] = useState(false);
  const [profile, setProfile] = useState({
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    email: user.email || "",
    phone: user.phone || "",
    city: user.city || "",
    country: user.country || "",
    bio: user.additionalInfo || "",
  });
  const [saving, setSaving] = useState(false);

  function updateProfile(field: string, value: string) {
    setProfile((prev) => ({ ...prev, [field]: value }));
  }

  function initials() {
    const source = `${profile.firstName} ${profile.lastName}`.trim() || profile.email || "U";
    return source
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("");
  }

  async function updateProfilePhoto(image: string | null) {
    const response = await fetch("/api/auth/me", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image }),
    });
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.error ?? "Could not update profile photo");
    }
  }

  async function handlePhotoChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setPhotoSaving(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "profiles");

      const uploadResponse = await fetch("/api/uploads", {
        method: "POST",
        body: formData,
      });
      const upload = await uploadResponse.json().catch(() => ({}));

      if (!uploadResponse.ok) {
        throw new Error(upload.error ?? "Could not upload photo");
      }

      await updateProfilePhoto(upload.url);
      setPhotoUrl(upload.url);
      router.refresh();
      toast.success("Profile photo updated");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not update profile photo");
    } finally {
      setPhotoSaving(false);
      event.target.value = "";
    }
  }

  async function handlePhotoRemove() {
    if (!photoUrl) return;

    setPhotoSaving(true);
    try {
      await updateProfilePhoto(null);
      setPhotoUrl("");
      router.refresh();
      toast.success("Profile photo removed");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not remove profile photo");
    } finally {
      setPhotoSaving(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    try {
      const response = await fetch("/api/auth/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
          firstName: profile.firstName,
          lastName: profile.lastName,
          phone: profile.phone,
          city: profile.city,
          country: profile.country,
          additionalInfo: profile.bio,
          image: photoUrl || null,
          preferredCurrency: "INR",
        }),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error ?? "Could not update profile");
      }

      toast.success("Profile updated successfully");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not update profile");
    } finally {
      setSaving(false);
    }
  }

  const sections = [
    {
      id: "profile",
      title: "Profile",
      icon: User,
      description: "Manage your personal information",
    },
    {
      id: "security",
      title: "Security",
      icon: Lock,
      description: "Password and authentication",
    },
    {
      id: "notifications",
      title: "Notifications",
      icon: Bell,
      description: "Email and push notification preferences",
    },
    {
      id: "preferences",
      title: "Preferences",
      icon: Globe,
      description: "Language, timezone, and display settings",
    },
  ];

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your account preferences
        </p>
      </div>

      {/* Profile Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Profile Picture</CardTitle>
            <CardDescription>Update your profile photo</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              <Avatar className="h-24 w-24 border border-slate-200">
                {photoUrl ? <AvatarImage src={photoUrl} alt={profile.firstName || "Profile photo"} /> : null}
                <AvatarFallback className="text-xl font-semibold">{initials()}</AvatarFallback>
              </Avatar>

              <div className="flex flex-wrap gap-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoChange}
                />
                <Button
                  type="button"
                  variant="outline"
                  disabled={photoSaving}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Camera className="mr-2 h-4 w-4" />
                  {photoSaving ? "Uploading..." : "Change Photo"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  disabled={photoSaving || !photoUrl}
                  onClick={handlePhotoRemove}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Remove
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100">
                <User className="h-5 w-5 text-emerald-700" />
              </div>
              <div>
                <h2 className="font-semibold text-lg">Profile Information</h2>
                <p className="text-sm text-muted-foreground">
                  Update your personal details
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label>First Name</Label>
                <Input
                  value={profile.firstName}
                  onChange={(e) => updateProfile("firstName", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Last Name</Label>
                <Input
                  value={profile.lastName}
                  onChange={(e) => updateProfile("lastName", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={profile.email}
                  onChange={(e) => updateProfile("email", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input
                  value={profile.phone}
                  onChange={(e) => updateProfile("phone", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>City</Label>
                <Input
                  value={profile.city}
                  onChange={(e) => updateProfile("city", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Country</Label>
                <Input
                  value={profile.country}
                  onChange={(e) => updateProfile("country", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Bio / Additional Info</Label>
              <Textarea
                value={profile.bio}
                onChange={(e) => updateProfile("bio", e.target.value)}
                rows={3}
                placeholder="Tell us about your travel style..."
              />
            </div>

            <div className="flex justify-end">
              <Button onClick={handleSave} disabled={saving}>
                {saving ? (
                  <span className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Saving...
                  </span>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" /> Save Changes
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Security Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardContent className="p-6 space-y-5">
            <div className="flex items-center gap-3 pb-4 border-b">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100">
                <Shield className="h-5 w-5 text-orange-700" />
              </div>
              <div>
                <h2 className="font-semibold text-lg">Security</h2>
                <p className="text-sm text-muted-foreground">
                  Manage password and authentication
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label>Current Password</Label>
                <Input type="password" placeholder="••••••••" />
              </div>
              <div className="space-y-2">
                <Label>New Password</Label>
                <Input type="password" placeholder="••••••••" />
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                variant="outline"
                onClick={() => toast.info("Password change coming soon")}
              >
                <Lock className="h-4 w-4 mr-2" /> Update Password
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Notifications & Preferences */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardContent className="p-6 space-y-5">
            <div className="flex items-center gap-3 pb-4 border-b">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100">
                <Bell className="h-5 w-5 text-blue-700" />
              </div>
              <div>
                <h2 className="font-semibold text-lg">Notifications</h2>
                <p className="text-sm text-muted-foreground">
                  Manage how you receive updates
                </p>
              </div>
            </div>
            {[
              { label: "Email notifications", desc: "Get trip updates via email" },
              { label: "Push notifications", desc: "Browser push notifications" },
              { label: "Trip reminders", desc: "Reminders before departure" },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between py-2">
                <div>
                  <p className="font-medium text-sm">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:ring-2 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                </label>
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
