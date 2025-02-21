import React from "react";
import { Input as MTInput } from "@material-tailwind/react";

const Input = ({ error, ...props }) => {
  return (
    <div className="w-full">
      <MTInput
        variant="outlined"
        color="blue"
        {...props}
        className={`!border-t-blue-gray-200 focus:!border-t-gray-900 ${props.className || ''}`}
      />
      {error && (
        <p className="mt-1 text-xs text-red-500">
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;
