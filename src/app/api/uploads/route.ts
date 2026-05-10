import { NextRequest, NextResponse } from "next/server";
import { jsonError, requireUser, savePublicUpload } from "@/lib/traveloop";

export async function POST(request: NextRequest) {
  const user = await requireUser();
  if (!user) return jsonError("Unauthorized", 401);
  const formData = await request.formData();
  const file = formData.get("file");
  const folder = String(formData.get("folder") ?? "traveloop");
  if (!(file instanceof File)) return jsonError("Missing image file");
  try {
    const url = await savePublicUpload(file, folder);
    return NextResponse.json({ url });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Upload failed", 400);
  }
}
