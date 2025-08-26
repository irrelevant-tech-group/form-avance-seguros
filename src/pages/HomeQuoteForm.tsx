import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, AlertTriangle, ArrowRight, Home, Users, User, Calculator } from 'lucide-react';
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

// Datos para el formulario de hogar
const homeData = {
  tipoDocumento: [
    { value: 'cedula', label: 'Cédula de Ciudadanía' },
    { value: 'cedula_extranjeria', label: 'Cédula de Extranjería' },
    { value: 'pasaporte', label: 'Pasaporte' },
    { value: 'nit', label: 'NIT (empresas)' }
  ],
  yesNoOptions: [
    { value: 'si', label: 'Sí' },
    { value: 'no', label: 'No' }
  ],
  cantidadPersonas: [
    { value: '1', label: '1 persona' },
    { value: '2', label: '2 personas' },
    { value: '3', label: '3 personas' },
    { value: '4', label: '4 personas' },
    { value: '5', label: '5 personas' }
  ],
  estratos: [
    { value: '1', label: 'Estrato 1' },
    { value: '2', label: 'Estrato 2' },
    { value: '3', label: 'Estrato 3' },
    { value: '4', label: 'Estrato 4' },
    { value: '5', label: 'Estrato 5' },
    { value: '6', label: 'Estrato 6' }
  ]
};

