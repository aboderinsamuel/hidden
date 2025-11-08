import { User } from "./types";
import { supabase } from "./supabase";

/**
 * Register a new user with Supabase Auth
 */
export async function registerUser(
  email: string,
  password: string,
  displayName?: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          display_name: displayName?.trim() || email.split("@")[0],
        },
      },
    });

    if (error) {
      return { ok: false, error: error.message };
    }

    if (!data.user) {
      return { ok: false, error: "Failed to create user" };
    }

    return { ok: true };
  } catch (err) {
    console.error("[auth] Registration error:", err);
    return { ok: false, error: "An unexpected error occurred" };
  }
}

/**
 * Authenticate user with email and password
 */
export async function authenticateUser(
  email: string,
  password: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      return { ok: false, error: error.message };
    }

    if (!data.user) {
      return { ok: false, error: "Invalid credentials" };
    }

    return { ok: true };
  } catch (err) {
    console.error("[auth] Login error:", err);
    return { ok: false, error: "An unexpected error occurred" };
  }
}

/**
 * Get the current authenticated user
 */
export async function getCurrentUser(): Promise<User | null> {
  try {
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();

    if (!authUser) return null;

    // Fetch user profile from database
    const { data: profile, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", authUser.id)
      .single();

    if (error || !profile) {
      console.warn("[auth] Failed to fetch user profile:", error);
      return null;
    }

    return {
      id: profile.id,
      email: profile.email,
      passwordHash: "", // Not needed with Supabase
      displayName: profile.display_name,
      createdAt: profile.created_at,
      updatedAt: profile.updated_at,
    };
  } catch (err) {
    console.error("[auth] Failed to get current user:", err);
    return null;
  }
}

/**
 * Get the current session
 */
export async function getSession() {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    return session;
  } catch (err) {
    console.error("[auth] Failed to get session:", err);
    return null;
  }
}

/**
 * Logout the current user
 */
export async function logoutUser(): Promise<void> {
  try {
    await supabase.auth.signOut();
  } catch (err) {
    console.error("[auth] Logout error:", err);
  }
}

/**
 * Delete the current user's account and all associated data
 */
export async function deleteAccount(): Promise<
  { ok: true } | { ok: false; error: string }
> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { ok: false, error: "No user logged in" };
    }

    // Delete user from Supabase Auth (RLS + CASCADE will handle prompts/tags/user row)
    const { error } = await supabase.rpc("delete_user");

    if (error) {
      console.error("[auth] Account deletion error:", error);
      return { ok: false, error: error.message };
    }

    // Sign out after deletion
    await supabase.auth.signOut();
    return { ok: true };
  } catch (err) {
    console.error("[auth] Account deletion failed:", err);
    return { ok: false, error: "Failed to delete account" };
  }
}

/**
 * Listen to auth state changes
 */
export function onAuthStateChange(
  callback: (user: User | null) => void
): () => void {
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange(async (event, session) => {
    if (session?.user) {
      const user = await getCurrentUser();
      callback(user);
    } else {
      callback(null);
    }
  });

  return () => {
    subscription.unsubscribe();
  };
}
