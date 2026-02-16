"use client";

import { useAuth, useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";

// --- Custom Hook for fetching server session ---
function useServerSession() {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/auth/session")
      .then((res) => res.json())
      .then(setData)
      .catch((err) => setError(err.message));
  }, []);

  return { data, error };
}

// --- Reusable Info Card ---
function InfoCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      {children}
    </div>
  );
}

export default function DebugAuthPage() {
  const { isLoaded: authLoaded, isSignedIn, userId, sessionId } = useAuth();
  const { isLoaded: userLoaded, user } = useUser();
  const { data: sessionData, error: sessionError } = useServerSession();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 font-cinzel">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Authentication Debug Page</h1>

        <InfoCard title="Client-side Auth State (useAuth)">
          <div className="space-y-2 font-mono text-sm">
            <div>Auth Loaded: <span className={authLoaded ? "text-green-600" : "text-red-600"}>{authLoaded ? "✅ Yes" : "❌ No"}</span></div>
            <div>Is Signed In: <span className={isSignedIn ? "text-green-600" : "text-red-600"}>{isSignedIn ? "✅ Yes" : "❌ No"}</span></div>
            <div>User ID: <span className={userId ? "text-green-600" : "text-gray-400"}>{userId || "null"}</span></div>
            <div>Session ID: <span className={sessionId ? "text-green-600" : "text-gray-400"}>{sessionId || "null"}</span></div>
          </div>
        </InfoCard>

        <InfoCard title="Client-side User State (useUser)">
          {userLoaded && user ? (
            <div className="space-y-2 font-mono text-sm">
              <div>User ID: {user.id}</div>
              <div>First Name: {user.firstName}</div>
              <div>Last Name: {user.lastName}</div>
              <div>Email: {user.emailAddresses?.[0]?.emailAddress}</div>
              <div>Username: {user.username || "null"}</div>
            </div>
          ) : (
            <div className="text-gray-400">{userLoaded ? "No user data available" : "Loading..."}</div>
          )}
        </InfoCard>

        <InfoCard title="Server-side Session State (API)">
          {sessionError && <div className="text-red-600 mb-4">Error: {sessionError}</div>}
          {sessionData ? (
            <div className="space-y-2 font-mono text-sm">
              <div>Authenticated: <span className={sessionData.authenticated ? "text-green-600" : "text-red-600"}>{sessionData.authenticated ? "✅ Yes" : "❌ No"}</span></div>
              <div>User ID: <span className={sessionData.userId ? "text-green-600" : "text-gray-400"}>{sessionData.userId || "null"}</span></div>
              <div>Session ID: <span className={sessionData.sessionId ? "text-green-600" : "text-gray-400"}>{sessionData.sessionId || "null"}</span></div>
              {sessionData.user && <pre className="bg-gray-100 p-4 rounded overflow-auto">{JSON.stringify(sessionData.user, null, 2)}</pre>}
            </div>
          ) : !sessionError ? <div className="text-gray-400">Loading...</div> : null}
        </InfoCard>

        <InfoCard title="Environment Variables">
          <div className="space-y-2 font-mono text-sm">
            <div>Publishable Key: <span className={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ? "text-green-600" : "text-red-600"}>
              {process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ? "✅ Set" : "❌ Not Set"}
            </span></div>
            {process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && <div className="text-xs text-gray-500">{process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.substring(0, 20)}...</div>}
          </div>
        </InfoCard>

        <InfoCard title="Cookies">
          <pre className="bg-gray-100 p-4 rounded overflow-auto text-xs">{document.cookie || "No cookies found"}</pre>
        </InfoCard>

        <InfoCard title="Actions">
          <div className="space-x-4">
            <a href="/sign-in" className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Go to Sign In</a>
            <a href="/sign-up" className="inline-block px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Go to Sign Up</a>
            <button onClick={() => window.location.reload()} className="inline-block px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">Refresh Page</button>
          </div>
        </InfoCard>
      </div>
    </div>
  );
}


