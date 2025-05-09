import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, AlertTriangle, ArrowRight, Phone, Mail, Shield, Clock, DollarSign } from 'lucide-react';
import { toast } from 'sonner';

// Componentes modulares para cada paso
import PersonalInfoStep from './steps/PersonalInfoStep';
import VehicleInfoStep from './steps/VehicleInfoStep';
import DocumentationStep from './steps/DocumentationStep';

// Animaciones para las secciones
const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const QuotePage = () => {
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
    model: '',
    year: '',
    trim: '',
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

  // Asegurarse de que isSubmitting se reinicie al cambiar entre pasos
  useEffect(() => {
    // Cuando el currentStep cambia, asegurarse de que isSubmitting es false
    setIsSubmitting(false);
    console.log(`Step changed to ${currentStep}, isSubmitting reset to false`);
  }, [currentStep]);

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
      if (!formState.model) newErrors.model = 'Este campo es obligatorio';
      if (!formState.year) newErrors.year = 'Este campo es obligatorio';
      if (!formState.trim) newErrors.trim = 'Este campo es obligatorio';
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
    if (!formState.model) allErrors.model = 'Este campo es obligatorio';
    if (!formState.year) allErrors.year = 'Este campo es obligatorio';
    if (!formState.trim) allErrors.trim = 'Este campo es obligatorio';
    if (!formState.transmission) allErrors.transmission = 'Este campo es obligatorio';
    
    if (formState.additionalEmail && !/\S+@\S+\.\S+/.test(formState.additionalEmail)) {
      allErrors.additionalEmail = 'Correo electrónico inválido';
    }
    
    setErrors(allErrors);
    return Object.keys(allErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submit attempted, current isSubmitting state:", isSubmitting);
    
    // Evitar múltiples envíos
    if (isSubmitting) {
      console.log("Submission already in progress, ignoring");
      return;
    }
    
    if (!validateForm()) {
      toast.error('Hay errores en el formulario. Por favor revisa los campos marcados.', {
        icon: <AlertTriangle className="text-red-500" />,
      });
      return;
    }
    
    console.log("Starting submission process");
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      console.log("Simulating API call...");
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate a random quote ID
      const quoteId = Math.floor(100000 + Math.random() * 900000).toString();
      
      toast.success('¡Formulario enviado con éxito!', {
        icon: <CheckCircle className="text-green-500" />,
      });
      
      // Redirect to success page with the quote ID
      navigate(`/exito?id=${quoteId}`);
    } catch (error) {
      console.error("Submission error:", error);
      toast.error('Ocurrió un error al enviar la solicitud. Por favor intenta nuevamente.', {
        icon: <AlertTriangle className="text-red-500" />,
      });
    } finally {
      console.log("Submission process complete, resetting isSubmitting");
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
            initial="hidden"
            animate="visible"
            variants={sectionVariants}
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
            initial="hidden"
            animate="visible"
            variants={sectionVariants}
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
            initial="hidden"
            animate="visible"
            variants={sectionVariants}
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
    <div className="bg-gray-50 min-h-screen">
      {/* Header con gradiente y logo */}
      <div className="bg-gradient-to-r from-[#0A4958] to-[#0A6578] py-4 px-4 shadow-md">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <img
            src="https://storage.googleapis.com/cluvi/Imagenes/logo-avance-seguro.jpg"
            alt="Avance Seguros"
            className="h-12 md:h-16"
          />
          <div className="hidden md:flex items-center space-x-4 text-white">
            <span className="flex items-center">
              <Phone size={18} className="mr-2" />
              <a href="tel:+57300123456" className="hover:underline">+57 300 123 4567</a>
            </span>
            <span className="flex items-center">
              <Mail size={18} className="mr-2" />
              <a href="mailto:contacto@avanceseguros.com" className="hover:underline">contacto@avanceseguros.com</a>
            </span>
          </div>
        </div>
      </div>
      
      <div className="max-w-5xl mx-auto px-4 py-8">
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
          <form onSubmit={handleSubmit}>
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
                    type="submit"
                    className="flex items-center px-6 py-3 bg-[#C69C3F] hover:bg-[#b38a33] text-white font-semibold rounded-md transition-colors"
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
          </form>
        </div>
        
        {/* Información adicional y confianza */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center mb-3 text-[#0A4958]">
              <Shield size={24} className="mr-2" />
              <h3 className="font-semibold">Protección Garantizada</h3>
            </div>
            <p className="text-gray-600 text-sm">Trabajamos con las mejores aseguradoras para brindarte la protección que necesitas.</p>
          </div>
          
          <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center mb-3 text-[#0A4958]">
              <Clock size={24} className="mr-2" />
              <h3 className="font-semibold">Respuesta Rápida</h3>
            </div>
            <p className="text-gray-600 text-sm">Recibirás tu cotización personalizada en menos de 24 horas hábiles.</p>
          </div>
          
          <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center mb-3 text-[#0A4958]">
              <DollarSign size={24} className="mr-2" />
              <h3 className="font-semibold">Mejor Precio</h3>
            </div>
            <p className="text-gray-600 text-sm">Comparamos opciones para ofrecerte el mejor precio con la cobertura adecuada.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuotePage;