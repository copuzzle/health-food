import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import {
  SESSION_COOKIE,
  authenticateUser,
  createSessionCookieValue,
  getCurrentUser,
  registerUser,
} from "@/lib/auth";
import { sessionSchema } from "@/lib/validation";

export async function GET() {
  const user = await getCurrentUser();
  return NextResponse.json({ user });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = sessionSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid session payload" }, { status: 400 });
  }

  let user;
  if (parsed.data.mode === "register") {
    try {
      user = await registerUser(parsed.data.email, parsed.data.password, parsed.data.name);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
        return NextResponse.json({ error: "Email already registered" }, { status: 409 });
      }

      throw error;
    }
  } else {
    user = await authenticateUser(parsed.data.email, parsed.data.password);
    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }
  }

  const response = NextResponse.json({ user });
  response.cookies.set(SESSION_COOKIE, createSessionCookieValue(user.id), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 90,
    secure: process.env.NODE_ENV === "production",
  });

  return response;
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
  return NextResponse.json({ ok: true });
}
