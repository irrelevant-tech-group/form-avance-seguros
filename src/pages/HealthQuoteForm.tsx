import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, AlertTriangle, ArrowRight, Heart, Users, User } from 'lucide-react';
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

// Datos exactos basados en el formulario visible
const healthData = {
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
  epsActual: [
    { value: 'sura', label: 'Sura' },
    { value: 'sanitas', label: 'Sanitas' },
    { value: 'savia_salud', label: 'Savia Salud' },
    { value: 'salud_total', label: 'Salud Total' },
    { value: 'nueva_eps', label: 'Nueva EPS' },
    { value: 'otra', label: 'Otra' }
  ],
  planesSalud: [
    { value: 'salud_para_2', label: 'Salud para 2' },
    { value: 'salud_para_todos', label: 'Salud para todos' },
    { value: 'salud_clasica', label: 'Salud Clásica' },
    { value: 'salud_global', label: 'Salud Global' }
  ]
};

const HealthQuoteForm = () => {
  const navigate = useNavigate();
  const [formState, setFormState] = useState({
    // Información de la póliza de salud - tomador
    nombreCompleto: '',
    tipoDocumento: '',
    numeroDocumento: '',
    fechaNacimiento: '',
    celular: '',
    epsActual: '',
    sufreEnfermedad: 'no',
    cualEnfermedad: '',
    deseaAsegurarAlguienMas: 'no',
    cantidadPersonasAdicionales: '1',
    
    // Email adicional
    email: '',
    
    // Planes a seleccionar (puede seleccionar múltiples)
    planesSeleccionados: [],
    
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
            celular: '',
            sufreEnfermedad: 'no',
            cualEnfermedad: ''
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

  const handlePlanToggle = (planValue) => {
    setFormState(prev => {
      const currentPlanes = prev.planesSeleccionados;
      const isSelected = currentPlanes.includes(planValue);
      
      return {
        ...prev,
        planesSeleccionados: isSelected 
          ? currentPlanes.filter(plan => plan !== planValue)
          : [...currentPlanes, planValue]
      };
    });
    
    // Clear error when field is edited
    if (errors.planesSeleccionados) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.planesSeleccionados;
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Validar información de la póliza de salud - tomador
    if (!formState.nombreCompleto) newErrors.nombreCompleto = 'El campo Nombre completo es requerido';
    if (!formState.tipoDocumento) newErrors.tipoDocumento = 'El campo Tipo de documento es requerido';
    if (!formState.numeroDocumento) newErrors.numeroDocumento = 'El campo Número documento es requerido';
    if (!formState.fechaNacimiento) newErrors.fechaNacimiento = 'El campo Fecha de nacimiento es requerido';
    if (!formState.celular) newErrors.celular = 'El campo Celular es requerido';
    if (formState.sufreEnfermedad === 'si' && !formState.cualEnfermedad) {
      newErrors.cualEnfermedad = 'El campo ¿Cuál? es requerido';
    }
    
    // Validar planes seleccionados
    if (!formState.planesSeleccionados || formState.planesSeleccionados.length === 0) {
      newErrors.planesSeleccionados = 'Debe seleccionar al menos un plan de salud';
    }
    
    // Validar personas adicionales
    formState.personasAdicionales.forEach((persona, index) => {
      if (!persona.nombreCompleto) newErrors[`adicional_${persona.id}_nombreCompleto`] = 'El campo Nombre completo es requerido';
      if (!persona.tipoDocumento) newErrors[`adicional_${persona.id}_tipoDocumento`] = 'El campo Tipo de documento es requerido';
      if (!persona.numeroDocumento) newErrors[`adicional_${persona.id}_numeroDocumento`] = 'El campo Número documento es requerido';
      if (!persona.fechaNacimiento) newErrors[`adicional_${persona.id}_fechaNacimiento`] = 'El campo Fecha de nacimiento es requerido';
      if (!persona.celular) newErrors[`adicional_${persona.id}_celular`] = 'El campo Celular es requerido';
      if (persona.sufreEnfermedad === 'si' && !persona.cualEnfermedad) {
        newErrors[`adicional_${persona.id}_cualEnfermedad`] = 'El campo ¿Cuál? es requerido';
      }
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
          quoteType: 'salud',
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
      navigate(`/exito?id=${quoteId}&type=salud`);
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
          Cotización de Póliza de Salud
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
          {/* Póliza de salud - tomador */}
          <FormSection
            title="COTIZAR PÓLIZA DE SALUD - TOMADOR"
            icon={<User size={24} className="text-green-500" />}
          >
            <p className="text-sm text-gray-600">
              El tomador es la persona que contrata y paga la póliza. Puede ser la misma persona que el asegurado.
            </p>
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
                  options={healthData.tipoDocumento}
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

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormSelect
                  label="EPS Actual"
                  name="epsActual"
                  options={healthData.epsActual}
                  value={formState.epsActual}
                  onChange={handleInputChange}
                  error={errors.epsActual}
                />
              </div>
              
              <div className="flex gap-6">
                <div className="flex-1">
                  <FormRadioGroup
                    name="sufreEnfermedad"
                    label="¿Sufre de alguna enfermedad?"
                    options={healthData.yesNoOptions}
                    value={formState.sufreEnfermedad}
                    onChange={handleRadioChange}
                    error={errors.sufreEnfermedad}
                  />
                </div>
                
                {formState.sufreEnfermedad === 'si' && (
                  <div className="flex-1">
                    <FormInput
                      label="¿Cuál?"
                      name="cualEnfermedad"
                      value={formState.cualEnfermedad}
                      onChange={handleInputChange}
                      error={errors.cualEnfermedad}
                    />
                  </div>
                )}
              </div>
              
              <FormRadioGroup
                name="deseaAsegurarAlguienMas"
                label="¿Desea asegurar a alguien más en la póliza de Salud?"
                options={healthData.yesNoOptions}
                value={formState.deseaAsegurarAlguienMas}
                onChange={handleRadioChange}
                error={errors.deseaAsegurarAlguienMas}
              />
              
              {formState.deseaAsegurarAlguienMas === 'si' && (
                <FormSelect
                  label="¿Cuántas personas adicionales?"
                  name="cantidadPersonasAdicionales"
                  options={healthData.cantidadPersonas}
                  value={formState.cantidadPersonasAdicionales}
                  onChange={handleInputChange}
                />
              )}
              
              {/* Planes a seleccionar */}
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">
                  Planes a seleccionar <span className="text-red-500">*</span>
                  <span className="text-xs text-gray-500 block mt-1">(Puede seleccionar uno o más planes)</span>
                </label>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {healthData.planesSalud.map((plan) => (
                    <div key={plan.value} className="relative">
                      <label className="flex items-start p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-green-300 hover:bg-green-50 transition-colors">
                        <input
                          type="checkbox"
                          checked={formState.planesSeleccionados.includes(plan.value)}
                          onChange={() => handlePlanToggle(plan.value)}
                          className="mt-1 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                        />
                        <div className="ml-3 flex-1">
                          <span className="text-sm font-medium text-gray-900">{plan.label}</span>
                        </div>
                        {formState.planesSeleccionados.includes(plan.value) && (
                          <div className="ml-2">
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          </div>
                        )}
                      </label>
                    </div>
                  ))}
                </div>
                
                {errors.planesSeleccionados && (
                  <p className="text-red-500 text-sm mt-1">{errors.planesSeleccionados}</p>
                )}
                
                {formState.planesSeleccionados.length > 0 && (
                  <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h4 className="text-sm font-medium text-green-900 mb-2">
                      Planes seleccionados ({formState.planesSeleccionados.length}):
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {formState.planesSeleccionados.map((planValue) => {
                        const plan = healthData.planesSalud.find(p => p.value === planValue);
                        return (
                          <span 
                            key={planValue}
                            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
                          >
                            {plan?.label}
                            <CheckCircle className="ml-1 h-3 w-3" />
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </FormSection>

          {/* Personas adicionales */}
          {formState.deseaAsegurarAlguienMas === 'si' && formState.personasAdicionales.map((persona, index) => (
            <FormSection 
              key={persona.id}
              title={`PERSONA ADICIONAL ${index + 1}`}
              icon={<Users size={24} className="text-blue-500" />}
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
                    options={healthData.tipoDocumento}
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
                
                <div className="flex gap-6">
                  <div className="flex-1">
                    <FormRadioGroup
                      name={`sufreEnfermedad_${persona.id}`}
                      label="¿Sufre de alguna enfermedad?"
                      options={healthData.yesNoOptions}
                      value={persona.sufreEnfermedad}
                      onChange={(e) => handleAdditionalPersonRadioChange(persona.id, e.target.value)}
                      error={errors[`adicional_${persona.id}_sufreEnfermedad`]}
                    />
                  </div>
                  
                  {persona.sufreEnfermedad === 'si' && (
                    <div className="flex-1">
                      <FormInput
                        label="¿Cuál?"
                        value={persona.cualEnfermedad}
                        onChange={(e) => handleAdditionalPersonChange(persona.id, 'cualEnfermedad', e.target.value)}
                        error={errors[`adicional_${persona.id}_cualEnfermedad`]}
                      />
                    </div>
                  )}
                </div>
              </div>
            </FormSection>
          ))}

          {/* Información adicional */}
          <FormSection
            title="INFORMACIÓN ADICIONAL"
          >
            <div className="space-y-6">
              
              <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="bg-green-100 rounded-full p-2">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-base font-medium text-green-900 mb-2">
                      Próximos pasos
                    </h3>
                    <ul className="space-y-2 text-sm text-green-800">
                      <li className="flex items-start">
                        <span className="text-green-600 mr-2">•</span>
                        Analizaremos tu información para ofrecerte las mejores opciones de salud
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-600 mr-2">•</span>
                        Te contactaremos en máximo 24 horas con una cotización personalizada
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-600 mr-2">•</span>
                        Podrás elegir el plan que mejor se adapte a tus necesidades
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

export default HealthQuoteForm;