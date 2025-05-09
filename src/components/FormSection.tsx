
import React from 'react';
import { cn } from '@/lib/utils';

type FormSectionProps = {
  title: string;
  children: React.ReactNode;
  className?: string;
};

const FormSection = ({ title, children, className }: FormSectionProps) => {
  return (
    <div className={cn('mb-8 p-6 bg-white rounded-lg shadow-sm border', className)}>
      <h2 className="text-xl text-primary-800 mb-6 pb-2 border-b">{title}</h2>
      <div className="space-y-6">
        {children}
      </div>
    </div>
  );
};

export default FormSection;
