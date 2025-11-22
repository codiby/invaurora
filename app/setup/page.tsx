"use client";

import { useEffect, useState } from "react";

interface SetupStatus {
  status: "loading" | "success" | "setup_required" | "error";
  message: string;
  tableExists?: boolean;
  recordCount?: number;
  instructions?: string[];
  sql?: string;
  sqlEditorUrl?: string;
  error?: string;
}

export default function SetupPage() {
  const [setupStatus, setSetupStatus] = useState<SetupStatus>({
    status: "loading",
    message: "Checking database setup...",
  });
  const [copied, setCopied] = useState(false);

  const checkSetup = async () => {
    setSetupStatus({
      status: "loading",
      message: "Checking database setup...",
    });

    try {
      const response = await fetch("/api/setup");
      const data = await response.json();
      setSetupStatus(data);
    } catch (error) {
      setSetupStatus({
        status: "error",
        message: "Failed to check setup status",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };

  useEffect(() => {
    checkSetup();
  }, []);

  const copyToClipboard = () => {
    if (setupStatus.sql) {
      navigator.clipboard.writeText(setupStatus.sql);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-mint-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-serif text-4xl text-mint-900 mb-2">
            Database Setup
          </h1>
          <p className="text-gray-600">
            Invite System Configuration & Status
          </p>
        </div>

        {/* Status Card */}
        <div className="bg-white rounded-xl shadow-lg p-8 border-t-4 border-gold-400">
          {setupStatus.status === "loading" && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mint-800 mx-auto mb-4"></div>
              <p className="text-gray-600">{setupStatus.message}</p>
            </div>
          )}

          {setupStatus.status === "success" && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h2 className="font-serif text-2xl text-mint-900 mb-2">
                {setupStatus.message}
              </h2>
              <p className="text-gray-600 mb-4">
                The invite system is ready to use!
              </p>
              {setupStatus.recordCount !== undefined && (
                <p className="text-sm text-gray-500">
                  Total invites accepted: {setupStatus.recordCount}
                </p>
              )}
              <div className="mt-6">
                <a
                  href="/"
                  className="inline-block px-6 py-3 bg-mint-800 text-white rounded-lg hover:bg-mint-900 transition"
                >
                  Go to Home Page
                </a>
              </div>
            </div>
          )}

          {setupStatus.status === "setup_required" && (
            <div>
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-yellow-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
                <h2 className="font-serif text-2xl text-mint-900 mb-2">
                  Setup Required
                </h2>
                <p className="text-gray-600">{setupStatus.message}</p>
              </div>

              {/* Instructions */}
              {setupStatus.instructions && (
                <div className="mb-6">
                  <h3 className="font-serif text-lg text-mint-900 mb-3">
                    Setup Steps:
                  </h3>
                  <ol className="space-y-2">
                    {setupStatus.instructions.map((instruction, index) => (
                      <li
                        key={index}
                        className="text-gray-700 flex items-start"
                      >
                        <span className="inline-flex items-center justify-center w-6 h-6 bg-gold-400 text-white rounded-full text-sm font-bold mr-3 flex-shrink-0 mt-0.5">
                          {index + 1}
                        </span>
                        <span className="flex-1">{instruction}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {/* SQL Code */}
              {setupStatus.sql && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-serif text-lg text-mint-900">
                      SQL to Run:
                    </h3>
                    <button
                      onClick={copyToClipboard}
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm transition flex items-center gap-2"
                    >
                      {copied ? (
                        <>
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          Copied!
                        </>
                      ) : (
                        <>
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                            />
                          </svg>
                          Copy SQL
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
                    <code>{setupStatus.sql}</code>
                  </pre>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4 justify-center">
                {setupStatus.sqlEditorUrl && (
                  <a
                    href={setupStatus.sqlEditorUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 bg-mint-800 text-white rounded-lg hover:bg-mint-900 transition flex items-center gap-2"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                    Open SQL Editor
                  </a>
                )}
                <button
                  onClick={checkSetup}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                >
                  Check Again
                </button>
              </div>
            </div>
          )}

          {setupStatus.status === "error" && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <h2 className="font-serif text-2xl text-mint-900 mb-2">Error</h2>
              <p className="text-gray-600 mb-4">{setupStatus.message}</p>
              {setupStatus.error && (
                <p className="text-sm text-red-600 mb-4 font-mono bg-red-50 p-3 rounded">
                  {setupStatus.error}
                </p>
              )}
              {setupStatus.instructions && (
                <div className="text-left max-w-md mx-auto mb-4">
                  <ul className="space-y-2">
                    {setupStatus.instructions.map((instruction, index) => (
                      <li key={index} className="text-gray-700 text-sm">
                        • {instruction}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <button
                onClick={checkSetup}
                className="px-6 py-3 bg-mint-800 text-white rounded-lg hover:bg-mint-900 transition"
              >
                Try Again
              </button>
            </div>
          )}
        </div>

        {/* Help Section */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            Need help?{" "}
            <a
              href="/INVITE_SETUP.md"
              className="text-gold-600 hover:text-gold-700 underline"
            >
              View full setup guide
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
