// hooks/useProfile.ts
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
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    try {
      if (status !== "authenticated") return; // Skip if not logged in
      setLoading(true);
      setError(null);

      const res = await fetch("/api/profile", {
        method: "GET",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch profile");

      const data = await res.json();
      setProfile(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [status]);

  const updateProfile = async (profileData: UpdateProfileData) => {
    try {
      setUpdating(true);
      setError(null);

      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(profileData),
      });
      if (!res.ok) throw new Error("Failed to update profile");

      const updatedProfile = await res.json();
      setProfile(updatedProfile);
      return updatedProfile;
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      throw err;
    } finally {
      setUpdating(false);
    }
  };

  // Fetch profile exactly once after auth is confirmed
  useEffect(() => {
    if (status === "authenticated" && profile === null) {
      fetchProfile();
    }
  }, [status, profile, fetchProfile]);

  return {
    profile,
    loading: status === "loading" || loading,
    updating,
    error,
    updateProfile,
    refetchProfile: fetchProfile,
    session,
    isAuthenticated: status === "authenticated",
  };
};