const HomeQuoteForm = () => {
  const navigate = useNavigate();
  const [formState, setFormState] = useState({
    // Información de la póliza de hogar - tomador
    nombreCompleto: '',
    tipoDocumento: '',
    numeroDocumento: '',
    fechaNacimiento: '',
    celular: '',
    deseaAsegurarAlguienMas: 'no',
    cantidadPersonasAdicionales: '1',
    
    // Email adicional
    email: '',
    
    // Información del inmueble
    direccion: '',
    estrato: '',
    valorComercial: '',
    anosConstructed: '',
    area: '',
    pisoInmueble: '',
    pisoEdificio: '',
    sotanos: '',
    vigilancia: 'no',
    unidadCerrada: 'no',
    
    // Valor contenidos
    valorElectricos: '',
    valorNoElectricos: '',
    
    // Personas adicionales
    personasAdicionales: []
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Crear formularios adicionales cuando cambia la cantidad o cuando se selecciona "Sí"
  React.useEffect(() => {
    if (formState.deseaAsegurarAlguienMas === 'si') {
      const cantidad = parseInt(formState.cantidadPersonasAdicionales);
      const personasActuales = formState.personasAdicionales.length;
      
      if (cantidad > personasActuales) {
        // Agregar personas
        const nuevasPersonas = [];
        for (let i = personasActuales; i < cantidad; i++) {
          nuevasPersonas.push({
            id: Date.now() + i,
            nombreCompleto: '',
            tipoDocumento: '',
            numeroDocumento: '',
            fechaNacimiento: '',
            celular: ''
          });
        }
        setFormState(prev => ({
          ...prev,
          personasAdicionales: [...prev.personasAdicionales, ...nuevasPersonas]
        }));
      } else if (cantidad < personasActuales) {
        // Remover personas
        setFormState(prev => ({
          ...prev,
          personasAdicionales: prev.personasAdicionales.slice(0, cantidad)
        }));
      }
    } else {
      // Si no desea asegurar a nadie más, limpiar personas adicionales
      setFormState(prev => ({
        ...prev,
        personasAdicionales: []
      }));
    }
  }, [formState.deseaAsegurarAlguienMas, formState.cantidadPersonasAdicionales]);

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

  const handleAdditionalPersonChange = (personaId, field, value) => {
    setFormState(prev => ({
      ...prev,
      personasAdicionales: prev.personasAdicionales.map(persona => 
        persona.id === personaId 
          ? { ...persona, [field]: value }
          : persona
      )
    }));
    
    // Clear error when field is edited
    const errorKey = `adicional_${personaId}_${field}`;
    if (errors[errorKey]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[errorKey];
        return newErrors;
      });
    }
  };

  const handleAdditionalPersonPhoneChange = (personaId, value) => {
    setFormState(prev => ({
      ...prev,
      personasAdicionales: prev.personasAdicionales.map(persona => 
        persona.id === personaId 
          ? { ...persona, celular: value }
          : persona
      )
    }));
  };

  const handleRadioChange = (e) => {
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

  const handleAdditionalPersonRadioChange = (personaId, value) => {
    setFormState(prev => ({
      ...prev,
      personasAdicionales: prev.personasAdicionales.map(persona => 
        persona.id === personaId 
          ? { ...persona, sufreEnfermedad: value }
          : persona
      )
    }));
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
    
    // Validar información de la póliza de hogar - tomador
    if (!formState.nombreCompleto) newErrors.nombreCompleto = 'El campo Nombre completo es requerido';
    if (!formState.tipoDocumento) newErrors.tipoDocumento = 'El campo Tipo de documento es requerido';
    if (!formState.numeroDocumento) newErrors.numeroDocumento = 'El campo Número documento es requerido';
    if (!formState.fechaNacimiento) newErrors.fechaNacimiento = 'El campo Fecha de nacimiento es requerido';
    if (!formState.celular) newErrors.celular = 'El campo Celular es requerido';
    
    // Validar información del inmueble
    if (!formState.direccion) newErrors.direccion = 'El campo Dirección es requerido';
    if (!formState.estrato) newErrors.estrato = 'El campo Estrato es requerido';
    if (!formState.valorComercial) newErrors.valorComercial = 'El campo Valor comercial es requerido';
    if (!formState.anosConstructed) newErrors.anosConstructed = 'El campo Años de construcción es requerido';
    if (!formState.area) newErrors.area = 'El campo Área es requerido';
    if (!formState.pisoInmueble) newErrors.pisoInmueble = 'El campo No. de pisos del inmueble es requerido';
    if (!formState.pisoEdificio) newErrors.pisoEdificio = 'El campo No. de pisos del edificio es requerido';
    if (!formState.sotanos) newErrors.sotanos = 'El campo No. de sótanos es requerido';
    
    // Validar valor contenidos
    if (!formState.valorElectricos) newErrors.valorElectricos = 'El campo Valor eléctricos es requerido';
    if (!formState.valorNoElectricos) newErrors.valorNoElectricos = 'El campo Valor no eléctricos es requerido';
    
    // Validar personas adicionales
    formState.personasAdicionales.forEach((persona, index) => {
      if (!persona.nombreCompleto) newErrors[`adicional_${persona.id}_nombreCompleto`] = 'El campo Nombre completo es requerido';
      if (!persona.tipoDocumento) newErrors[`adicional_${persona.id}_tipoDocumento`] = 'El campo Tipo de documento es requerido';
      if (!persona.numeroDocumento) newErrors[`adicional_${persona.id}_numeroDocumento`] = 'El campo Número documento es requerido';
      if (!persona.fechaNacimiento) newErrors[`adicional_${persona.id}_fechaNacimiento`] = 'El campo Fecha de nacimiento es requerido';
      if (!persona.celular) newErrors[`adicional_${persona.id}_celular`] = 'El campo Celular es requerido';
    });
    
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
          quoteType: 'hogar',
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
      navigate(`/exito?id=${quoteId}&type=hogar`);
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
          Cotización de Póliza de Hogar
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
          {/* Póliza de hogar - tomador */}
          <FormSection 
            title="COTIZAR PÓLIZA DE HOGAR - TOMADOR" 
            icon={<User size={24} className="text-green-600" />}
          >
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormInput
                  label="Nombre completo"
                  name="nombreCompleto"
                  value={formState.nombreCompleto}
                  onChange={handleInputChange}
                  required
                  error={errors.nombreCompleto}
                />
                
                <FormSelect
                  label="Tipo de documento"
                  name="tipoDocumento"
                  options={homeData.tipoDocumento}
                  value={formState.tipoDocumento}
                  onChange={handleInputChange}
                  required
                  error={errors.tipoDocumento}
                />
                
                <FormInput
                  label="Número documento"
                  name="numeroDocumento"
                  value={formState.numeroDocumento}
                  onChange={handleInputChange}
                  required
                  error={errors.numeroDocumento}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput
                  label="Fecha de nacimiento"
                  name="fechaNacimiento"
                  type="date"
                  value={formState.fechaNacimiento}
                  onChange={handleInputChange}
                  required
                  error={errors.fechaNacimiento}
                />
                
                <PhoneInput
                  label="Celular"
                  name="celular"
                  value={formState.celular}
                  onChange={handlePhoneChange}
                  required
                  error={errors.celular}
                />
              </div>
              
              
              <FormRadioGroup
                name="deseaAsegurarAlguienMas"
                label="¿Desea asegurar a alguien más en la póliza de Hogar?"
                options={homeData.yesNoOptions}
                value={formState.deseaAsegurarAlguienMas}
                onChange={handleRadioChange}
                error={errors.deseaAsegurarAlguienMas}
              />
              
              {formState.deseaAsegurarAlguienMas === 'si' && (
                <FormSelect
                  label="¿Cuántas personas adicionales?"
                  name="cantidadPersonasAdicionales"
                  options={homeData.cantidadPersonas}
                  value={formState.cantidadPersonasAdicionales}
                  onChange={handleInputChange}
                />
              )}
            </div>
          </FormSection>

          {/* Personas adicionales */}
          {formState.deseaAsegurarAlguienMas === 'si' && formState.personasAdicionales.map((persona, index) => (
            <FormSection 
              key={persona.id}
              title={`PERSONA ADICIONAL ${index + 1}`}
              icon={<Users size={24} className="text-green-400" />}
            >
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormInput
                    label="Nombre completo"
                    value={persona.nombreCompleto}
                    onChange={(e) => handleAdditionalPersonChange(persona.id, 'nombreCompleto', e.target.value)}
                    required
                    error={errors[`adicional_${persona.id}_nombreCompleto`]}
                  />
                  
                  <FormSelect
                    label="Tipo de documento"
                    options={homeData.tipoDocumento}
                    value={persona.tipoDocumento}
                    onChange={(e) => handleAdditionalPersonChange(persona.id, 'tipoDocumento', e.target.value)}
                    required
                    error={errors[`adicional_${persona.id}_tipoDocumento`]}
                  />
                  
                  <FormInput
                    label="Número documento"
                    value={persona.numeroDocumento}
                    onChange={(e) => handleAdditionalPersonChange(persona.id, 'numeroDocumento', e.target.value)}
                    required
                    error={errors[`adicional_${persona.id}_numeroDocumento`]}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormInput
                    label="Fecha de nacimiento"
                    type="date"
                    value={persona.fechaNacimiento}
                    onChange={(e) => handleAdditionalPersonChange(persona.id, 'fechaNacimiento', e.target.value)}
                    required
                    error={errors[`adicional_${persona.id}_fechaNacimiento`]}
                  />
                  
                  <PhoneInput
                    label="Celular"
                    value={persona.celular}
                    onChange={(value) => handleAdditionalPersonPhoneChange(persona.id, value)}
                    required
                    error={errors[`adicional_${persona.id}_celular`]}
                  />
                </div>
                
             </div>
           </FormSection>
         ))}

         {/* Información del inmueble */}
         <FormSection 
           title="INFORMACIÓN DEL INMUEBLE" 
           icon={<Home size={24} className="text-blue-600" />}
         >
           <div className="space-y-6">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <FormInput
                 label="Dirección"
                 name="direccion"
                 value={formState.direccion}
                 onChange={handleInputChange}
                 required
                 error={errors.direccion}
               />
               
               <FormSelect
                 label="Estrato"
                 name="estrato"
                 options={homeData.estratos}
                 value={formState.estrato}
                 onChange={handleInputChange}
                 required
                 error={errors.estrato}
               />
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <FormInput
                 label="Valor comercial"
                 name="valorComercial"
                 type="number"
                 value={formState.valorComercial}
                 onChange={handleInputChange}
                 required
                 error={errors.valorComercial}
                 placeholder="Ej: 150000000"
               />
               
               <FormInput
                 label="Años de construcción"
                 name="anosConstructed"
                 type="number"
                 value={formState.anosConstructed}
                 onChange={handleInputChange}
                 required
                 error={errors.anosConstructed}
                 placeholder="Ej: 10"
               />
               
               <FormInput
                 label="Área (m²)"
                 name="area"
                 type="number"
                 value={formState.area}
                 onChange={handleInputChange}
                 required
                 error={errors.area}
                 placeholder="Ej: 80"
               />
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <FormInput
                 label="No. de pisos del inmueble"
                 name="pisoInmueble"
                 type="number"
                 value={formState.pisoInmueble}
                 onChange={handleInputChange}
                 required
                 error={errors.pisoInmueble}
                 placeholder="Ej: 2"
               />
               
               <FormInput
                 label="No. de pisos del edificio"
                 name="pisoEdificio"
                 type="number"
                 value={formState.pisoEdificio}
                 onChange={handleInputChange}
                 required
                 error={errors.pisoEdificio}
                 placeholder="Ej: 5"
               />
               
               <FormInput
                 label="No. de sótanos"
                 name="sotanos"
                 type="number"
                 value={formState.sotanos}
                 onChange={handleInputChange}
                 required
                 error={errors.sotanos}
                 placeholder="Ej: 1"
               />
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <FormRadioGroup
                 name="vigilancia"
                 label="Vigilancia"
                 options={homeData.yesNoOptions}
                 value={formState.vigilancia}
                 onChange={handleRadioChange}
                 error={errors.vigilancia}
               />
               
               <FormRadioGroup
                 name="unidadCerrada"
                 label="Unidad Cerrada"
                 options={homeData.yesNoOptions}
                 value={formState.unidadCerrada}
                 onChange={handleRadioChange}
                 error={errors.unidadCerrada}
               />
             </div>
           </div>
         </FormSection>
         
         {/* Valor contenidos */}
         <FormSection 
           title="VALOR TOTAL CONTENIDOS" 
           icon={<Home size={24} className="text-purple-600" />}
         >
           <div className="space-y-6">
             <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-6">
               <h4 className="font-medium text-blue-900 mb-2">Información importante sobre contenidos:</h4>
               <div className="text-sm text-blue-800 space-y-1">
                 <p><strong>Eléctricos:</strong> Nevera, lavadora, TV, estufa, microondas, computadores, etc.</p>
                 <p><strong>No Eléctricos:</strong> Juego de sala, comedor, biblioteca, escritorio, camas, colchones, cuadros, cortinas, prendas de vestir, ropa hogar, etc.</p>
               </div>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <FormInput
                 label="Valor Eléctricos"
                 name="valorElectricos"
                 type="number"
                 value={formState.valorElectricos}
                 onChange={handleInputChange}
                 required
                 error={errors.valorElectricos}
                 placeholder="Ej: 15000000"
               />
               
               <FormInput
                 label="Valor No Eléctricos"
                 name="valorNoElectricos"
                 type="number"
                 value={formState.valorNoElectricos}
                 onChange={handleInputChange}
                 required
                 error={errors.valorNoElectricos}
                 placeholder="Ej: 10000000"
               />
             </div>
             
             <div className="bg-green-50 p-4 rounded-lg border border-green-200">
               <div className="flex items-center">
                 <div className="text-green-600 mr-3">
                   <CheckCircle size={20} />
                 </div>
                 <div>
                   <h4 className="font-medium text-green-900">Valor Total de Contenidos:</h4>
                   <p className="text-sm text-green-800">
                     {formState.valorElectricos && formState.valorNoElectricos 
                       ? `$${(parseInt(formState.valorElectricos) + parseInt(formState.valorNoElectricos)).toLocaleString()}`
                       : '$0'}
                   </p>
                 </div>
               </div>
             </div>
           </div>
         </FormSection>

         {/* Email adicional */}
         <FormSection 
           title="INFORMACIÓN ADICIONAL" 
         >
           <div className="space-y-6">
             <FormInput
               label="Su correo electrónico"
               name="email"
               type="email"
               value={formState.email}
               onChange={handleInputChange}
               error={errors.email}
             />
             
             <div className="bg-green-50 p-6 rounded-lg border border-green-200">
               <div className="flex items-start">
                 <div className="flex-shrink-0">
                   <div className="bg-green-100 rounded-full p-2">
                     <Home className="w-6 h-6 text-green-600" />
                   </div>
                 </div>
                 <div className="ml-4">
                   <h3 className="text-base font-medium text-green-900 mb-2">
                     Próximos pasos
                   </h3>
                   <ul className="space-y-2 text-sm text-green-800">
                     <li className="flex items-start">
                       <span className="text-green-600 mr-2">•</span>
                       Analizaremos tu información para ofrecerte las mejores opciones de protección para tu hogar
                     </li>
                     <li className="flex items-start">
                       <span className="text-green-600 mr-2">•</span>
                       Te contactaremos en máximo 24 horas con una cotización personalizada
                     </li>
                     <li className="flex items-start">
                       <span className="text-green-600 mr-2">•</span>
                       Podrás elegir el plan que mejor se adapte a las necesidades de tu hogar y familia
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

export default HomeQuoteForm;