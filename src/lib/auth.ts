import { cookies } from "next/headers";
import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { prisma } from "@/lib/prisma";

export const SESSION_COOKIE = "eat_health_user";

export type CurrentUser = {
  id: string;
  email: string;
  name: string | null;
};

const PASSWORD_SEPARATOR = ":";

function getSessionSecret() {
  const secret = process.env.SESSION_SECRET;

  if (!secret && process.env.NODE_ENV === "production") {
    throw new Error("SESSION_SECRET is required in production");
  }

  return secret || "eat-health-local-dev-secret";
}

function signUserId(userId: string) {
  return createHmac("sha256", getSessionSecret()).update(userId).digest("hex");
}

export function createSessionCookieValue(userId: string) {
  return `${userId}.${signUserId(userId)}`;
}

function decodeSession(value: string | undefined) {
  if (!value) {
    return null;
  }

  const [userId, signature] = value.split(".");
  if (!userId || !signature) {
    return null;
  }

  const expected = signUserId(userId);
  const expectedBuffer = Buffer.from(expected);
  const signatureBuffer = Buffer.from(signature);

  if (expectedBuffer.length !== signatureBuffer.length) {
    return null;
  }

  return timingSafeEqual(expectedBuffer, signatureBuffer) ? userId : null;
}

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}${PASSWORD_SEPARATOR}${hash}`;
}

export function verifyPassword(password: string, storedHash: string | null | undefined) {
  if (!storedHash) {
    return false;
  }

  const [salt, hash] = storedHash.split(PASSWORD_SEPARATOR);
  if (!salt || !hash) {
    return false;
  }

  const incomingHash = scryptSync(password, salt, 64);
  const storedHashBuffer = Buffer.from(hash, "hex");

  return storedHashBuffer.length === incomingHash.length && timingSafeEqual(storedHashBuffer, incomingHash);
}

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const cookieStore = await cookies();
  const userId = decodeSession(cookieStore.get(SESSION_COOKIE)?.value);

  if (!userId) {
    return null;
  }

  return prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, name: true },
  });
}

export async function requireCurrentUser(): Promise<CurrentUser> {
  const user = await getCurrentUser();

  if (!user) {
    throw new Response("Unauthorized", { status: 401 });
  }

  return user;
}

export async function registerUser(email: string, password: string, name?: string | null) {
  return prisma.user.create({
    data: {
      email,
      name,
      passwordHash: hashPassword(password),
    },
    select: { id: true, email: true, name: true },
  });
}

export async function authenticateUser(email: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, email: true, name: true, passwordHash: true },
  });

  if (!user || !verifyPassword(password, user.passwordHash)) {
    return null;
  }

  return {
    id: user.id,
    email: user.email,
    name: user.name,
  };
}
