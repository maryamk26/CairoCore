export default function MapWrapper({ height = "400px", children, message }: { height?: string; children?: React.ReactNode; message?: string }) {
    if (typeof window === "undefined") {
      return (
        <div className="w-full bg-gray-200 flex items-center justify-center rounded-lg" style={{ height }}>
          <p className="text-gray-500">{message || "Loading map..."}</p>
        </div>
      );
    }
  
    return (
      <div className="w-full rounded-lg overflow-hidden" style={{ height }}>
        {children}
      </div>
    );
  }
  