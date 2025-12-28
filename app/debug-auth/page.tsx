"use client";

import { useAuth, useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";

export default function DebugAuthPage() {
  const { isLoaded: authLoaded, isSignedIn, userId, sessionId } = useAuth();
  const { isLoaded: userLoaded, user } = useUser();
  const [sessionData, setSessionData] = useState<any>(null);
  const [sessionError, setSessionError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch session data from API
    fetch("/api/auth/session")
      .then((res) => res.json())
      .then((data) => setSessionData(data))
      .catch((err) => setSessionError(err.message));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Authentication Debug Page</h1>

        {/* Client-side Auth State */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Client-side Auth State (useAuth)</h2>
          <div className="space-y-2 font-mono text-sm">
            <div>
              <span className="font-bold">Auth Loaded:</span>{" "}
              <span className={authLoaded ? "text-green-600" : "text-red-600"}>
                {authLoaded ? "✅ Yes" : "❌ No"}
              </span>
            </div>
            <div>
              <span className="font-bold">Is Signed In:</span>{" "}
              <span className={isSignedIn ? "text-green-600" : "text-red-600"}>
                {isSignedIn ? "✅ Yes" : "❌ No"}
              </span>
            </div>
            <div>
              <span className="font-bold">User ID:</span>{" "}
              <span className={userId ? "text-green-600" : "text-gray-400"}>
                {userId || "null"}
              </span>
            </div>
            <div>
              <span className="font-bold">Session ID:</span>{" "}
              <span className={sessionId ? "text-green-600" : "text-gray-400"}>
                {sessionId || "null"}
              </span>
            </div>
          </div>
        </div>

        {/* Client-side User State */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Client-side User State (useUser)</h2>
          <div className="space-y-2 font-mono text-sm">
            <div>
              <span className="font-bold">User Loaded:</span>{" "}
              <span className={userLoaded ? "text-green-600" : "text-red-600"}>
                {userLoaded ? "✅ Yes" : "❌ No"}
              </span>
            </div>
            {user && (
              <>
                <div>
                  <span className="font-bold">User ID:</span> {user.id}
                </div>
                <div>
                  <span className="font-bold">First Name:</span> {user.firstName}
                </div>
                <div>
                  <span className="font-bold">Last Name:</span> {user.lastName}
                </div>
                <div>
                  <span className="font-bold">Email:</span>{" "}
                  {user.emailAddresses?.[0]?.emailAddress}
                </div>
                <div>
                  <span className="font-bold">Username:</span> {user.username || "null"}
                </div>
              </>
            )}
            {!user && userLoaded && (
              <div className="text-gray-400">No user data available</div>
            )}
          </div>
        </div>

        {/* Server-side Session State */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">
            Server-side Session State (API)
          </h2>
          {sessionError && (
            <div className="text-red-600 mb-4">Error: {sessionError}</div>
          )}
          {sessionData && (
            <div className="space-y-2 font-mono text-sm">
              <div>
                <span className="font-bold">Authenticated:</span>{" "}
                <span
                  className={
                    sessionData.authenticated ? "text-green-600" : "text-red-600"
                  }
                >
                  {sessionData.authenticated ? "✅ Yes" : "❌ No"}
                </span>
              </div>
              <div>
                <span className="font-bold">User ID:</span>{" "}
                <span
                  className={
                    sessionData.userId ? "text-green-600" : "text-gray-400"
                  }
                >
                  {sessionData.userId || "null"}
                </span>
              </div>
              <div>
                <span className="font-bold">Session ID:</span>{" "}
                <span
                  className={
                    sessionData.sessionId ? "text-green-600" : "text-gray-400"
                  }
                >
                  {sessionData.sessionId || "null"}
                </span>
              </div>
              {sessionData.user && (
                <>
                  <div className="mt-4 font-bold">User Details:</div>
                  <pre className="bg-gray-100 p-4 rounded overflow-auto">
                    {JSON.stringify(sessionData.user, null, 2)}
                  </pre>
                </>
              )}
            </div>
          )}
          {!sessionData && !sessionError && (
            <div className="text-gray-400">Loading...</div>
          )}
        </div>

        {/* Environment Variables */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Environment Variables</h2>
          <div className="space-y-2 font-mono text-sm">
            <div>
              <span className="font-bold">Publishable Key:</span>{" "}
              <span
                className={
                  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
                    ? "text-green-600"
                    : "text-red-600"
                }
              >
                {process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
                  ? "✅ Set"
                  : "❌ Not Set"}
              </span>
            </div>
            {process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && (
              <div className="text-xs text-gray-500">
                {process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.substring(0, 20)}
                ...
              </div>
            )}
          </div>
        </div>

        {/* Cookies */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Cookies</h2>
          <div className="space-y-2 font-mono text-sm">
            <div>
              <span className="font-bold">All Cookies:</span>
            </div>
            <pre className="bg-gray-100 p-4 rounded overflow-auto text-xs">
              {document.cookie || "No cookies found"}
            </pre>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Actions</h2>
          <div className="space-x-4">
            <a
              href="/sign-in"
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Go to Sign In
            </a>
            <a
              href="/sign-up"
              className="inline-block px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Go to Sign Up
            </a>
            <button
              onClick={() => window.location.reload()}
              className="inline-block px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              Refresh Page
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}




