"use client";

interface ProfileSwitchProps {
  activeTab: "created" | "saved";
  onSwitch: (tab: "created" | "saved") => void;
}

export default function ProfileSwitch({ activeTab, onSwitch }: ProfileSwitchProps) {
  return (
    <div className="flex justify-center gap-8 border-b border-gray-200">
      <button
        onClick={() => onSwitch("created")}
        className={`relative pb-3 text-base font-semibold transition-colors ${
          activeTab === "created"
            ? "text-gray-900"
            : "text-gray-500 hover:text-gray-700"
        }`}
      >
        Created
        {activeTab === "created" && (
          <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900" />
        )}
      </button>
      <button
        onClick={() => onSwitch("saved")}
        className={`relative pb-3 text-base font-semibold transition-colors ${
          activeTab === "saved"
            ? "text-gray-900"
            : "text-gray-500 hover:text-gray-700"
        }`}
      >
        Saved
        {activeTab === "saved" && (
          <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900" />
        )}
      </button>
    </div>
  );
}
