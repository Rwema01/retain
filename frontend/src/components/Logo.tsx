import { Link } from "react-router-dom";

interface LogoProps {
    size?: "sm" | "lg";
    /** "banner" = full-width white banner (sidebar). "inline" = compact, no banner bg (auth pages). */
    variant?: "banner" | "inline";
}

export default function Logo({
    size = "lg",
    variant = "banner",
}: LogoProps) {
    const isLg = size === "lg";

    const content = (
        <span
            className={
                variant === "banner"
                    ? `flex w-full items-center justify-center bg-white transition group-hover:bg-[#f5f5f5] ${isLg ? "gap-3 px-4 py-8" : "gap-2 px-3 py-3"
                    }`
                    : `inline-flex items-center gap-2 ${isLg ? "gap-3" : ""
                    }`
            }
        >
            <svg
                className={
                    variant === "banner"
                        ? isLg
                            ? "w-16 h-16 flex-shrink-0"
                            : "w-8 h-8 flex-shrink-0"
                        : isLg
                            ? "w-10 h-10 flex-shrink-0"
                            : "w-8 h-8 flex-shrink-0"
                }
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{ color: variant === "banner" ? "#042404" : "#10b981" }}
            >
                <circle
                    cx="20"
                    cy="20"
                    r="17"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeDasharray="80 28"
                    transform="rotate(-90 20 20)"
                />
                <circle cx="20" cy="20" r="6" fill="currentColor" />
                <path
                    d="M20 16.5v7M18 18h3a1.5 1.5 0 010 3h-2a1.5 1.5 0 000 3h3"
                    stroke="#ffffff"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>

            <span
                className={`font-bold ${variant === "banner"
                        ? isLg
                            ? "text-5xl"
                            : "text-lg"
                        : isLg
                            ? "text-3xl"
                            : "text-xl"
                    }`}
                style={{ color: variant === "banner" ? "#042404" : "#10b981" }}
            >
                Retain
            </span>
        </span>
    );

    return (
        <Link
            to="/"
            onClick={() => {
                if (window.location.pathname === "/") {
                    window.location.reload();
                }
            }}
            className={
                variant === "banner" ? "block w-full group" : "inline-block group"
            }
            aria-label="Retain — Go to Dashboard"
        >
            {content}
        </Link>
    );
}