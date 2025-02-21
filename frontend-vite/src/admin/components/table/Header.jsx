import React, { memo } from "react";
import Button from "../ui/Button";

const Header = memo(function TableHeader({
  title,
  description,
  icon: Icon,
  buttonProps,
  className = "",
}) {
  return (
    <div className={`mb-6 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            {Icon && (
              <div className="p-2 rounded-lg bg-gradient-to-r from-indigo-500/20 to-purple-500/20">
                <Icon className="w-5 h-5 text-gray-800" />
              </div>
            )}
            <div>
              <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
              {description && (
                <p className="mt-1 text-sm text-gray-500">{description}</p>
              )}
            </div>
          </div>
        </div>
        {buttonProps && (
          <div className="flex-shrink-0 ml-4">
            <Button {...buttonProps} />
          </div>
        )}
      </div>
    </div>
  );
});

export default Header;
