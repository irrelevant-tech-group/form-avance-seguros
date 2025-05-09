
import React from 'react';
import { cn } from '@/lib/utils';

interface FormRadioGroupProps {
  name: string;
  label: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  error?: string;
  className?: string;
}

const FormRadioGroup: React.FC<FormRadioGroupProps> = ({
  name,
  label,
  options,
  value,
  onChange,
  required = false,
  error,
  className,
}) => {
  return (
    <div className={cn("w-full", className)}>
      <label className={cn("block mb-2", required ? "required-field" : "")}>
        {label}
      </label>
      <div className="flex flex-wrap gap-4">
        {options.map((option) => (
          <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={onChange}
              className="w-4 h-4 text-primary-800 focus:ring-2 focus:ring-primary-600"
            />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
      {error && <p className="mt-1 text-sm text-destructive">{error}</p>}
    </div>
  );
};

export default FormRadioGroup;
