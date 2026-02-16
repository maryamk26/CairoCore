type AboutModalProps = {
    open: boolean;
    onClose: () => void;
  };
  
  export default function AboutModal({ open, onClose }: AboutModalProps) {
    return (
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${
          open
            ? "bg-black/50 backdrop-blur-sm"
            : "bg-black/0 backdrop-blur-0 pointer-events-none"
        }`}
        onClick={onClose}
      >
        <div
          className={`bg-[#3d2f1f] rounded-2xl shadow-xl border border-[#5d4e37]/50 p-8 md:p-12 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative transition-all duration-300 ${
            open
              ? "opacity-100 scale-100 translate-y-0"
              : "opacity-0 scale-95 -translate-y-4 pointer-events-none"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
            aria-label="Close"
          >
            ✕
          </button>
  
          <div className="mt-4">
            <h2 className="font-cinzel text-3xl md:text-4xl font-bold text-white mb-6">
              What We Do
            </h2>
  
            <div className="space-y-6 text-white/90 leading-relaxed text-lg">
              <div>
                <h3 className="font-cinzel text-xl font-semibold text-white mb-3">
                  Your Ultimate Cairo Guide
                </h3>
                <p>
                  Think of us as your bestie who knows all the hidden gems in
                  Cairo. We're a bunch of Cairo enthusiasts who got tired of
                  missing out on the coolest spots in the city.
                </p>
              </div>
  
              <div>
                <h3 className="font-cinzel text-xl font-semibold text-white mb-3">
                  Making Cairo Exploration Effortless
                </h3>
                <p>
                  We're making Cairo exploration absolutely effortless and way
                  more fun — with photos, honest reviews, and insider tips.
                </p>
                <p className="mt-3">
                  Share places, plan your day, and connect with explorers who love
                  Cairo as much as you do.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  