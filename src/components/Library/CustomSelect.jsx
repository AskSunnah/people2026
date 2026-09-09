"use client";

import { useEffect, useRef, useState } from "react";

export default function CustomSelect({
  value,
  onChange,
  options = [],
  groups,
  placeholder = "Select…",
  showSearch = false,
  searchPlaceholder = "Filter…",
  dir = "ltr",
  minWidth = "130px",
  maxWidth,
  dropdownWidth = "260px",
}) {
  const [open, setOpen] = useState(false);
  const [filterText, setFilterText] = useState("");

  const wrapRef = useRef(null);
  const searchRef = useRef(null);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        setOpen(false);
      }
    };

    const onClickOutside = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onKey);

    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  useEffect(() => {
    if (open && showSearch && searchRef.current) {
      setTimeout(() => {
        searchRef.current?.focus();
      }, 40);
    }

    if (!open) {
      setFilterText("");
    }
  }, [open, showSearch]);

  const allOptions = groups
    ? groups.flatMap((group) => group.options)
    : options;

  const isActive = value && value !== "all" && value !== "order";

  const currentLabel = isActive
    ? placeholder
    : (allOptions.find((option) => option.value === value)?.label ??
      placeholder);

  const hasValue = value && allOptions.some((option) => option.value === value);

  const showIndicator = hasValue && value !== "all" && value !== "order";

  const matchesFilter = (label) =>
    !filterText || label.toLowerCase().includes(filterText.toLowerCase());

  const handleSelect = (val) => {
    onChange(val);
    setOpen(false);
  };

  const OptionRow = ({ option }) => {
    if (!matchesFilter(option.label)) {
      return null;
    }

    const active = option.value === value;

    return (
      <button
        type="button"
        onMouseDown={(e) => {
          e.preventDefault();
          handleSelect(option.value);
        }}
        className={`w-full flex items-center gap-2 px-3 py-[7px] text-[13px] text-[#3a2000] ${
          dir === "rtl" ? "text-right" : "text-left"
        } cursor-pointer transition-colors duration-75 ${
          active ? "bg-[#fef3c7] font-semibold" : "hover:bg-[#fef9ed]"
        }`}
        style={{ direction: dir }}
      >
        <span
          className="flex-1 break-words whitespace-normal"
          title={option.label}
        >
          {option.label}
        </span>

        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`w-3.5 h-3.5 text-[#c9a227] shrink-0 transition-opacity ${
            active ? "opacity-100" : "opacity-0"
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 13l4 4L19 7"
          />
        </svg>
      </button>
    );
  };

  return (
    <div
      ref={wrapRef}
      className="relative w-full"
      style={{ minWidth, maxWidth }}
    >
      <button
        type="button"
        onClick={() => {
          setOpen((previous) => !previous);
        }}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`w-full h-[38px] flex items-center gap-1.5 px-3 pr-8 rounded-[8px] border bg-white text-[13px] font-medium text-[#3a2000] text-left cursor-pointer outline-none select-none transition-all duration-150 ${
          open
            ? "border-[#c9a227] ring-2 ring-[#c9a227]/20"
            : "border-[#e6dcc5] hover:border-[#c9a227]"
        }`}
        style={{ direction: dir }}
      >
        {showIndicator && (
          <span className="w-[7px] h-[7px] rounded-full bg-[#c9a227] shrink-0" />
        )}

        <span className="flex-1 truncate">{currentLabel}</span>

        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`w-3 h-3 text-[#c9a227] absolute right-[10px] top-1/2 -translate-y-1/2 transition-transform duration-150 pointer-events-none ${
            open ? "rotate-180" : "rotate-0"
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {open && (
        <div
          className={`absolute top-[calc(100%+5px)] ${
            dir === "rtl" ? "right-0" : "left-0"
          } z-50 bg-white border border-[#e6dcc5] rounded-[10px] shadow-[0_4px_20px_rgba(0,0,0,0.12)] overflow-hidden`}
          style={{
            minWidth: "100%",
            width: dropdownWidth,
            maxWidth: "min(90vw, 320px)",
          }}
          role="listbox"
        >
          {showSearch && (
            <div className="p-2 pb-1">
              <div className="relative">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-[#c9a227] pointer-events-none"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
                  />
                </svg>

                <input
                  ref={searchRef}
                  type="text"
                  value={filterText}
                  onChange={(e) => {
                    setFilterText(e.target.value);
                  }}
                  placeholder={searchPlaceholder}
                  className="w-full h-[32px] pl-7 pr-3 rounded-[6px] border border-[#e6dcc5] bg-[#faf8f3] text-[12.5px] text-[#3a2000] outline-none focus:border-[#c9a227]"
                  dir={dir}
                />
              </div>
            </div>
          )}

          <div className="max-h-[220px] overflow-y-auto py-1">
            {groups ? (
              groups.map((group) => {
                const visible = group.options.filter((option) =>
                  matchesFilter(option.label),
                );

                if (!visible.length) {
                  return null;
                }

                return (
                  <div key={group.label}>
                    <p className="px-3 pt-2 pb-0.5 text-[10.5px] font-bold uppercase tracking-widest text-[#b8a98a]">
                      {group.label}
                    </p>

                    {visible.map((option) => (
                      <OptionRow key={option.value} option={option} />
                    ))}
                  </div>
                );
              })
            ) : (
              <>
                {allOptions
                  .filter((option) => matchesFilter(option.label))
                  .map((option) => (
                    <OptionRow key={option.value} option={option} />
                  ))}

                {showSearch &&
                  filterText &&
                  !allOptions.some((option) => matchesFilter(option.label)) && (
                    <p className="px-3 py-2.5 text-[12.5px] text-[#a08050] italic">
                      No results for "{filterText}"
                    </p>
                  )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
