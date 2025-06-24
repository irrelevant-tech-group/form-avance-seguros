import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, AlertTriangle, ArrowRight, Building, User, Phone, Mail, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';

// Importar componentes del sistema existente
import FormSection from '../components/FormSection';

// Usando los mismos componentes que el formulario de vehículos
import { 
  FormInput,
  FormSelect,
  FormRadioGroup,
  PhoneInput
} from '../components/FormComponent';

// Datos para el formulario empresarial
const businessData = {
  tipoDocumento: [
    { value: 'nit', label: 'NIT' },
    { value: 'cedula', label: 'Cédula de Ciudadanía' },
    { value: 'cedula_extranjeria', label: 'Cédula de Extranjería' },
    { value: 'pasaporte', label: 'Pasaporte' }
  ],
  yesNoOptions: [
    { value: 'si', label: 'Sí' },
    { value: 'no', label: 'No' }
  ]
};

const BusinessQuoteForm = ({ quoteType = 'corporativos' }) => {
  const navigate = useNavigate();
  const [formState, setFormState] = useState({
    // Información empresarial
    nombreContacto: '',
    nit: '',
    direccion: '',
    telefono: '',
    correoElectronico: '',
    razonSocial: '',
    objetoSocial: '',
    personaContacto: '',
    representanteLegal: '',
    mensajeAdicional: '',
    aceptaPoliticas: false,
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: checked
    }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handlePhoneChange = (value) => {
    setFormState(prev => ({
      ...prev,
      telefono: value
    }));
    
    // Clear error when field is edited
    if (errors.telefono) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.telefono;
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Validar campos obligatorios
    if (!formState.nombreContacto) newErrors.nombreContacto = 'El campo Nombre del Contacto es requerido';
    if (!formState.nit) newErrors.nit = 'El campo NIT es requerido';
    if (!formState.direccion) newErrors.direccion = 'El campo Dirección es requerido';
    if (!formState.telefono) newErrors.telefono = 'El campo Teléfono es requerido';
    if (!formState.correoElectronico) newErrors.correoElectronico = 'El campo Correo Electrónico es requerido';
    if (!formState.razonSocial) newErrors.razonSocial = 'El campo Razón Social es requerido';
    if (!formState.objetoSocial) newErrors.objetoSocial = 'El campo Objeto Social es requerido';
    if (!formState.personaContacto) newErrors.personaContacto = 'El campo Persona de Contacto es requerido';
    if (!formState.representanteLegal) newErrors.representanteLegal = 'El campo Representante Legal es requerido';
    if (!formState.aceptaPoliticas) newErrors.aceptaPoliticas = 'Debe aceptar la Política de Privacidad';
    
    // Validar email
    if (formState.correoElectronico && !/\S+@\S+\.\S+/.test(formState.correoElectronico)) {
      newErrors.correoElectronico = 'Correo electrónico inválido';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    
    if (!validateForm()) {
      toast.error('Por favor revisa los campos marcados en rojo', {
        icon: <AlertTriangle className="text-red-500" />,
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Generate a random quote ID
      const quoteId = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Enviar correos usando la función serverless
      const response = await fetch('/.netlify/functions/send-quote-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          formData: formState,
          quoteId: quoteId,
          quoteType: quoteType,
          userEmail: formState.correoElectronico,
          isBusinessQuote: true
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
      navigate(`/exito?id=${quoteId}&type=${quoteType}`);
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

  // Obtener el título y descripción según el tipo de cotización
  const getQuoteInfo = () => {
    const types = {
      'corporativos': {
        title: 'Cotización Corporativos y PYMES',
        description: 'Protección integral para tu empresa',
        icon: <Building size={24} className="text-blue-600" />
      },
      'responsabilidad-civil': {
        title: 'Cotización Responsabilidad Civil',
        description: 'Protección ante responsabilidades civiles',
        icon: <Shield size={24} className="text-green-600" />
      },
      'transporte': {
        title: 'Cotización Transporte',
        description: 'Seguridad para tus mercancías en tránsito',
        icon: <Truck size={24} className="text-orange-600" />
      },
      'construccion': {
        title: 'Cotización Todo Riesgo Construcción',
        description: 'Protección integral para obras de construcción',
        icon: <HardHat size={24} className="text-yellow-600" />
      },
      'cumplimiento': {
        title: 'Cotización Cumplimiento',
        description: 'Garantías para tus contratos y obligaciones',
        icon: <FileCheck size={24} className="text-purple-600" />
      },
      'arl': {
        title: 'Cotización ARL',
        description: 'Protección laboral para tus empleados',
        icon: <Users size={24} className="text-red-600" />
      }
    };
    
    return types[quoteType] || types['corporativos'];
  };

  const quoteInfo = getQuoteInfo();

  return (
    <div>
      <div className="mb-8 text-center">
        <motion.h1 
          className="text-3xl md:text-4xl font-bold text-[#0A4958] mb-3"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {quoteInfo.title}
        </motion.h1>
        <motion.p 
          className="text-gray-600 md:text-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {quoteInfo.description}
        </motion.p>
      </div>
      <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden mb-8">
        <div className="p-6 md:p-8">
          {/* Información de la empresa */}
          <FormSection 
            title="INFORMACIÓN DE LA EMPRESA" 
            icon={quoteInfo.icon}
          >
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput
                  label="Nombre del Contacto"
                  name="nombreContacto"
                  value={formState.nombreContacto}
                  onChange={handleInputChange}
                  required
                  error={errors.nombreContacto}
                />
                
                <FormInput
                  label="NIT"
                  name="nit"
                  value={formState.nit}
                  onChange={handleInputChange}
                  required
                  error={errors.nit}
                  placeholder="900123456-1"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput
                  label="Dirección"
                  name="direccion"
                  value={formState.direccion}
                  onChange={handleInputChange}
                  required
                  error={errors.direccion}
                />
                
                <PhoneInput
                  label="Teléfono"
                  name="telefono"
                  value={formState.telefono}
                  onChange={handlePhoneChange}
                  required
                  error={errors.telefono}
                />
              </div>
              
              <FormInput
                label="Correo Electrónico"
                name="correoElectronico"
                type="email"
                value={formState.correoElectronico}
                onChange={handleInputChange}
                required
                error={errors.correoElectronico}
              />
              
              <FormInput
                label="Razón Social"
                name="razonSocial"
                value={formState.razonSocial}
                onChange={handleInputChange}
                required
                error={errors.razonSocial}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput
                  label="Objeto Social"
                  name="objetoSocial"
                  value={formState.objetoSocial}
                  onChange={handleInputChange}
                  required
                  error={errors.objetoSocial}
                  placeholder="Actividad principal de la empresa"
                />
                
                <FormInput
                  label="Persona de Contacto"
                  name="personaContacto"
                  value={formState.personaContacto}
                  onChange={handleInputChange}
                  required
                  error={errors.personaContacto}
                />
              </div>
              
              <FormInput
                label="Representante Legal"
                name="representanteLegal"
                value={formState.representanteLegal}
                onChange={handleInputChange}
                required
                error={errors.representanteLegal}
              />
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mensaje adicional (opcional)
                </label>
                <textarea
                  name="mensajeAdicional"
                  value={formState.mensajeAdicional}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0A4958] focus:border-[#0A4958]"
                  placeholder="Proporciona información adicional sobre tus necesidades de seguro..."
                />
              </div>
              
              {/* Checkbox de políticas */}
              <div className="flex items-start">
                <input
                  type="checkbox"
                  name="aceptaPoliticas"
                  checked={formState.aceptaPoliticas}
                  onChange={handleCheckboxChange}
                  className="mt-1 h-4 w-4 text-[#0A4958] focus:ring-[#0A4958] border-gray-300 rounded"
                />
                <label className="ml-3 text-sm text-gray-700">
                  <span className="font-medium">Acepto la Política de Privacidad</span>
                  <span className="text-red-500 ml-1">*</span>
                  <br />
                  <span className="text-gray-500">
                    Al enviar este formulario, acepto que mis datos sean utilizados para el procesamiento de mi cotización y contacto comercial.
                  </span>
                </label>
              </div>
              
              {errors.aceptaPoliticas && (
                <p className="text-sm text-red-600">{errors.aceptaPoliticas}</p>
              )}
            </div>
          </FormSection>

          {/* Información adicional sobre el proceso */}
          <FormSection 
            title="PRÓXIMOS PASOS" 
          >
            <div className="space-y-6">
              <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="bg-blue-100 rounded-full p-2">
                      <CheckCircle className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-base font-medium text-blue-900 mb-2">
                      ¿Qué sucede después?
                    </h3>
                    <ul className="space-y-2 text-sm text-blue-800">
                      <li className="flex items-start">
                        <span className="text-blue-600 mr-2">•</span>
                        Nuestro equipo especializado en seguros empresariales analizará tus necesidades
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-600 mr-2">•</span>
                        Te contactaremos en máximo 24 horas para programar una reunión
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-600 mr-2">•</span>
                        Realizaremos un análisis de riesgos personalizado para tu empresa
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-600 mr-2">•</span>
                        Te presentaremos una propuesta completa con múltiples opciones de cobertura
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </FormSection>
          
          {/* Botón de envío */}
          <div className="flex justify-end mt-10">
            <button
              type="button"
              onClick={handleSubmit}
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessQuoteForm;