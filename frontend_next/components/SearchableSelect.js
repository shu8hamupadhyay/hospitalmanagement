import { useState, useRef } from "react";
import { ChevronDown, X } from "lucide-react";

export default function SearchableSelect({
  label,
  value,
  onChange,
  options = [],
  placeholder = "Search and select...",
  getOptionLabel = (opt) => opt.name,
  getOptionValue = (opt) => opt.id,
  required = false,
  disabled = false,
  icon = null,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef(null);

  const filtered = options.filter((opt) =>
    getOptionLabel(opt).toLowerCase().includes(search.toLowerCase())
  );

  const selectedOption = options.find(
    (opt) => getOptionValue(opt) === value
  );

  const handleSelect = (opt) => {
    onChange(getOptionValue(opt));
    setIsOpen(false);
    setSearch("");
  };

  return (
    <div className="relative w-full" ref={containerRef}>
      {label && (
        <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
          {icon && <span>{icon}</span>}
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          disabled={disabled}
          className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-left bg-white flex items-center justify-between disabled:opacity-50"
        >
          <span className={selectedOption ? "text-slate-900" : "text-slate-500"}>
            {selectedOption
              ? getOptionLabel(selectedOption)
              : placeholder}
          </span>
          <ChevronDown size={18} className={`transition ${isOpen ? "rotate-180" : ""}`} />
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border-2 border-slate-300 rounded-lg shadow-lg z-50 max-h-56 overflow-hidden flex flex-col">
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-4 py-2 border-b border-slate-200 focus:outline-none text-slate-900"
              autoFocus
            />
            <div className="overflow-y-auto flex-1">
              {filtered.length === 0 ? (
                <div className="px-4 py-3 text-slate-500 text-sm">No options found</div>
              ) : (
                filtered.map((opt) => (
                  <button
                    key={getOptionValue(opt)}
                    type="button"
                    onClick={() => handleSelect(opt)}
                    onMouseDown={(e) => e.preventDefault()}
                    className="w-full px-4 py-3 text-left hover:bg-indigo-50 border-b border-slate-100 last:border-b-0 transition text-sm font-medium text-slate-700 hover:text-indigo-600"
                  >
                    {getOptionLabel(opt)}
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
