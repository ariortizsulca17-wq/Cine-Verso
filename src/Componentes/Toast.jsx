// src/components/ui/Toast.jsx
import { useEffect } from "react";

function Toast({ message, show, onClose }) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(onClose, 2500);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div className="fixed top-6 right-6 z-50 animate-slide-in">
      <div className="bg-[#00C8D7] text-gray-900 px-6 py-4 rounded-xl shadow-2xl font-semibold flex items-center gap-3">
        🛒 {message}
      </div>
    </div>
  );
}

export default Toast;
