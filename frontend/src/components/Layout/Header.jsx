import React from "react";

export default function Header() {
  return (
    <header className="bg-white border-b p-4 flex justify-between items-center shadow-sm">
      <div className="text-lg font-semibold text-gray-700">
        🏥 Hospital Dashboard
      </div>
      <button
        onClick={() => {
          localStorage.removeItem("token");
          window.location.href = "/login";
        }}
        className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
      >
        Logout
      </button>
    </header>
  );
}
