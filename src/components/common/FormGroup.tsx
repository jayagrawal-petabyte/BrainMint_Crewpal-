import React from 'react';

interface FormGroupProps {
  label: string;
  error?: string;
  id?: string;
  children: React.ReactNode;
}

export const FormGroup: React.FC<FormGroupProps> = ({ label, error, id, children }) => {
  return (
    <div className="flex flex-col gap-1.5 mb-4">
      <label htmlFor={id} className="text-sm font-medium text-[#1e3624]">
        {label}
      </label>
      
      {children}
      
      {/* 
        Security Rule 5 Implementation: 
        Error messages are rendered strictly as text nodes. 
        We never use dangerouslySetInnerHTML for API error responses.
      */}
      {error && (
        <p className="text-xs text-red-600 mt-1" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

export default FormGroup;