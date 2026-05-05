import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from "firebase/auth";
import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { auth } from "../firebase/firebase";
import { userService } from "../services/userService";
import type { UserProfile, UserProfileInput } from "../types";

type LoginOptions = {
  createMissingProfile?: boolean;
};

type AuthContextValue = {
  user: User | null;
  profile: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string, options?: LoginOptions) => Promise<UserProfile | null>;
  register: (
    email: string,
    password: string,
    input: UserProfileInput,
  ) => Promise<UserProfile>;
  updateProfile: (input: UserProfileInput) => Promise<UserProfile>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      setUser(null);
      setProfile(null);
      setIsLoading(false);
      return;
    }

    return onAuthStateChanged(auth, async (currentUser) => {
      setIsLoading(true);
      setUser(currentUser);

      if (!currentUser) {
        setProfile(null);
        setIsLoading(false);
        return;
      }

      try {
        setProfile(await userService.getUserProfile(currentUser.uid));
      } catch {
        setProfile(null);
      } finally {
        setIsLoading(false);
      }
    });
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      profile,
      isLoading,
      isAuthenticated: Boolean(user),
      isAdmin: profile?.role === "admin",
      async login(email, password, options = {}) {
        if (!auth) {
          throw new Error("Firebase не настроен. Заполните .env перед входом.");
        }

        const credentials = await signInWithEmailAndPassword(auth, email, password);
        setUser(credentials.user);

        let loadedProfile = await userService.getUserProfile(credentials.user.uid);

        if (!loadedProfile && options.createMissingProfile !== false) {
          loadedProfile = await userService.createMinimalCustomerProfile(
            credentials.user.uid,
            credentials.user.email ?? email,
          );
        }

        setProfile(loadedProfile);
        return loadedProfile;
      },
      async register(email, password, input) {
        if (!auth) {
          throw new Error("Firebase не настроен. Заполните .env перед регистрацией.");
        }

        const credentials = await createUserWithEmailAndPassword(auth, email, password);
        const createdProfile = await userService.createUserProfile(
          credentials.user.uid,
          credentials.user.email ?? email,
          input,
        );

        setUser(credentials.user);
        setProfile(createdProfile);
        return createdProfile;
      },
      async updateProfile(input) {
        if (!user) {
          throw new Error("Нужно войти в аккаунт.");
        }

        const updatedProfile = profile
          ? await userService.updateUserProfile(user.uid, input)
          : await userService.createUserProfile(user.uid, user.email ?? "", input);
        setProfile(updatedProfile);
        return updatedProfile;
      },
      async logout() {
        if (auth) {
          await signOut(auth);
        }
        setUser(null);
        setProfile(null);
      },
    }),
    [isLoading, profile, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
