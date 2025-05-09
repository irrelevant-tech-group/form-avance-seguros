import React, { useEffect } from 'react';
import { FileText, Mail } from 'lucide-react';
import { FormSection, SectionIcon, FormInput, FormFileUpload } from '../../components/FormComponent';

const DocumentationStep = ({ 
  formState, 
  errors, 
  handleInputChange, 
  handleFileChange,
  files 
}) => {
  // Asegurarse de que cuando el componente se monte, no estemos en un estado de envío
  useEffect(() => {
    console.log("DocumentationStep mounted");
    // Podríamos añadir código aquí si necesitamos reset de algún estado
  }, []);

  return (
    <FormSection 
      title="Documentación y Contacto" 
      icon={<SectionIcon icon={FileText} color="amber" />}
      description="Documentos adicionales y preferencias de contacto"
    >
      <div className="mb-8">
        <FormFileUpload
          label="Adjuntar foto de la matrícula y/o copia del seguro actual"
          description="Formatos aceptados: JPG, PNG, PDF (Máx. 5MB)"
          accept=".jpg,.jpeg,.png,.pdf"
          onChange={handleFileChange}
          showPreview={true}
          files={files}
        />
      </div>
      
      <div className="mb-6">
        <h4 className="text-lg font-medium text-gray-800 mb-3">Preferencias de Contacto</h4>
        <p className="text-gray-600 mb-4">Indica cómo prefieres que te contactemos con tu cotización</p>
        
        <FormInput
          label="Correo adicional para seguimiento (opcional)"
          name="additionalEmail"
          type="email"
          icon={<Mail size={18} className="text-gray-500" />}
          value={formState.additionalEmail}
          onChange={handleInputChange}
          error={errors.additionalEmail}
        />
      </div>
      
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-6">
        <h5 className="text-primary-800 font-medium mb-2">¿Qué sigue después?</h5>
        <p className="text-gray-700 text-sm">
          Una vez enviada tu solicitud, nuestro equipo analizará las mejores opciones de cobertura para tu vehículo 
          y te contactará en un plazo de 24 horas hábiles con una cotización personalizada.
        </p>
      </div>
    </FormSection>
  );
};

export default DocumentationStep;