// hooks/useProfile.ts - Using NextAuth
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

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

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // NextAuth automatically handles authentication
      const response = await fetch('/api/profile', {
        method: 'GET',
        credentials: 'include', // Important for NextAuth cookies
      });

      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }

      const data = await response.json();
      setProfile(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (profileData: UpdateProfileData) => {
    try {
      setUpdating(true);
      setError(null);

      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Important for NextAuth cookies
        body: JSON.stringify(profileData),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const updatedProfile = await response.json();
      setProfile(updatedProfile);
      return updatedProfile;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    // Only fetch when user is authenticated
    if (status === 'authenticated' && session?.user) {
      fetchProfile();
    } else if (status === 'loading') {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [status, session]);

  return {
    profile,
    loading: loading || status === 'loading',
    updating,
    error,
    updateProfile,
    refetchProfile: fetchProfile,
    // NextAuth session data
    session,
    isAuthenticated: status === 'authenticated',
  };
};