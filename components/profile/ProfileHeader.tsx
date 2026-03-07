"use client";

import Link from "next/link";

export interface ProfileData {
  name: string;
  username: string;
  followerCount: number;
  followingCount: number;
}

interface ProfileHeaderProps {
  profile: ProfileData;
}

function ShareIcon() {
  return (
    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
  );
}

function PencilIcon() {
  return (
    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
    </svg>
  );
}

export default function ProfileHeader({ profile }: ProfileHeaderProps) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="relative w-24 h-24 rounded-full overflow-hidden bg-gray-200 shrink-0 mb-4 flex items-center justify-center">
        <span className="text-3xl font-bold text-gray-500">
          {profile.name.charAt(0).toUpperCase()}
        </span>
      </div>

      <h1 className="text-2xl font-bold text-gray-900 mb-1 font-cinzel">
        {profile.name}
      </h1>

      <p className="text-gray-600 text-sm mb-3">
        {profile.username}
      </p>

      <p className="text-sm text-gray-500 mb-4">
        {profile.followerCount} followers · {profile.followingCount} following
      </p>

      <div className="flex items-center gap-3">
        <button
          type="button"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 text-gray-800 hover:bg-gray-200 transition-colors text-sm font-medium font-cinzel"
        >
          <ShareIcon />
          Share profile
        </button>
        <Link
          href="/profile/edit"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 text-gray-800 hover:bg-gray-200 transition-colors text-sm font-medium font-cinzel"
        >
          <PencilIcon />
          Edit profile
        </Link>
      </div>
    </div>
  );
}
