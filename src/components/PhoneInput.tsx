
import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface PhoneInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label: string;
  required?: boolean;
  error?: string;
  onChange: (value: string) => void;
}

const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ label, className, required = false, error, onChange, value, ...props }, ref) => {
    
    const formatPhoneNumber = (input: string): string => {
      // Remove non-digits
      const cleaned = input.replace(/\D/g, '');
      
      // Format as Colombian phone number
      if (cleaned.length <= 3) {
        return cleaned;
      } else if (cleaned.length <= 6) {
        return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
      } else {
        return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 13)}`;
      }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const formattedValue = formatPhoneNumber(e.target.value);
      onChange(formattedValue);
    };

    return (
      <div className="w-full">
        <label className={cn("block mb-1", required ? "required-field" : "")}>
          {label}
        </label>
        <input
          className={cn(
            "input-field",
            error && "border-destructive focus:border-destructive focus:ring-destructive",
            className
          )}
          type="tel"
          ref={ref}
          value={value}
          onChange={handleChange}
          placeholder="(___) ___-____"
          {...props}
        />
        {error && <p className="mt-1 text-sm text-destructive">{error}</p>}
      </div>
    );
  }
);

PhoneInput.displayName = 'PhoneInput';

export default PhoneInput;
