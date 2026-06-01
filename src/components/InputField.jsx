import React, { useState } from "react";
import { inputClass } from "./ui/layout";

const InputField = ({ field, label, icon: Icon, formData, handleChange }) => {
  const [isFocused, setIsFocused] = useState(false);

  const getInputClasses = (isTextArea = false) => {
    return `${inputClass} peer ${isTextArea ? "h-52 pt-12" : "pl-12"} ${
      isFocused ? "border-sky-500/50" : ""
    }`;
  };

  const renderInputContent = () => {
    if (field === "message") {
      return (
        <textarea
          id={field}
          name={field}
          placeholder={label}
          value={formData[field]}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={getInputClasses(true)}
          required
        />
      );
    }

    return (
      <input
        id={field}
        type={field === "email" ? "email" : "text"}
        name={field}
        placeholder={label}
        value={formData[field]}
        onChange={handleChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={getInputClasses()}
        required
      />
    );
  };

  return (
    <div className="relative w-full group">
      <div
        className={`absolute left-4 top-4 flex items-center space-x-2 transition-colors ${
          isFocused ? "text-sky-400" : "text-zinc-600"
        }`}
      >
        <Icon className="w-5 h-5" />
        <label
          htmlFor={field}
          className={`
            absolute left-12 top-1/2 transform -translate-y-1/2 text-sm transition-all duration-300 
            peer-placeholder-shown:top-1/2 peer-placeholder-shown:translate-y-0 
            peer-placeholder-shown:text-zinc-600 peer-placeholder-shown:text-base 
            peer-focus:top-2 peer-focus:translate-y-0 peer-focus:text-sky-400 peer-focus:text-sm
            ${isFocused ? "text-sky-400" : "text-zinc-600"}
          `}
        >
          {label}
        </label>
      </div>

      {renderInputContent()}
    </div>
  );
};

export default InputField;
