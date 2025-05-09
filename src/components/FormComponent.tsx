import React, { useState } from 'react';
import { FileText, CheckCircle } from 'lucide-react';

// Componente para secciones del formulario
export const FormSection = ({ title, icon, description, children }) => {
  return (
    <div className="mb-8">
      <div className="flex items-center mb-4">
        {icon && <div className="mr-3">{icon}</div>}
        <div>
          <h2 className="text-xl font-semibold text-primary-800">{title}</h2>
          {description && <p className="text-gray-600 text-sm mt-1">{description}</p>}
        </div>
      </div>
      <div className="bg-white p-6 border border-gray-200 rounded-lg shadow-sm">
        {children}
      </div>
    </div>
  );
};

// Componente para íconos de sección
export const SectionIcon = ({ icon: Icon, color }) => (
  <div className={`rounded-full p-2 bg-${color}-100 text-${color}-600`}>
    <Icon size={24} />
  </div>
);

// Componente de entrada de texto
export const FormInput = ({ label, name, type = 'text', value, onChange, required, error, placeholder, icon, prefix }) => {
  return (
    <div className="mb-4">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        {prefix && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
            {prefix}
          </div>
        )}
        {icon && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            {icon}
          </div>
        )}
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full py-2 px-3 border ${
            error ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'
          } rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 ${
            icon ? 'pl-10' : ''
          } ${prefix ? 'pl-7' : ''}`}
        />
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

// Componente de selección
export const FormSelect = ({ label, name, options, value, onChange, required, error }) => {
  return (
    <div className="mb-4">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full py-2 px-3 border ${
          error ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'
        } rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white`}
      >
        <option value="">Seleccionar</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

// Componente de grupo de radio buttons
export const FormRadioGroup = ({ name, label, options, value, onChange, error, className }) => {
  return (
    <div className={`mb-4 ${className || ''}`}>
      <p className="block text-sm font-medium text-gray-700 mb-2">{label}</p>
      <div className="flex space-x-6">
        {options.map((option) => (
          <div key={option.value} className="flex items-center">
            <input
              id={`${name}-${option.value}`}
              name={name}
              type="radio"
              value={option.value}
              checked={value === option.value}
              onChange={onChange}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
            />
            <label htmlFor={`${name}-${option.value}`} className="ml-2 text-sm text-gray-700">
              {option.label}
            </label>
          </div>
        ))}
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

// Componente de entrada de teléfono
export const PhoneInput = ({ label, name, value, onChange, required, error, icon }) => {
  return (
    <div className="mb-4">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            {icon}
          </div>
        )}
        <input
          id={name}
          name={name}
          type="tel"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="(___) ___-____"
          className={`w-full py-2 px-3 border ${
            error ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'
          } rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 ${
            icon ? 'pl-10' : ''
          }`}
        />
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

// Componente de carga de archivos
export const FormFileUpload = ({ label, description, accept, onChange, showPreview, files: externalFiles }) => {
  // Usar los archivos pasados externamente o mantener estado local
  const [localFiles, setLocalFiles] = useState([]);
  
  // Determinar qué archivos mostrar (los externos o los locales)
  const filesToShow = externalFiles || localFiles;
  
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setLocalFiles(selectedFiles);
    if (onChange) {
      onChange(selectedFiles);
    }
  };
  
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {description && <p className="text-sm text-gray-500 mb-2">{description}</p>}
      
      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
        <div className="space-y-1 text-center">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <div className="flex text-sm text-gray-600">
            <label
              htmlFor="file-upload"
              className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
            >
              <span>Seleccionar archivo</span>
              <input
                id="file-upload"
                name="file-upload"
                type="file"
                className="sr-only"
                onChange={handleFileChange}
                accept={accept}
                multiple
              />
            </label>
            <p className="pl-1">o arrastre y suelte aquí</p>
          </div>
          <p className="text-xs text-gray-500">PNG, JPG, PDF hasta 5MB</p>
        </div>
      </div>
      
      {showPreview && filesToShow.length > 0 && (
        <div className="mt-2">
          <p className="text-sm font-medium text-gray-700">Archivos seleccionados:</p>
          <ul className="mt-1 text-sm text-gray-500">
            {filesToShow.map((file, index) => (
              <li key={index} className="flex items-center space-x-1">
                <CheckCircle size={14} className="text-green-500" />
                <span>{file.name}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};