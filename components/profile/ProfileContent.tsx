"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/lib/hooks/useAuth";
import ProfileHeader, { type ProfileData } from "./ProfileHeader";
import ProfileSwitch from "./ProfileSwitch";
import CreatedGrid, { type PlaceItem } from "./CreatedGrid";
import SavedGrid, { type FolderItem } from "./SavedGrid";

export default function ProfileContent() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [places, setPlaces] = useState<PlaceItem[]>([]);
  const [folders, setFolders] = useState<FolderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"created" | "saved">("created");

  const clearSessionAndRedirect = useCallback(async () => {
    await createClient().auth.signOut();
    router.replace("/auth");
  }, [router]);

  const fetchProfile = useCallback(async () => {
    const res = await fetch("/api/profile");
    if (res.status === 401) {
      await clearSessionAndRedirect();
      return;
    }
    if (res.ok) {
      const data = await res.json();
      setProfile({
        name: data.name,
        username: data.username,
        followerCount: data.followerCount ?? 0,
        followingCount: data.followingCount ?? 0,
      });
    }
  }, [clearSessionAndRedirect]);

  const fetchPlaces = useCallback(async () => {
    const res = await fetch("/api/profile/places");
    if (res.status === 401) {
      await clearSessionAndRedirect();
      return;
    }
    if (res.ok) {
      const data = await res.json();
      setPlaces(data.places ?? []);
    }
  }, [clearSessionAndRedirect]);

  const fetchFolders = useCallback(async () => {
    const res = await fetch("/api/profile/folders");
    if (res.status === 401) {
      await clearSessionAndRedirect();
      return;
    }
    if (res.ok) {
      const data = await res.json();
      setFolders(data.folders ?? []);
    }
  }, [clearSessionAndRedirect]);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.replace("/auth");
      return;
    }

    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        await fetchProfile();
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [user, authLoading, router, fetchProfile]);

  useEffect(() => {
    if (!user) return;
    fetchPlaces();
    fetchFolders();
  }, [user, fetchPlaces, fetchFolders]);

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafafa]">
        <div className="animate-pulse text-gray-400">Loading...</div>
      </div>
    );
  }

  if (loading && !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafafa]">
        <div className="animate-pulse text-gray-400">Loading profile...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafafa]">
        <p className="text-gray-500">Could not load profile.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <div className="max-w-4xl mx-auto px-4 pt-24 pb-12">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-gray-700 hover:text-gray-900 transition-colors"
            aria-label="Back"
          >
            <span className="text-xl font-medium">←</span>
            <span className="text-sm font-cinzel">
              Back
            </span>
          </Link>
        </div>

        <div className="mt-6">
          <ProfileHeader profile={profile} />
        </div>

        <div className="mt-10">
          <ProfileSwitch activeTab={activeTab} onSwitch={setActiveTab} />
        </div>

        <div className="mt-8 relative min-h-[320px]">
          <div
            className={`transition-all duration-300 ease-in-out ${
              activeTab === "created"
                ? "opacity-100 translate-x-0"
                : "opacity-0 absolute inset-0 translate-x-[-20px] pointer-events-none"
            }`}
          >
            <CreatedGrid places={places} />
          </div>

          <div
            className={`transition-all duration-300 ease-in-out ${
              activeTab === "saved"
                ? "opacity-100 translate-x-0"
                : "opacity-0 absolute inset-0 translate-x-[20px] pointer-events-none"
            }`}
          >
            <SavedGrid folders={folders} onFolderCreated={fetchFolders} />
          </div>
        </div>
      </div>
    </div>
  );
}
