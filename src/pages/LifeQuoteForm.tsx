import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, AlertTriangle, ArrowRight, Shield, Users, User } from 'lucide-react';
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

// Datos para el formulario de vida
const lifeData = {
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
  tipoSeguroOptions: [
    { value: 'vida', label: 'Seguro de Vida' },
    { value: 'credito', label: 'Plan Crédito Protegido' }
  ],
  cantidadPersonas: [
    { value: '1', label: '1 persona' },
    { value: '2', label: '2 personas' },
    { value: '3', label: '3 personas' },
    { value: '4', label: '4 personas' },
    { value: '5', label: '5 personas' }
  ]
};

const LifeQuoteForm = () => {
  const navigate = useNavigate();
  const [formState, setFormState] = useState({
    // Información de la póliza de vida - tomador
    nombreCompleto: '',
    tipoDocumento: '',
    numeroDocumento: '',
    edad: '',
    celular: '',
    sufreEnfermedad: 'no',
    cualEnfermedad: '',
    deseaAsegurarAlguienMas: 'no',
    cantidadPersonasAdicionales: '1',
    
    // Email adicional
    email: '',
    
    // Personas adicionales
    personasAdicionales: [],

    // Tipo de seguro y valores asegurados
    tipoSeguro: 'vida',
    fallecimientoCualquierCausa: '',
    fallecimientoAccidente: '',
    enfermedadesGraves: '',
    invalidezEnfermedad: '',
    invalidezAccidente: '',
    rentaDiaria: '',
    valorCredito: '',
    entidadFinanciera: '',

    // Preguntas adicionales
    conduceMoto: ''
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
            edad: '',
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
    
    // Validar campos numéricos
    const numericFields = [
      'edad',
      'fallecimientoCualquierCausa',
      'fallecimientoAccidente',
      'enfermedadesGraves',
      'invalidezEnfermedad',
      'invalidezAccidente',
      'rentaDiaria',
      'valorCredito'
    ];

    if (numericFields.includes(name)) {
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

  const handleAdditionalPersonChange = (personaId, field, value) => {
    setFormState(prev => ({
      ...prev,
      personasAdicionales: prev.personasAdicionales.map(persona => 
        persona.id === personaId 
          ? { ...persona, [field]: field === 'edad' ? value.replace(/\D/g, '') : value }
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

    // Validar información de la póliza de vida - tomador
    if (!formState.nombreCompleto) newErrors.nombreCompleto = 'El campo Nombre completo es requerido';
    if (!formState.tipoDocumento) newErrors.tipoDocumento = 'El campo Tipo de documento es requerido';
    if (!formState.numeroDocumento) newErrors.numeroDocumento = 'El campo Número documento es requerido';
    if (!formState.edad) newErrors.edad = 'El campo Edad en años es requerido';
    if (!formState.celular) newErrors.celular = 'El campo Celular es requerido';
    if (formState.sufreEnfermedad === 'si' && !formState.cualEnfermedad) {
      newErrors.cualEnfermedad = 'El campo ¿Cuál? es requerido';
    }
    if (!formState.conduceMoto) newErrors.conduceMoto = 'El campo ¿Conduce moto? es requerido';
    if (!formState.tipoSeguro) newErrors.tipoSeguro = 'Seleccione el tipo de seguro';

    if (formState.tipoSeguro === 'credito') {
      if (!formState.valorCredito) newErrors.valorCredito = 'El campo Valor del crédito es requerido';
      if (!formState.entidadFinanciera) newErrors.entidadFinanciera = 'El campo Entidad financiera es requerido';
    }
    
    // Validar personas adicionales
    formState.personasAdicionales.forEach((persona, index) => {
      if (!persona.nombreCompleto) newErrors[`adicional_${persona.id}_nombreCompleto`] = 'El campo Nombre completo es requerido';
      if (!persona.tipoDocumento) newErrors[`adicional_${persona.id}_tipoDocumento`] = 'El campo Tipo de documento es requerido';
      if (!persona.numeroDocumento) newErrors[`adicional_${persona.id}_numeroDocumento`] = 'El campo Número documento es requerido';
      if (!persona.edad) newErrors[`adicional_${persona.id}_edad`] = 'El campo Edad en años es requerido';
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
      const formDataToSend = { ...formState };
      if (formState.tipoSeguro === 'vida') {
        delete formDataToSend.valorCredito;
        delete formDataToSend.entidadFinanciera;
      } else {
        delete formDataToSend.fallecimientoCualquierCausa;
        delete formDataToSend.fallecimientoAccidente;
        delete formDataToSend.enfermedadesGraves;
        delete formDataToSend.invalidezEnfermedad;
        delete formDataToSend.invalidezAccidente;
        delete formDataToSend.rentaDiaria;
      }

      const response = await fetch('/.netlify/functions/send-quote-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          formData: formDataToSend,
          quoteId: quoteId,
          quoteType: 'vida',
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
      navigate(`/exito?id=${quoteId}&type=vida`);
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
          Cotización de Póliza de Vida
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
          {/* Póliza de vida - tomador */}
          <FormSection 
            title="COTIZAR PÓLIZA DE VIDA - TOMADOR" 
            icon={<User size={24} className="text-blue-600" />}
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
                  options={lifeData.tipoDocumento}
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
                  label="Edad en años"
                  name="edad"
                  type="number"
                  value={formState.edad}
                  onChange={handleInputChange}
                  required
                  error={errors.edad}
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
              
              <div className="flex gap-6">
                <div className="flex-1">
                  <FormRadioGroup
                    name="sufreEnfermedad"
                    label="¿Sufre de alguna enfermedad?"
                    options={lifeData.yesNoOptions}
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
                name="conduceMoto"
                label="¿Conduce moto?"
                options={lifeData.yesNoOptions}
                value={formState.conduceMoto}
                onChange={handleRadioChange}
                error={errors.conduceMoto}
              />

              <FormRadioGroup
                name="deseaAsegurarAlguienMas"
                label="¿Desea asegurar a alguien más en la póliza de Vida?"
                options={lifeData.yesNoOptions}
                value={formState.deseaAsegurarAlguienMas}
                onChange={handleRadioChange}
                error={errors.deseaAsegurarAlguienMas}
              />
              
              {formState.deseaAsegurarAlguienMas === 'si' && (
                <FormSelect
                  label="¿Cuántas personas adicionales?"
                  name="cantidadPersonasAdicionales"
                  options={lifeData.cantidadPersonas}
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
              icon={<Users size={24} className="text-blue-400" />}
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
                    options={lifeData.tipoDocumento}
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
                    label="Edad en años"
                    type="number"
                    value={persona.edad}
                    onChange={(e) => handleAdditionalPersonChange(persona.id, 'edad', e.target.value)}
                    required
                    error={errors[`adicional_${persona.id}_edad`]}
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
                      options={lifeData.yesNoOptions}
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

          <FormSection title="VALORES ASEGURADOS">
            <div className="space-y-6">
              <FormRadioGroup
                name="tipoSeguro"
                label="Selecciona el tipo de seguro"
                options={lifeData.tipoSeguroOptions}
                value={formState.tipoSeguro}
                onChange={handleRadioChange}
                error={errors.tipoSeguro}
              />

              {formState.tipoSeguro === 'vida' && (
                <>
                  <h3 className="text-base font-semibold text-gray-800 mt-4">
                    PROTECCIÓN PARA TU FAMILIA
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormInput
                      label="Fallecimiento por cualquier causa"
                      name="fallecimientoCualquierCausa"
                      type="number"
                      value={formState.fallecimientoCualquierCausa}
                      onChange={handleInputChange}
                    />
                    <FormInput
                      label="Fallecimiento por accidente"
                      name="fallecimientoAccidente"
                      type="number"
                      value={formState.fallecimientoAccidente}
                      onChange={handleInputChange}
                    />
                  </div>

                  <h3 className="text-base font-semibold text-gray-800 mt-4">
                    PROTECCIÓN PARA TI
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormInput
                      label="Enfermedades graves"
                      name="enfermedadesGraves"
                      type="number"
                      value={formState.enfermedadesGraves}
                      onChange={handleInputChange}
                    />
                    <FormInput
                      label="Invalidez por enfermedad"
                      name="invalidezEnfermedad"
                      type="number"
                      value={formState.invalidezEnfermedad}
                      onChange={handleInputChange}
                    />
                    <FormInput
                      label="Invalidez por accidente"
                      name="invalidezAccidente"
                      type="number"
                      value={formState.invalidezAccidente}
                      onChange={handleInputChange}
                    />
                    <FormInput
                      label="Renta diaria"
                      name="rentaDiaria"
                      type="number"
                      value={formState.rentaDiaria}
                      onChange={handleInputChange}
                    />
                  </div>
                </>
              )}

              {formState.tipoSeguro === 'credito' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormInput
                    label="Valor del crédito"
                    name="valorCredito"
                    type="number"
                    value={formState.valorCredito}
                    onChange={handleInputChange}
                    required
                    error={errors.valorCredito}
                  />
                  <FormInput
                    label="Entidad financiera"
                    name="entidadFinanciera"
                    value={formState.entidadFinanciera}
                    onChange={handleInputChange}
                    required
                    error={errors.entidadFinanciera}
                  />
                </div>
              )}
            </div>
          </FormSection>

          {/* Información adicional */}
          <FormSection
            title="INFORMACIÓN ADICIONAL"
          >
            <div className="space-y-6">
              
              <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="bg-blue-100 rounded-full p-2">
                      <Shield className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-base font-medium text-blue-900 mb-2">
                      Próximos pasos
                    </h3>
                    <ul className="space-y-2 text-sm text-blue-800">
                      <li className="flex items-start">
                        <span className="text-blue-600 mr-2">•</span>
                        Analizaremos tu información para ofrecerte las mejores opciones de protección
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-600 mr-2">•</span>
                        Te contactaremos en máximo 24 horas con una cotización personalizada
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-600 mr-2">•</span>
                        Podrás elegir el plan que mejor se adapte a tus necesidades y las de tu familia
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

export default LifeQuoteForm;