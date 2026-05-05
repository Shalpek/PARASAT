import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import type { UserProfile, UserProfileInput, UserRole } from "../types";

const usersCollection = "users";

const mockUsers = new Map<string, UserProfile>();

const delay = <T>(value: T) =>
  new Promise<T>((resolve) => {
    globalThis.setTimeout(() => resolve(value), 120);
  });

const formatDate = (value: unknown): string => {
  if (!value) {
    return new Date().toISOString().slice(0, 10);
  }

  if (typeof value === "string") {
    return value;
  }

  if (
    typeof value === "object" &&
    value !== null &&
    "toDate" in value &&
    typeof value.toDate === "function"
  ) {
    return value.toDate().toISOString().slice(0, 10);
  }

  return String(value);
};

const mapUserProfile = (uid: string, data: Record<string, unknown>): UserProfile => ({
  uid: String(data.uid ?? uid),
  email: String(data.email ?? ""),
  role: (data.role ?? "customer") as UserRole,
  fullName: String(data.fullName ?? ""),
  phone: String(data.phone ?? ""),
  city: String(data.city ?? ""),
  companyName: String(data.companyName ?? ""),
  address: String(data.address ?? ""),
  createdAt: formatDate(data.createdAt),
  updatedAt: formatDate(data.updatedAt),
});

const copyProfile = (profile: UserProfile): UserProfile => ({ ...profile });

export const userService = {
  async getUserProfile(uid: string): Promise<UserProfile | null> {
    if (!db) {
      const profile = mockUsers.get(uid);
      return delay(profile ? copyProfile(profile) : null);
    }

    const snapshot = await getDoc(doc(db, usersCollection, uid));
    return snapshot.exists() ? mapUserProfile(uid, snapshot.data()) : null;
  },

  async createUserProfile(
    uid: string,
    email: string,
    input: UserProfileInput,
    role: UserRole = "customer",
  ): Promise<UserProfile> {
    const now = new Date().toISOString().slice(0, 10);
    const profile: UserProfile = {
      uid,
      email,
      role,
      ...input,
      createdAt: now,
      updatedAt: now,
    };

    if (!db) {
      mockUsers.set(uid, profile);
      return delay(copyProfile(profile));
    }

    await setDoc(doc(db, usersCollection, uid), {
      uid,
      email,
      role,
      ...input,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return profile;
  },

  async createMinimalCustomerProfile(uid: string, email: string): Promise<UserProfile> {
    return this.createUserProfile(uid, email, {
      fullName: "",
      phone: "",
      city: "",
      companyName: "",
      address: "",
    });
  },

  async updateUserProfile(uid: string, input: UserProfileInput): Promise<UserProfile> {
    const current = await this.getUserProfile(uid);

    if (!current) {
      throw new Error("Профиль пользователя не найден.");
    }

    const updatedProfile: UserProfile = {
      ...current,
      ...input,
      updatedAt: new Date().toISOString().slice(0, 10),
    };

    if (!db) {
      mockUsers.set(uid, updatedProfile);
      return delay(copyProfile(updatedProfile));
    }

    await updateDoc(doc(db, usersCollection, uid), {
      ...input,
      updatedAt: serverTimestamp(),
    });

    return updatedProfile;
  },
};
