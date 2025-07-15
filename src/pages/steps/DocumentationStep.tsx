import React, { useState } from 'react';
import { FileText, Upload, X, CheckCircle, Image, FileIcon, AlertCircle } from 'lucide-react';
import { FormSection, SectionIcon } from '../../components/FormComponent';

// Componente de carga de archivos mejorado y bonito
const EnhancedFileUpload = ({ label, onChange, files = [] }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState(files);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const newFiles = [...uploadedFiles, ...selectedFiles];
    setUploadedFiles(newFiles);
    onChange(newFiles);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      const newFiles = [...uploadedFiles, ...droppedFiles];
      setUploadedFiles(newFiles);
      onChange(newFiles);
    }
  };

  const removeFile = (index) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(newFiles);
    onChange(newFiles);
  };

  const getFileIcon = (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase();
    if (['jpg', 'jpeg', 'png'].includes(extension)) {
      return <Image className="w-5 h-5 text-blue-500" />;
    }
    return <FileIcon className="w-5 h-5 text-red-500" />;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all
          ${isDragging 
            ? 'border-[#C69C3F] bg-amber-50 scale-102' 
            : 'border-gray-300 hover:border-[#C69C3F] hover:bg-gray-50'
          }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          multiple
          accept=".jpg,.jpeg,.png,.pdf"
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        <div className="flex flex-col items-center justify-center">
          <div className="mb-4">
            <Upload className="w-12 h-12 text-gray-400 mx-auto" />
          </div>
          
          <h3 className="text-lg font-medium text-gray-700 mb-2">
            Arrastra y suelta tus archivos aquí
          </h3>
          
          <p className="text-sm text-gray-500 mb-4">
            o haz <span className="text-[#C69C3F] font-medium">clic para seleccionar</span>
          </p>
          
          <div className="text-xs text-gray-400">
            Formatos aceptados: JPG, PNG, PDF (máx. 5MB cada archivo)
          </div>
        </div>
      </div>
      
      {/* Lista de archivos subidos */}
      {uploadedFiles.length > 0 && (
        <div className="mt-6 space-y-3">
          <h4 className="text-sm font-medium text-gray-700">
            Archivos seleccionados ({uploadedFiles.length})
          </h4>
          
          {uploadedFiles.map((file, index) => (
            <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg group hover:bg-gray-100 transition-colors">
              <div className="flex-shrink-0 mr-3">
                {getFileIcon(file.name)}
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {file.name}
                </p>
                <p className="text-xs text-gray-500">
                  {formatFileSize(file.size)}
                </p>
              </div>
              
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const DocumentationStep = ({ 
  formState, 
  errors, 
  handleInputChange, 
  handleFileChange,
  files 
}) => {
  return (
    <FormSection 
      title="Documentación" 
      icon={<SectionIcon icon={FileText} color="amber" />}
      description="Documentos adicionales para procesar tu solicitud"
    >
      <div className="space-y-8">
        <div>
          <EnhancedFileUpload
            label="Adjuntar documentos"
            onChange={handleFileChange}
            files={files}
          />
          <p className="mt-2 text-sm text-gray-500">
            Documentos requeridos: Foto de la matrícula y Foto de la cédula del tomador
          </p>
        </div>
        
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-100">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <div className="bg-blue-100 rounded-full p-2">
                <AlertCircle className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-base font-medium text-blue-900 mb-2">
                ¿Qué sucede después de enviar tu solicitud?
              </h3>
              <ul className="space-y-2 text-sm text-blue-800">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  Nuestro equipo analizará tus datos en tiempo récord
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  Encontraremos las mejores opciones de cobertura para tu vehículo
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  Te contactaremos en máximo 24 horas con una cotización personalizada
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  Recibirás múltiples opciones para elegir la que mejor se adapte a tus necesidades
                </li>
              </ul>
              
              <div className="mt-4 pt-4 border-t border-blue-200">
                <p className="text-sm text-blue-700 font-medium">
                  Te contactaremos a través del teléfono y correo electrónico que proporcionaste
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
          <div className="flex items-center">
            <div className="bg-amber-100 rounded-full p-2 mr-3">
              <CheckCircle className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h4 className="text-sm font-medium text-amber-900">
                Estás a un paso de recibir tu cotización
              </h4>
              <p className="text-xs text-amber-800 mt-1">
                Al hacer clic en "Solicitar Cotización" confirmas que la información proporcionada es correcta
              </p>
            </div>
          </div>
        </div>
      </div>
    </FormSection>
  );
};

export default DocumentationStep;