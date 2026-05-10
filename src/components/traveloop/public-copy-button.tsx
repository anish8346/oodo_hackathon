"use client";

import { useRouter } from "next/navigation";
import { Copy } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function PublicCopyButton({ slug }: { slug: string }) {
  const router = useRouter();
  async function copyTrip() {
    const response = await fetch(`/api/public/${slug}/copy`, { method: "POST" });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      toast.error(data.error ?? "Sign in to copy this trip.");
      router.push("/auth/signin");
      return;
    }
    toast.success("Trip copied");
    router.push("/dashboard/trips");
  }
  return <Button onClick={copyTrip}><Copy className="mr-2 h-4 w-4" />Copy Trip</Button>;
}
