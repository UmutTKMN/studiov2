import React from "react";
import { Link } from "react-router-dom";
import { twMerge } from "tailwind-merge";

const variants = {
  filled: {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    secondary: "bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500",
    success: "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
  },
  outlined: {
    primary: "border-2 border-blue-600 text-blue-600 hover:bg-blue-50",
    secondary: "border-2 border-gray-600 text-gray-600 hover:bg-gray-50",
    success: "border-2 border-green-600 text-green-600 hover:bg-green-50",
    danger: "border-2 border-red-600 text-red-600 hover:bg-red-50",
  },
  gradient: {
    primary:
      "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700",
    secondary:
      "bg-gradient-to-r from-gray-600 to-gray-700 text-white hover:from-gray-700 hover:to-gray-800",
    success:
      "bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700",
    danger:
      "bg-gradient-to-r from-red-600 to-rose-600 text-white hover:from-red-700 hover:to-rose-700",
  },
  text: {
    primary: "text-blue-600 hover:bg-blue-600/10",
    secondary: "text-gray-600 hover:bg-gray-600/10",
    success: "text-green-600 hover:bg-green-600/10",
    danger: "text-red-600 hover:bg-red-600/10",
  },
};
const sizes = {
  sm: "px-3 py-2 text-xs",
  md: "px-4 py-3 text-sm",
  lg: "px-8 py-4 text-base",
};

function Button({
  variant = "filled",
  color = "primary",
  size = "md",
  icon: Icon,
  iconPosition = "left",
  loading = false,
  to,
  onClick,
  disabled,
  active,
  ripple = true,
  children,
  className = "",
  ...props
}) {
  // Aktif/Pasif durumuna göre renk değiştirme
  const getActiveColor = () => {
    if (active === undefined) return color;
    return active ? "danger" : "primary";
  };

  const baseStyles = twMerge(`
    relative
    inline-flex items-center justify-center
    gap-2.5 rounded-lg font-medium
    transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:pointer-events-none
    ${variants[variant][getActiveColor()]}
    ${sizes[size]}
    ${className}
  `);

  const iconElement = Icon && (
    <Icon
      className={`
        w-5 h-5 
        transition-transform duration-200
        ${loading ? "animate-spin" : "group-hover:scale-110"}
        ${iconPosition === "right" ? "order-2" : ""}
      `}
    />
  );

  const content = (
    <>
      {loading ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        </div>
      ) : (
        <>
          {iconPosition === "left" && iconElement}
          <span className={loading ? "invisible" : ""}>{children}</span>
          {iconPosition === "right" && iconElement}
        </>
      )}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={`group ${baseStyles}`} {...props}>
        {content}
      </Link>
    );
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`group ${baseStyles}`}
      style={{ willChange: loading ? "transform" : "auto" }}
      {...props}
    >
      {content}
    </button>
  );
}

export default Button;
