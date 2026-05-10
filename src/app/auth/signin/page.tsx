import { Suspense } from "react";
import { redirect } from "next/navigation";
import { SignInForm } from "@/components/auth/sign-in-form";
import { getCurrentUser } from "@/lib/auth";

export default async function SignInPage() {
  const user = await getCurrentUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <Suspense fallback={
      <div className="flex h-full w-full items-center justify-center p-10">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#E5E7EB] border-t-[#2563EB]"></div>
      </div>
    }>
      <SignInForm />
    </Suspense>
  );
}
