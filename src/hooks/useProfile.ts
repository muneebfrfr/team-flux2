import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";

interface ProfileData {
  id: string;
  name: string;
  email: string;
  phoneNumber: string | null;
  address: string | null;
}

interface UpdateProfileData {
  name: string;
  phoneNumber: string;
  address: string;
}

export const useProfile = () => {
  const { data: session, status } = useSession();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Memoized fetch function to prevent unnecessary recreations
  const fetchProfile = useCallback(async () => {
    try {
      // Skip if already loading or unauthenticated
      if (loading || status !== "authenticated") return;

      setLoading(true);
      setError(null);

      const response = await fetch("/api/profile", {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch profile");
      }

      const data = await response.json();
      setProfile(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Profile fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [status, loading]);

  const updateProfile = async (profileData: UpdateProfileData) => {
    try {
      setUpdating(true);
      setError(null);

      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(profileData),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      const updatedProfile = await response.json();
      setProfile(updatedProfile);
      return updatedProfile;
    } catch (err) {
      const message = err instanceof Error ? err.message : "An error occurred";
      setError(message);
      console.error("Profile update error:", err);
      throw new Error(message);
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    // Only fetch when authenticated and no existing profile data
    if (status === "authenticated" && !profile) {
      fetchProfile();
    }
  }, [status, profile, fetchProfile]);

  // Debugging effect - remove in production
  useEffect(() => {
    console.log("Profile state changed:", {
      loading,
      updating,
      profile,
      error,
      sessionStatus: status,
    });
  }, [loading, updating, profile, error, status]);

  return {
    profile,
    loading: loading || status === "loading",
    updating,
    error,
    updateProfile,
    refetchProfile: fetchProfile,
    session,
    isAuthenticated: status === "authenticated",
  };
};
