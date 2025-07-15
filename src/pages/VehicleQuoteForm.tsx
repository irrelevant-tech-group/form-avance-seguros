import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, AlertTriangle, ArrowRight, Car, User, Calendar } from 'lucide-react';
import { toast } from 'sonner';

// Importar componentes existentes
import PersonalInfoStep from './steps/PersonalInfoStep';
import VehicleInfoStep from './steps/VehicleInfoStep';
import DocumentationStep from './steps/DocumentationStep';

const VehicleQuoteForm = () => {
  const navigate = useNavigate();
  const [formState, setFormState] = useState({
    // Información del solicitante
    isCollective: 'no',
    ownerName: '',
    identification: '',
    birthDate: '',
    address: '',
    phone: '',
    email: '',
    
    // Datos del vehículo
    licensePlate: '',
    vehicleType: '',
    brand: '',
    year: '',
    transmission: '',
    hasLien: 'no',
    invoiceValue: '',
    isNewVehicle: false,
    
    // Información adicional
    additionalEmail: '',
  });
  
  const [errors, setErrors] = useState({});
  const [files, setFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  const handleRadioChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  const handlePhoneChange = (value) => {
    setFormState((prev) => ({
      ...prev,
      phone: value,
    }));
    
    // Clear error when field is edited
    if (errors.phone) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.phone;
        return newErrors;
      });
    }
  };
  
  const handleFileChange = (newFiles) => {
    setFiles(newFiles);
  };
  
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };
  
  const validateCurrentStep = () => {
    const newErrors = {};
    
    if (currentStep === 1) {
      // Validar información del solicitante
      if (!formState.ownerName) newErrors.ownerName = 'Este campo es obligatorio';
      if (!formState.identification) newErrors.identification = 'Este campo es obligatorio';
      if (!formState.birthDate) newErrors.birthDate = 'Este campo es obligatorio';
      if (!formState.address) newErrors.address = 'Este campo es obligatorio';
      if (!formState.phone) newErrors.phone = 'Este campo es obligatorio';
      if (formState.email && !/\S+@\S+\.\S+/.test(formState.email)) {
        newErrors.email = 'Correo electrónico inválido';
      }
    } else if (currentStep === 2) {
      // Validar datos del vehículo
      if (!formState.vehicleType) newErrors.vehicleType = 'Este campo es obligatorio';
      if (!formState.brand) newErrors.brand = 'Este campo es obligatorio';
      if (!formState.year) newErrors.year = 'Este campo es obligatorio';
      if (!formState.transmission) newErrors.transmission = 'Este campo es obligatorio';
    } else if (currentStep === 3) {
      // Validar información adicional
      if (formState.additionalEmail && !/\S+@\S+\.\S+/.test(formState.additionalEmail)) {
        newErrors.additionalEmail = 'Correo electrónico inválido';
      }
      // Aquí no hay campos obligatorios, solo validación del formato de email
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleNextStep = () => {
    if (validateCurrentStep()) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      toast.error('Por favor completa todos los campos obligatorios', {
        icon: <AlertTriangle className="text-red-500" />,
      });
    }
  };
  
  const handlePrevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const validateForm = () => {
    const allErrors = {};
    
    // Required fields validation
    if (!formState.ownerName) allErrors.ownerName = 'Este campo es obligatorio';
    if (!formState.identification) allErrors.identification = 'Este campo es obligatorio';
    if (!formState.birthDate) allErrors.birthDate = 'Este campo es obligatorio';
    if (!formState.address) allErrors.address = 'Este campo es obligatorio';
    if (!formState.phone) allErrors.phone = 'Este campo es obligatorio';
    if (formState.email && !/\S+@\S+\.\S+/.test(formState.email)) allErrors.email = 'Correo electrónico inválido';
    
    if (!formState.vehicleType) allErrors.vehicleType = 'Este campo es obligatorio';
    if (!formState.brand) allErrors.brand = 'Este campo es obligatorio';
    if (!formState.year) allErrors.year = 'Este campo es obligatorio';
    if (!formState.transmission) allErrors.transmission = 'Este campo es obligatorio';
    
    if (formState.additionalEmail && !/\S+@\S+\.\S+/.test(formState.additionalEmail)) {
      allErrors.additionalEmail = 'Correo electrónico inválido';
    }
    
    setErrors(allErrors);
    return Object.keys(allErrors).length === 0;
  };
  
  const handleSubmitClick = async () => {
    // Evitar múltiples envíos
    if (isSubmitting) {
      return;
    }
    
    // Validación completa del formulario solo al enviar
    if (!validateForm()) {
      toast.error('Hay errores en el formulario. Por favor revisa los campos marcados.', {
        icon: <AlertTriangle className="text-red-500" />,
      });
      
      // Si hay errores, volver al primer paso con errores
      for (let step = 1; step <= totalSteps; step++) {
        const hasStepErrors = Object.keys(errors).some(key => {
          if (step === 1) {
            return ['ownerName', 'identification', 'birthDate', 'address', 'phone', 'email'].includes(key);
          } else if (step === 2) {
            return ['vehicleType', 'brand', 'year', 'transmission'].includes(key);
          } else if (step === 3) {
            return ['additionalEmail'].includes(key);
          }
          return false;
        });
        
        if (hasStepErrors) {
          setCurrentStep(step);
          break;
        }
      }
      
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Generate a random quote ID
      const quoteId = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Determinar el email a usar (priorizar email principal)
      const userEmail = formState.email || formState.additionalEmail;
      
      // Enviar correos usando la función serverless
      const response = await fetch('/.netlify/functions/send-quote-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          formData: formState,
          quoteId: quoteId,
          quoteType: 'vehiculos',
          userEmail: userEmail
        }),
      });
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Error al enviar los correos');
      }
      
      toast.success('¡Formulario enviado con éxito!', {
        icon: <CheckCircle className="text-green-500" />,
      });
      
      // Redirect to success page with the quote ID
      navigate(`/exito?id=${quoteId}&type=vehiculos`);
    } catch (error) {
      console.error("Submission error:", error);
      
      // Mensaje específico basado en el tipo de error
      const errorMessage = error.message === 'Failed to fetch' 
        ? 'Problema de conexión. Por favor, verifica tu internet e intenta nuevamente.'
        : error.message || 'Ocurrió un error al enviar la solicitud. Por favor intenta nuevamente.';
      
      toast.error(errorMessage, {
        icon: <AlertTriangle className="text-red-500" />,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Renderizado condicional basado en el paso actual
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            key="step1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <PersonalInfoStep 
              formState={formState}
              errors={errors}
              handleInputChange={handleInputChange}
              handleRadioChange={handleRadioChange}
              handlePhoneChange={handlePhoneChange}
            />
          </motion.div>
        );
      
      case 2:
        return (
          <motion.div
            key="step2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <VehicleInfoStep 
              formState={formState}
              errors={errors}
              handleInputChange={handleInputChange}
              handleCheckboxChange={handleCheckboxChange}
            />
          </motion.div>
        );
      
      case 3:
        return (
          <motion.div
            key="step3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <DocumentationStep 
              formState={formState}
              errors={errors}
              handleInputChange={handleInputChange}
              handleFileChange={handleFileChange}
              files={files}
            />
          </motion.div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div>
      <div className="mb-8 text-center">
        <motion.h1 
          className="text-3xl md:text-4xl font-bold text-[#0A4958] mb-3"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Cotización de Póliza de Auto
        </motion.h1>
        <motion.p 
          className="text-gray-600 md:text-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Completa el formulario para recibir una cotización personalizada
        </motion.p>
      </div>
      
      {/* Barra de progreso */}
      <div className="mb-10">
        <div className="flex justify-between mb-2">
          {Array.from({ length: totalSteps }).map((_, idx) => (
            <div 
              key={idx}
              className={`flex items-center justify-center rounded-full w-8 h-8 text-sm ${
                idx + 1 <= currentStep ? 'bg-[#0A4958] text-white' : 'bg-gray-200 text-gray-600'
              } transition-colors duration-300 font-medium`}
            >
              {idx + 1}
            </div>
          ))}
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
          <div 
            className="bg-[#0A4958] h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-gray-500">
          <span>Información personal</span>
          <span>Datos del vehículo</span>
          <span>Documentación</span>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden mb-8">
        <div className="p-6 md:p-8">
          {renderStep()}
          
          <div className="flex justify-between mt-10">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handlePrevStep}
                className="flex items-center px-5 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <span className="mr-1">Atrás</span>
              </button>
            ) : (
              <div></div>
            )}
            
            {currentStep < totalSteps ? (
              <button
                type="button"
                onClick={handleNextStep}
                className="flex items-center px-5 py-2 bg-[#0A4958] text-white rounded-md hover:bg-[#083a47] transition-colors"
              >
                <span className="mr-1">Siguiente</span>
                <ArrowRight size={16} />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmitClick}
                className="flex items-center px-6 py-3 bg-[#C69C3F] hover:bg-[#b38a33] text-white font-semibold rounded-md transition-colors disabled:opacity-75 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="mr-2">Enviando</span>
                    <div className="w-5 h-5 border-t-2 border-r-2 border-white rounded-full animate-spin"></div>
                  </>
                ) : (
                  <>
                    <span className="mr-2">Solicitar Cotización</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleQuoteForm;