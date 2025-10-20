import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, AlertTriangle, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

const VehicleLoanForm = () => {
  const navigate = useNavigate();
  const [formState, setFormState] = useState({
    // Información de contacto
    name: '',
    phone: '',
    email: '',

    // Información del crédito vehicular
    loanAmount: '',
    vehicleBrand: '',
    vehicleModel: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const validateForm = () => {
    const newErrors = {};

    // Validar información de contacto
    if (!formState.name) newErrors.name = 'Este campo es obligatorio';
    if (!formState.phone) newErrors.phone = 'Este campo es obligatorio';
    if (!formState.email) {
      newErrors.email = 'Este campo es obligatorio';
    } else if (!/\S+@\S+\.\S+/.test(formState.email)) {
      newErrors.email = 'Correo electrónico inválido';
    }

    // Validar información del crédito
    if (!formState.loanAmount) newErrors.loanAmount = 'Este campo es obligatorio';
    if (!formState.vehicleBrand) newErrors.vehicleBrand = 'Este campo es obligatorio';
    if (!formState.vehicleModel) newErrors.vehicleModel = 'Este campo es obligatorio';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitClick = async () => {
    if (isSubmitting) {
      return;
    }

    if (!validateForm()) {
      toast.error('Por favor completa todos los campos obligatorios', {
        icon: <AlertTriangle className="text-red-500" />,
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const quoteId = Math.floor(100000 + Math.random() * 900000).toString();

      const response = await fetch('/.netlify/functions/send-quote-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          formData: formState,
          quoteId: quoteId,
          quoteType: 'credito-vehicular',
          userEmail: formState.email
        }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Error al enviar los correos');
      }

      toast.success('¡Formulario enviado con éxito!', {
        icon: <CheckCircle className="text-green-500" />,
      });

      navigate(`/exito?id=${quoteId}&type=credito-vehicular`);
    } catch (error) {
      console.error("Submission error:", error);

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
          Solicitud de Crédito Vehicular
        </motion.h1>
        <motion.p
          className="text-gray-600 md:text-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Completa el formulario para recibir información sobre tu crédito vehicular
        </motion.p>
      </div>

      <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden mb-8">
        <div className="p-6 md:p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Información de Contacto */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-[#0A4958] mb-6 pb-2 border-b-2 border-[#C69C3F]">
                Información de Contacto
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre completo <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formState.name}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#0A4958] focus:border-transparent transition-all ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Juan Pérez"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Teléfono <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formState.phone}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#0A4958] focus:border-transparent transition-all ${
                      errors.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="310 123 4567"
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Correo electrónico <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formState.email}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#0A4958] focus:border-transparent transition-all ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="correo@ejemplo.com"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Información del Crédito */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-[#0A4958] mb-6 pb-2 border-b-2 border-[#C69C3F]">
                Información del Vehículo
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label htmlFor="loanAmount" className="block text-sm font-medium text-gray-700 mb-2">
                    Monto a financiar <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="loanAmount"
                    name="loanAmount"
                    value={formState.loanAmount}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#0A4958] focus:border-transparent transition-all ${
                      errors.loanAmount ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="$50,000,000"
                  />
                  {errors.loanAmount && (
                    <p className="text-red-500 text-sm mt-1">{errors.loanAmount}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="vehicleBrand" className="block text-sm font-medium text-gray-700 mb-2">
                    Marca del vehículo <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="vehicleBrand"
                    name="vehicleBrand"
                    value={formState.vehicleBrand}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#0A4958] focus:border-transparent transition-all ${
                      errors.vehicleBrand ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Toyota"
                  />
                  {errors.vehicleBrand && (
                    <p className="text-red-500 text-sm mt-1">{errors.vehicleBrand}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="vehicleModel" className="block text-sm font-medium text-gray-700 mb-2">
                    Modelo del vehículo <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="vehicleModel"
                    name="vehicleModel"
                    value={formState.vehicleModel}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#0A4958] focus:border-transparent transition-all ${
                      errors.vehicleModel ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Corolla"
                  />
                  {errors.vehicleModel && (
                    <p className="text-red-500 text-sm mt-1">{errors.vehicleModel}</p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          <div className="flex justify-end mt-10">
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
                  <span className="mr-2">Enviar Solicitud</span>
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

export default VehicleLoanForm;
