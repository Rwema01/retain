import { useState, type ChangeEvent } from "react";

interface PasswordInputProps {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  minLength?: number;
  className?: string;
}

export default function PasswordInput({
  value,
  onChange,
  placeholder,
  required,
  minLength,
  className = "",
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <input
        type={visible ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        minLength={minLength}
        className={`w-full bg-white text-black placeholder:text-gray-500 border border-rim rounded-lg px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-accent ${className}`}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-slate-500 hover:text-slate-800 transition"
        aria-label={visible ? "Hide password" : "Show password"}
        tabIndex={-1}
      >
        {visible ? (
          // Eye-off icon
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 3l18 18M10.584 10.587a2 2 0 002.828 2.828M9.363 5.365A9.466 9.466 0 0112 5c7 0 10 7 10 7a13.16 13.16 0 01-1.671 2.717M6.228 6.228C3.428 7.886 2 12 2 12s3 7 10 7a9.46 9.46 0 004.472-1.114"
            />
          </svg>
        ) : (
          // Eye icon
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"
            />
            <circle cx="12" cy="12" r="3" />
          </svg>
        )}
      </button>
    </div>
  );
}