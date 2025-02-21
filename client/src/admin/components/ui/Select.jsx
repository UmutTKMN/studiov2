import React from "react";
import { Select as MTSelect, Option } from "@material-tailwind/react";

const Select = ({ label, options = [], error, ...props }) => {
  return (
    <div className="w-full">
      <MTSelect
        variant="outlined"
        color="blue"
        label={label}
        {...props}
      >
        {options.map((option) => (
          <Option key={option.value} value={option.value}>
            {option.label}
          </Option>
        ))}
      </MTSelect>
      {error && (
        <p className="mt-1 text-xs text-red-500">
          {error}
        </p>
      )}
    </div>
  );
};

export default Select;
