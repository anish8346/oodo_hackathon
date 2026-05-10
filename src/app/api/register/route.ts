import { hash } from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type RegisterBody = {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  city?: string;
  country?: string;
  additionalInfo?: string;
  password?: string;
  image?: string | null;
};

function clean(value?: string) {
  return value?.trim() ?? "";
}

function optional(value?: string) {
  const trimmed = clean(value);
  return trimmed.length > 0 ? trimmed : null;
}

function createInitialAvatar(firstName: string) {
  const initial = (firstName.trim()[0] || "U").toUpperCase();
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160"><rect width="160" height="160" rx="80" fill="#18181b"/><text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="72" font-weight="700" fill="#ffffff">${initial}</text></svg>`;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as RegisterBody;
    const firstName = clean(body.firstName);
    const lastName = clean(body.lastName);
    const email = clean(body.email).toLowerCase();
    const password = body.password ?? "";
    const uploadedImage = optional(body.image ?? undefined);

    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json(
        { error: "First name, last name, email address, and password are required." },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters long." },
        { status: 400 }
      );
    }

    if (uploadedImage && !uploadedImage.startsWith("data:image/")) {
      return NextResponse.json(
        { error: "Uploaded photo must be an image file." },
        { status: 400 }
      );
    }

    if (uploadedImage && uploadedImage.length > 1_500_000) {
      return NextResponse.json(
        { error: "Uploaded photo is too large. Please choose an image under 1 MB." },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "A user with this email address already exists." },
        { status: 409 }
      );
    }

    const fullName = `${firstName} ${lastName}`.trim();
    const hashedPassword = await hash(password, 12);

    await prisma.user.create({
      data: {
        firstName,
        lastName,
        name: fullName,
        email,
        phone: optional(body.phone),
        city: optional(body.city),
        country: optional(body.country),
        additionalInfo: optional(body.additionalInfo),
        image: uploadedImage ?? createInitialAvatar(firstName),
        password: hashedPassword,
        emailVerified: new Date(),
      },
    });

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    console.error("Registration failed", error);

    return NextResponse.json(
      { error: "Registration failed. Please try again." },
      { status: 500 }
    );
  }
}
