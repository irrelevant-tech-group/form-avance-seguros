import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, AlertTriangle, ArrowRight, Heart, User } from 'lucide-react';
import { toast } from 'sonner';

// Importar componentes del sistema existente
import FormSection from '../components/FormSection';

// Usando los mismos componentes que el formulario de vehículos
import { 
  FormInput,
  FormSelect,
  PhoneInput
} from '../components/FormComponent';

// Datos para el formulario de mascotas
const petData = {
  tipoDocumento: [
    { value: 'cedula', label: 'Cédula de Ciudadanía' },
    { value: 'cedula_extranjeria', label: 'Cédula de Extranjería' },
    { value: 'pasaporte', label: 'Pasaporte' },
    { value: 'nit', label: 'NIT (empresas)' }
  ]
};

const PetQuoteForm = () => {
  const navigate = useNavigate();
  const [formState, setFormState] = useState({
    // Información del tomador
    nombreCompleto: '',
    email: '',
    tipoDocumento: '',
    numeroDocumento: '',
    direccion: '',
    celular: '',

    // Información de la mascota
    nombreMascota: '',
    ciudadResidencia: '',
    edadMascota: '',
    raza: '',
    enfermedadesSufridas: '',
    cirugias: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Validar que la edad de la mascota solo contenga números
    if (name === 'edadMascota') {
      const numValue = value.replace(/\D/g, '');
      setFormState(prev => ({
        ...prev,
        [name]: numValue
      }));
    } else {
      setFormState(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
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
      celular: value
    }));
    
    // Clear error when field is edited
    if (errors.celular) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.celular;
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Validar información del tomador
    if (!formState.nombreCompleto) newErrors.nombreCompleto = 'El campo Nombre completo es requerido';
    if (!formState.tipoDocumento) newErrors.tipoDocumento = 'El campo Tipo de documento es requerido';
    if (!formState.numeroDocumento) newErrors.numeroDocumento = 'El campo Número documento es requerido';
    if (!formState.celular) newErrors.celular = 'El campo Celular es requerido';
    if (!formState.direccion) newErrors.direccion = 'El campo Dirección es requerido';

    // Validar información de la mascota
    if (!formState.nombreMascota) newErrors.nombreMascota = 'El campo Nombre de la mascota es requerido';
    if (!formState.ciudadResidencia) newErrors.ciudadResidencia = 'El campo Ciudad de residencia es requerido';
    if (!formState.edadMascota) newErrors.edadMascota = 'El campo Edad (en años) es requerido';
    if (!formState.raza) newErrors.raza = 'El campo Raza es requerido';
    
    // Validar email si está presente
    if (formState.email && !/\S+@\S+\.\S+/.test(formState.email)) {
      newErrors.email = 'Correo electrónico inválido';
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
      
      // Determinar el email a usar
      const userEmail = formState.email;
      
      // Enviar correos usando la función serverless
      const response = await fetch('/.netlify/functions/send-quote-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          formData: formState,
          quoteId: quoteId,
          quoteType: 'mascotas',
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
     navigate(`/exito?id=${quoteId}&type=mascotas`);
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

 return (
   <div>
     <div className="mb-8 text-center">
       <motion.h1 
         className="text-3xl md:text-4xl font-bold text-[#0A4958] mb-3"
         initial={{ opacity: 0, y: -20 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ duration: 0.6 }}
       >
         Cotización de Póliza de Mascotas
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
     
     <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden mb-8">
       <div className="p-6 md:p-8">
        {/* Información del tomador */}
        <FormSection
          title="Información del Tomador"
          icon={<User size={24} className="text-orange-600" />}
        >
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormInput
                label="Nombre completo del tomador"
                name="nombreCompleto"
                value={formState.nombreCompleto}
                onChange={handleInputChange}
                required
                error={errors.nombreCompleto}
              />

               <FormInput
                 label="Su correo electrónico"
                 name="email"
                 type="email"
                 value={formState.email}
                 onChange={handleInputChange}
                 error={errors.email}
               />

               <FormSelect
                 label="Tipo de documento"
                 name="tipoDocumento"
                 options={petData.tipoDocumento}
                 value={formState.tipoDocumento}
                 onChange={handleInputChange}
                 required
                 error={errors.tipoDocumento}
               />
             </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormInput
                label="Número documento"
                name="numeroDocumento"
                value={formState.numeroDocumento}
                onChange={handleInputChange}
                required
                error={errors.numeroDocumento}
              />

              <PhoneInput
                label="Celular"
                name="celular"
                value={formState.celular}
                onChange={handlePhoneChange}
                required
                error={errors.celular}
              />

              <FormInput
                label="Dirección"
                name="direccion"
                value={formState.direccion}
                onChange={handleInputChange}
                required
                error={errors.direccion}
              />
            </div>
             
           </div>
          </FormSection>

          {/* Información de la Mascota */}
          <FormSection title="Información de la Mascota">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormInput
                  label="Nombre de la mascota"
                  name="nombreMascota"
                  value={formState.nombreMascota}
                  onChange={handleInputChange}
                  required
                  error={errors.nombreMascota}
                />

                <FormInput
                  label="Ciudad de residencia"
                  name="ciudadResidencia"
                  value={formState.ciudadResidencia}
                  onChange={handleInputChange}
                  required
                  error={errors.ciudadResidencia}
                />

                <FormInput
                  label="Edad (en años)"
                  name="edadMascota"
                  type="number"
                  value={formState.edadMascota}
                  onChange={handleInputChange}
                  required
                  error={errors.edadMascota}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput
                  label="Raza"
                  name="raza"
                  value={formState.raza}
                  onChange={handleInputChange}
                  required
                  error={errors.raza}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Enfermedades sufridas</label>
                  <textarea
                    name="enfermedadesSufridas"
                    value={formState.enfermedadesSufridas}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0A4958] focus:border-[#0A4958]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cirugías que se le han hecho</label>
                  <textarea
                    name="cirugias"
                    value={formState.cirugias}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0A4958] focus:border-[#0A4958]"
                  />
                </div>
              </div>
            </div>
          </FormSection>

          {/* Información adicional */}
         <FormSection
           title="INFORMACIÓN ADICIONAL"
         >
           <div className="space-y-6">
             
             <div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
               <div className="flex items-start">
                 <div className="flex-shrink-0">
                   <div className="bg-orange-100 rounded-full p-2">
                     <Heart className="w-6 h-6 text-orange-600" />
                   </div>
                 </div>
                 <div className="ml-4">
                   <h3 className="text-base font-medium text-orange-900 mb-2">
                     Próximos pasos
                   </h3>
                   <ul className="space-y-2 text-sm text-orange-800">
                     <li className="flex items-start">
                       <span className="text-orange-600 mr-2">•</span>
                       Analizaremos tu información para ofrecerte las mejores opciones de protección para tu mascota
                     </li>
                     <li className="flex items-start">
                       <span className="text-orange-600 mr-2">•</span>
                       Te contactaremos en máximo 24 horas con una cotización personalizada
                     </li>
                     <li className="flex items-start">
                       <span className="text-orange-600 mr-2">•</span>
                       Podrás elegir el plan que mejor se adapte a las necesidades de tu mejor amigo
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

export default PetQuoteForm;