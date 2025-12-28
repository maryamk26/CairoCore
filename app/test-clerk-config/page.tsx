export default function TestClerkConfig() {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const hasSecretKey = !!process.env.CLERK_SECRET_KEY;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Clerk Configuration Test</h1>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Environment Variables</h2>
          
          <div className="space-y-4">
            <div>
              <div className="font-bold mb-2">NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:</div>
              {publishableKey ? (
                <div>
                  <div className="text-green-600 mb-2">✅ Set</div>
                  <div className="font-mono text-xs bg-gray-100 p-2 rounded break-all">
                    {publishableKey}
                  </div>
                  <div className="mt-2 text-sm">
                    <span className="font-semibold">Type: </span>
                    {publishableKey.startsWith("pk_test_") ? (
                      <span className="text-blue-600">Test Key</span>
                    ) : publishableKey.startsWith("pk_live_") ? (
                      <span className="text-green-600">Live Key</span>
                    ) : (
                      <span className="text-red-600">Unknown Key Type</span>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-red-600">❌ Not Set</div>
              )}
            </div>

            <div>
              <div className="font-bold mb-2">CLERK_SECRET_KEY:</div>
              {hasSecretKey ? (
                <div className="text-green-600">✅ Set (hidden for security)</div>
              ) : (
                <div className="text-red-600">❌ Not Set</div>
              )}
            </div>

            <div>
              <div className="font-bold mb-2">NEXT_PUBLIC_CLERK_SIGN_IN_URL:</div>
              <div className="font-mono text-sm">
                {process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL || "Not Set"}
              </div>
            </div>

            <div>
              <div className="font-bold mb-2">NEXT_PUBLIC_CLERK_SIGN_UP_URL:</div>
              <div className="font-mono text-sm">
                {process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL || "Not Set"}
              </div>
            </div>

            <div>
              <div className="font-bold mb-2">NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL:</div>
              <div className="font-mono text-sm">
                {process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL || "Not Set"}
              </div>
            </div>

            <div>
              <div className="font-bold mb-2">NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL:</div>
              <div className="font-mono text-sm">
                {process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL || "Not Set"}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Configuration Status</h2>
          
          {publishableKey && hasSecretKey ? (
            <div className="text-green-600 text-lg">
              ✅ Clerk is properly configured!
            </div>
          ) : (
            <div>
              <div className="text-red-600 text-lg mb-4">
                ❌ Clerk configuration is incomplete
              </div>
              <div className="text-sm space-y-2">
                <p>Please ensure you have a `.env.local` file with:</p>
                <pre className="bg-gray-100 p-4 rounded text-xs">
{`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL="/"
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL="/"`}
                </pre>
                <p className="text-red-600 font-semibold mt-4">
                  ⚠️ After adding/updating environment variables, restart your dev server!
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 space-x-4">
          <a
            href="/debug-auth"
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Go to Auth Debug Page
          </a>
          <a
            href="/sign-in"
            className="inline-block px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Go to Sign In
          </a>
        </div>
      </div>
    </div>
  );
}




