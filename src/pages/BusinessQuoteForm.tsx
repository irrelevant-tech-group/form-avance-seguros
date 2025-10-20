import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, AlertTriangle, ArrowRight, Building, HardHat, Shield, Truck, FileCheck, Users } from 'lucide-react';
import { toast } from 'sonner';

// Importar componentes del sistema existente (asumidos existentes)
import FormSection from '../components/FormSection';
import {
  FormInput,
  FormSelect,
  // FormRadioGroup is imported but not used in the provided snippet.
  // Including it here for completeness if it's meant to be used elsewhere.
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
  ],
  tipoLocal: [
    { value: 'propio', label: 'Propio' },
    { value: 'alquilado', label: 'Alquilado' }
  ]
};

const BusinessQuoteForm = ({ quoteType = 'corporativos' }) => {
  const navigate = useNavigate();

  // Estado inicial diferente según el tipo de formulario
  const getInitialState = () => {
    if (quoteType === 'corporativos') {
      return {
        // DEL TOMADOR
        razonSocial: '',
        identificacion: '',
        direccion: '',
        objetoSocial: '',
        personaContacto: '',
        celular: '',
        email: '',
        representanteLegal: '',

        // DE LA EMPRESA
        direccionRiesgo: '',
        localPropioAlquilado: '',
        areaM2: '',
        numeroPisos: '',
        mejorasLocativas: '', // Kept as string for number input initially

        // INVENTARIO
        valorEquiposElectricos: '',
        valorMueblesEnseres: '',
        valorMercanciasFijas: '',
        valorMaquinariaEquipo: '',
        valorEquiposMoviles: '',

        // Campos adicionales
        aceptaPoliticas: false,
      };
    } else if (quoteType === 'transporte') {
      // Estructura para transporte con campos adicionales
      return {
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

        // Campos específicos de transporte
        // Despachos Nacionales
        presupuestoAnualMovilizaciones: '',
        presupuestoAnualVentas: '',
        limiteMaximoDespachoNacional: '',

        // Importaciones
        presupuestoAnualImportaciones: '',
        limiteMaximoDespachoImportacion: '',

        // Exportaciones
        presupuestoAnualExportaciones: '',
        limiteMaximoDespachoExportacion: '',

        aceptaPoliticas: false,
      };
    } else if (quoteType === 'arl') {
      // Estructura específica para ARL
      return {
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

        // Campos específicos de ARL
        numeroEmpleados: '',
        arlActual: '',
        valorAportesMensualARL: '',

        aceptaPoliticas: false,
      };
    } else if (quoteType === 'ciberseguridad') {
      // Estructura para CiberSeguridad
      return {
        nombreEmpresa: '',
        nit: '',
        razonSocial: '',
        tipoPersona: '', // juridica o natural
        nombreContacto: '',
        telefono: '',
        correoElectronico: '',
        direccion: '',
        mensajeAdicional: '',
        aceptaPoliticas: false,
      };
    } else {
      // Estructura original para otros tipos (general business)
      return {
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
      };
    }
  };

  const [formState, setFormState] = useState(getInitialState());
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Maneja cambios en los campos de entrada de texto e número
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: value
    }));

    // Limpia el error si el campo se edita
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Maneja cambios en los checkboxes
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: checked
    }));

    // Limpia el error si el campo se edita
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Maneja cambios en el input de teléfono
  const handlePhoneChange = (value) => {
    if (quoteType === 'corporativos') {
      setFormState(prev => ({
        ...prev,
        celular: value
      }));

      // Limpia el error si el campo se edita
      if (errors.celular) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.celular;
          return newErrors;
        });
      }
    } else {
      setFormState(prev => ({
        ...prev,
        telefono: value
      }));

      // Limpia el error si el campo se edita
      if (errors.telefono) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.telefono;
          return newErrors;
        });
      }
    }
  };

  // Función para validar el formulario antes del envío
  const validateForm = () => {
    const newErrors = {};

    if (quoteType === 'corporativos') {
      // Validar DEL TOMADOR
      if (!formState.razonSocial) newErrors.razonSocial = 'El campo Razón Social es requerido';
      if (!formState.identificacion) newErrors.identificacion = 'El campo Identificación es requerido';
      if (!formState.direccion) newErrors.direccion = 'El campo Dirección es requerido';
      if (!formState.objetoSocial) newErrors.objetoSocial = 'El campo Objeto Social es requerido';
      if (!formState.personaContacto) newErrors.personaContacto = 'El campo Persona de Contacto es requerido';
      if (!formState.celular) newErrors.celular = 'El campo Celular es requerido';
      if (!formState.email) newErrors.email = 'El campo Email es requerido';
      if (!formState.representanteLegal) newErrors.representanteLegal = 'El campo Representante Legal es requerido';

      // Validar DE LA EMPRESA
      if (!formState.direccionRiesgo) newErrors.direccionRiesgo = 'El campo Dirección del Riesgo es requerido';
      if (!formState.localPropioAlquilado) newErrors.localPropioAlquilado = 'El campo Local Propio o Alquilado es requerido';
      if (!formState.areaM2) newErrors.areaM2 = 'El campo Área m² construidos es requerido';
      if (!formState.numeroPisos) newErrors.numeroPisos = 'El campo Número de pisos es requerido';
      if (!formState.mejorasLocativas) newErrors.mejorasLocativas = 'El campo Mejoras Locativas es requerido';

      // Validar INVENTARIO
      if (!formState.valorEquiposElectricos) newErrors.valorEquiposElectricos = 'El campo Valor Equipos Eléctricos es requerido';
      if (!formState.valorMueblesEnseres) newErrors.valorMueblesEnseres = 'El campo Valor Muebles y Enseres es requerido';
      if (!formState.valorMercanciasFijas) newErrors.valorMercanciasFijas = 'El campo Valor Mercancías Fijas es requerido';
      if (!formState.valorMaquinariaEquipo) newErrors.valorMaquinariaEquipo = 'El campo Valor Maquinaria y Equipo es requerido';
      if (!formState.valorEquiposMoviles) newErrors.valorEquiposMoviles = 'El campo Valor Equipos Móviles es requerido';

      // Validar formato de email
      if (formState.email && !/\S+@\S+\.\S+/.test(formState.email)) {
        newErrors.email = 'Email inválido';
      }
    } else {
      // Validaciones originales para otros tipos (incluyendo 'transporte')
      if (!formState.nombreContacto) newErrors.nombreContacto = 'El campo Nombre del Contacto es requerido';
      if (!formState.nit) newErrors.nit = 'El campo NIT es requerido';
      if (!formState.direccion) newErrors.direccion = 'El campo Dirección es requerido';
      if (!formState.telefono) newErrors.telefono = 'El campo Teléfono es requerido';
      if (!formState.correoElectronico) newErrors.correoElectronico = 'El campo Correo Electrónico es requerido';
      if (!formState.razonSocial) newErrors.razonSocial = 'El campo Razón Social es requerido';
      if (!formState.objetoSocial) newErrors.objetoSocial = 'El campo Objeto Social es requerido';
      if (!formState.personaContacto) newErrors.personaContacto = 'El campo Persona de Contacto es requerido';
      if (!formState.representanteLegal) newErrors.representanteLegal = 'El campo Representante Legal es requerido';

      // Validar formato de email
      if (formState.correoElectronico && !/\S+@\S+\.\S+/.test(formState.correoElectronico)) {
        newErrors.correoElectronico = 'Correo electrónico inválido';
      }

      // Validaciones adicionales para transporte
      if (quoteType === 'transporte') {
        // Despachos Nacionales
        if (!formState.presupuestoAnualMovilizaciones) newErrors.presupuestoAnualMovilizaciones = 'El campo Presupuesto anual de movilizaciones es requerido';
        if (!formState.presupuestoAnualVentas) newErrors.presupuestoAnualVentas = 'El campo Presupuesto anual de Ventas es requerido';
        if (!formState.limiteMaximoDespachoNacional) newErrors.limiteMaximoDespachoNacional = 'El campo Límite máximo por despacho nacional es requerido';

        // Importaciones
        if (!formState.presupuestoAnualImportaciones) newErrors.presupuestoAnualImportaciones = 'El campo Presupuesto anual de importaciones es requerido';
        if (!formState.limiteMaximoDespachoImportacion) newErrors.limiteMaximoDespachoImportacion = 'El campo Límite máximo por despacho de importación es requerido';

        // Exportaciones
        if (!formState.presupuestoAnualExportaciones) newErrors.presupuestoAnualExportaciones = 'El campo Presupuesto anual de exportaciones es requerido';
        if (!formState.limiteMaximoDespachoExportacion) newErrors.limiteMaximoDespachoExportacion = 'El campo Límite máximo por despacho de exportación es requerido';
      }

      // Validaciones adicionales para ARL
      if (quoteType === 'arl') {
        if (!formState.numeroEmpleados) newErrors.numeroEmpleados = 'El campo Número de empleados es requerido';
        if (!formState.arlActual) newErrors.arlActual = 'El campo ARL actual es requerido';
        if (!formState.valorAportesMensualARL) newErrors.valorAportesMensualARL = 'El campo Valor aportes mensual solo ARL es requerido';
      }

      // Validaciones adicionales para CiberSeguridad
      if (quoteType === 'ciberseguridad') {
        if (!formState.nombreEmpresa) newErrors.nombreEmpresa = 'El campo Nombre de la Empresa es requerido';
        if (!formState.tipoPersona) newErrors.tipoPersona = 'El campo Tipo de Persona es requerido';
      }
    }

    // Validar campo común de aceptación de políticas
    if (!formState.aceptaPoliticas) newErrors.aceptaPoliticas = 'Debe aceptar la Política de Privacidad';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Maneja el envío del formulario
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
      // Generar un ID de cotización aleatorio
      const quoteId = Math.floor(100000 + Math.random() * 900000).toString();

      // Enviar correos usando la función serverless (asumida existente)
      const response = await fetch('/.netlify/functions/send-quote-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          formData: formState,
          quoteId: quoteId,
          quoteType: quoteType,
          userEmail: quoteType === 'corporativos' ? formState.email : formState.correoElectronico,
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

      // Redirigir a la página de éxito con el ID de la cotización
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

  // Obtener el título, descripción e icono según el tipo de cotización
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
      },
      'ciberseguridad': {
        title: 'Cotización CiberSeguridad',
        description: 'Protección contra riesgos digitales para tu empresa',
        icon: <Shield size={24} className="text-blue-600" />
      }
    };

    return types[quoteType] || types['corporativos']; // Fallback a 'corporativos'
  };

  const quoteInfo = getQuoteInfo();

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl font-inter"> {/* Added font-inter and max-w for better centering */}
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
          {quoteType === 'corporativos' && (
            // NUEVA ESTRUCTURA PARA CORPORATIVOS Y PYMES
            <>
              {/* DEL TOMADOR */}
              <FormSection
                title="DEL TOMADOR"
                icon={<Building size={24} className="text-blue-600" />}
              >
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormInput
                      label="Razón Social"
                      name="razonSocial"
                      value={formState.razonSocial}
                      onChange={handleInputChange}
                      required
                      error={errors.razonSocial}
                    />

                    <FormInput
                      label="Identificación"
                      name="identificacion"
                      value={formState.identificacion}
                      onChange={handleInputChange}
                      required
                      error={errors.identificacion}
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

                    <FormInput
                      label="Objeto Social"
                      name="objetoSocial"
                      value={formState.objetoSocial}
                      onChange={handleInputChange}
                      required
                      error={errors.objetoSocial}
                      placeholder="Actividad principal de la empresa"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormInput
                      label="Persona de Contacto"
                      name="personaContacto"
                      value={formState.personaContacto}
                      onChange={handleInputChange}
                      required
                      error={errors.personaContacto}
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormInput
                      label="Email"
                      name="email"
                      type="email"
                      value={formState.email}
                      onChange={handleInputChange}
                      required
                      error={errors.email}
                    />

                    <FormInput
                      label="Representante Legal"
                      name="representanteLegal"
                      value={formState.representanteLegal}
                      onChange={handleInputChange}
                      required
                      error={errors.representanteLegal}
                    />
                  </div>
                </div>
              </FormSection>

              {/* DE LA EMPRESA */}
              <FormSection
                title="DE LA EMPRESA"
                icon={<HardHat size={24} className="text-green-600" />}
              >
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormInput
                      label="Dirección del Riesgo"
                      name="direccionRiesgo"
                      value={formState.direccionRiesgo}
                      onChange={handleInputChange}
                      required
                      error={errors.direccionRiesgo}
                    />

                    <FormSelect
                      label="Local Propio o Alquilado"
                      name="localPropioAlquilado"
                      options={businessData.tipoLocal}
                      value={formState.localPropioAlquilado}
                      onChange={handleInputChange}
                      required
                      error={errors.localPropioAlquilado}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormInput
                      label="Área m² construidos"
                      name="areaM2"
                      type="number"
                      value={formState.areaM2}
                      onChange={handleInputChange}
                      required
                      error={errors.areaM2}
                      placeholder="Ej: 150"
                    />

                    <FormInput
                      label="Número de pisos"
                      name="numeroPisos"
                      type="number"
                      value={formState.numeroPisos}
                      onChange={handleInputChange}
                      required
                      error={errors.numeroPisos}
                      placeholder="Ej: 2"
                    />

                    <FormInput
                      label="Mejoras Locativas"
                      name="mejorasLocativas"
                      type="number"
                      value={formState.mejorasLocativas}
                      onChange={handleInputChange}
                      required
                      error={errors.mejorasLocativas}
                      placeholder="Valor en pesos"
                    />
                  </div>

                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <p className="text-sm text-yellow-800">
                      <strong>Mejoras Locativas:</strong> Indicar el valor si el inquilino hizo mejoras locativas para adecuar el local.
                    </p>
                  </div>
                </div>
              </FormSection>

              {/* INVENTARIO */}
              <FormSection
                title="INVENTARIO"
                icon={<Shield size={24} className="text-purple-600" />}
              >
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormInput
                      label="Valor global Equipos eléctricos"
                      name="valorEquiposElectricos"
                      type="number"
                      value={formState.valorEquiposElectricos}
                      onChange={handleInputChange}
                      required
                      error={errors.valorEquiposElectricos}
                      placeholder="Valor en pesos"
                    />

                    <FormInput
                      label="Valor global Muebles y Enseres"
                      name="valorMueblesEnseres"
                      type="number"
                      value={formState.valorMueblesEnseres}
                      onChange={handleInputChange}
                      required
                      error={errors.valorMueblesEnseres}
                      placeholder="Valor en pesos"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormInput
                      label="Valor global mercancías fijas"
                      name="valorMercanciasFijas"
                      type="number"
                      value={formState.valorMercanciasFijas}
                      onChange={handleInputChange}
                      required
                      error={errors.valorMercanciasFijas}
                      placeholder="Valor en pesos"
                    />

                    <FormInput
                      label="Valor global Maquinaria y Equipo"
                      name="valorMaquinariaEquipo"
                      type="number"
                      value={formState.valorMaquinariaEquipo}
                      onChange={handleInputChange}
                      required
                      error={errors.valorMaquinariaEquipo}
                      placeholder="Valor en pesos"
                    />
                  </div>

                  <FormInput
                    label="Valor global equipos móviles para cobertura todo riesgo ⚠️"
                    name="valorEquiposMoviles"
                    type="number"
                    value={formState.valorEquiposMoviles}
                    onChange={handleInputChange}
                    required
                    error={errors.valorEquiposMoviles}
                    placeholder="Valor en pesos"
                  />

                  <div className="space-y-4">
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <h4 className="font-medium text-blue-900 mb-2">Descripción de categorías:</h4>
                      <div className="text-sm text-blue-800 space-y-1">
                        <p><strong>Equipos eléctricos:</strong> Computador, impresora, escáner, servidor, etc.</p>
                        <p><strong>Muebles y Enseres:</strong> Estantería, mobiliario de oficina</p>
                        <p><strong>Mercancías fijas:</strong> Materia prima. Si hay mercancía refrigerada, indicar el valor aparte</p>
                        <p><strong>Equipos móviles:</strong> Para cobertura todo riesgo</p>
                      </div>
                    </div>

                    {/* Resumen de valores totales */}
                    {(formState.valorEquiposElectricos || formState.valorMueblesEnseres || formState.valorMercanciasFijas || formState.valorMaquinariaEquipo || formState.valorEquiposMoviles) && (
                      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                        <div className="flex items-center mb-2">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                          <h4 className="font-medium text-green-900">Valor Total del Inventario:</h4>
                        </div>
                        <p className="text-lg font-semibold text-green-800">
                          ${[
                            parseInt(formState.valorEquiposElectricos || '0'),
                            parseInt(formState.valorMueblesEnseres || '0'),
                            parseInt(formState.valorMercanciasFijas || '0'),
                            parseInt(formState.valorMaquinariaEquipo || '0'),
                            parseInt(formState.valorEquiposMoviles || '0')
                          ].reduce((sum, val) => sum + val, 0).toLocaleString()}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </FormSection>
            </>
          )}

          {(quoteType !== 'corporativos') && (
            // ESTRUCTURA ORIGINAL PARA OTROS TIPOS
            <> {/* Added Fragment to wrap multiple FormSections */}
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
                      label="Correo Electrónico"
                      name="correoElectronico"
                      type="email"
                      value={formState.correoElectronico}
                      onChange={handleInputChange}
                      required
                      error={errors.correoElectronico}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormInput
                      label="NIT"
                      name="nit"
                      value={formState.nit}
                      onChange={handleInputChange}
                      required
                      error={errors.nit}
                      placeholder="900123456-1"
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <PhoneInput
                      label="Teléfono"
                      name="telefono"
                      value={formState.telefono}
                      onChange={handlePhoneChange}
                      required
                      error={errors.telefono}
                    />

                    <FormInput
                      label="Razón Social"
                      name="razonSocial"
                      value={formState.razonSocial}
                      onChange={handleInputChange}
                      required
                      error={errors.razonSocial}
                    />
                  </div>

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
                </div>
              </FormSection>

              {/* Campos específicos de TRANSPORTE */}
              {quoteType === 'transporte' && (
                <FormSection
                  title="DATOS DE TRANSPORTE"
                  icon={<Truck size={24} className="text-orange-600" />}
                >
                  <div className="space-y-6">
                    {/* Despachos Nacionales */}
                    <h3 className="text-lg font-semibold text-gray-800">Despachos Nacionales</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <FormInput
                        label="Presupuesto anual de movilizaciones"
                        name="presupuestoAnualMovilizaciones"
                        type="number"
                        value={formState.presupuestoAnualMovilizaciones}
                        onChange={handleInputChange}
                        required
                        error={errors.presupuestoAnualMovilizaciones}
                        placeholder="Valor en pesos"
                      />
                      <FormInput
                        label="Presupuesto anual de Ventas"
                        name="presupuestoAnualVentas"
                        type="number"
                        value={formState.presupuestoAnualVentas}
                        onChange={handleInputChange}
                        required
                        error={errors.presupuestoAnualVentas}
                        placeholder="Valor en pesos"
                      />
                      <FormInput
                        label="Límite máximo por despacho nacional"
                        name="limiteMaximoDespachoNacional"
                        type="number"
                        value={formState.limiteMaximoDespachoNacional}
                        onChange={handleInputChange}
                        required
                        error={errors.limiteMaximoDespachoNacional}
                        placeholder="Valor en pesos"
                      />
                    </div>

                    {/* Importaciones */}
                    <h3 className="text-lg font-semibold text-gray-800 mt-8">Importaciones</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormInput
                        label="Presupuesto anual de importaciones"
                        name="presupuestoAnualImportaciones"
                        type="number"
                        value={formState.presupuestoAnualImportaciones}
                        onChange={handleInputChange}
                        required
                        error={errors.presupuestoAnualImportaciones}
                        placeholder="Valor en pesos"
                      />
                      <FormInput
                        label="Límite máximo por despacho de importación"
                        name="limiteMaximoDespachoImportacion"
                        type="number"
                        value={formState.limiteMaximoDespachoImportacion}
                        onChange={handleInputChange}
                        required
                        error={errors.limiteMaximoDespachoImportacion}
                        placeholder="Valor en pesos"
                      />
                    </div>

                    {/* Exportaciones */}
                    <h3 className="text-lg font-semibold text-gray-800 mt-8">Exportaciones</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormInput
                        label="Presupuesto anual de exportaciones"
                        name="presupuestoAnualExportaciones"
                        type="number"
                        value={formState.presupuestoAnualExportaciones}
                        onChange={handleInputChange}
                        required
                        error={errors.presupuestoAnualExportaciones}
                        placeholder="Valor en pesos"
                      />
                      <FormInput
                        label="Límite máximo por despacho de exportación"
                        name="limiteMaximoDespachoExportacion"
                        type="number"
                        value={formState.limiteMaximoDespachoExportacion}
                        onChange={handleInputChange}
                        required
                        error={errors.limiteMaximoDespachoExportacion}
                        placeholder="Valor en pesos"
                      />
                    </div>
                  </div>
                </FormSection>
              )}

              {/* Campos específicos de ARL */}
              {quoteType === 'arl' && (
                <FormSection
                  title="DATOS DE ARL"
                  icon={<Users size={24} className="text-red-600" />}
                >
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <FormInput
                        label="Número de empleados"
                        name="numeroEmpleados"
                        type="number"
                        value={formState.numeroEmpleados}
                        onChange={handleInputChange}
                        required
                        error={errors.numeroEmpleados}
                        placeholder="Ej: 25"
                      />

                      <FormInput
                        label="ARL actual"
                        name="arlActual"
                        value={formState.arlActual}
                        onChange={handleInputChange}
                        required
                        error={errors.arlActual}
                        placeholder="Nombre de la ARL actual"
                      />

                      <FormInput
                        label="Valor aportes mensual solo ARL"
                        name="valorAportesMensualARL"
                        type="number"
                        value={formState.valorAportesMensualARL}
                        onChange={handleInputChange}
                        required
                        error={errors.valorAportesMensualARL}
                        placeholder="Valor en pesos"
                      />
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <h4 className="font-medium text-blue-900 mb-2">Información sobre los campos de ARL:</h4>
                      <div className="text-sm text-blue-800 space-y-1">
                        <p><strong>Número de empleados:</strong> Total de empleados activos en la empresa</p>
                        <p><strong>ARL actual:</strong> Nombre de la Administradora de Riesgos Laborales actual</p>
                        <p><strong>Valor aportes mensual:</strong> Monto mensual que paga actualmente solo por ARL</p>
                      </div>
                    </div>
                  </div>
                </FormSection>
              )}

              {/* Campos específicos de CiberSeguridad */}
              {quoteType === 'ciberseguridad' && (
                <FormSection
                  title="INFORMACIÓN DE LA EMPRESA"
                  icon={<Shield size={24} className="text-blue-600" />}
                >
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormInput
                        label="Nombre de la Empresa"
                        name="nombreEmpresa"
                        value={formState.nombreEmpresa}
                        onChange={handleInputChange}
                        required
                        error={errors.nombreEmpresa}
                        placeholder="Nombre de la empresa"
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
                        label="Razón Social"
                        name="razonSocial"
                        value={formState.razonSocial}
                        onChange={handleInputChange}
                        required
                        error={errors.razonSocial}
                        placeholder="Razón social de la empresa"
                      />

                      <FormSelect
                        label="Tipo de Persona"
                        name="tipoPersona"
                        value={formState.tipoPersona}
                        onChange={handleInputChange}
                        options={[
                          { value: '', label: 'Seleccione...' },
                          { value: 'juridica', label: 'Persona Jurídica' },
                          { value: 'natural', label: 'Persona Natural' }
                        ]}
                        required
                        error={errors.tipoPersona}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormInput
                        label="Nombre del Contacto"
                        name="nombreContacto"
                        value={formState.nombreContacto}
                        onChange={handleInputChange}
                        required
                        error={errors.nombreContacto}
                        placeholder="Nombre completo"
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormInput
                        label="Correo Electrónico"
                        name="correoElectronico"
                        type="email"
                        value={formState.correoElectronico}
                        onChange={handleInputChange}
                        required
                        error={errors.correoElectronico}
                        placeholder="correo@empresa.com"
                      />

                      <FormInput
                        label="Dirección"
                        name="direccion"
                        value={formState.direccion}
                        onChange={handleInputChange}
                        required
                        error={errors.direccion}
                        placeholder="Dirección de la empresa"
                      />
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <h4 className="font-medium text-blue-900 mb-2">Información sobre CiberSeguridad:</h4>
                      <div className="text-sm text-blue-800 space-y-1">
                        <p>Protege tu empresa contra amenazas digitales con coberturas de última generación.</p>
                        <p><strong>Incluye:</strong> Protección de datos, respuesta ante ciberataques, recuperación de sistemas y asesoría especializada.</p>
                      </div>
                    </div>
                  </div>
                </FormSection>
              )}
            </>
          )}

          {/* Checkbox de políticas - común para todos los tipos de cotización */}
          <FormSection
            title="ACEPTACIÓN DE POLÍTICAS"
          >
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
              <p className="text-sm text-red-600 mt-2">{errors.aceptaPoliticas}</p>
            )}
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