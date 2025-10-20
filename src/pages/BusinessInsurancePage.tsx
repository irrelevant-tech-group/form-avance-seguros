import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Phone, Mail, Shield, Clock, DollarSign, ChevronRight, Building2, Truck, HardHat, FileCheck, Users } from 'lucide-react';
import BusinessQuoteForm from './BusinessQuoteForm';

const BusinessInsurancePage = () => {
  const navigate = useNavigate();
  const [selectedQuoteType, setSelectedQuoteType] = useState(null);

  // URL del icono de ciberseguridad
  const cyberIcon = "https://storage.googleapis.com/cluvi/Avance-Seguros/Iconos/Cyberseguridad.png";

  if (!selectedQuoteType) {
    return (
      <div className="bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0A4958] to-[#0A6578] py-4 px-4 shadow-md">
          <div className="max-w-5xl mx-auto flex justify-between items-center">
            <img
              src="https://storage.googleapis.com/cluvi/Imagenes/logo_avance_blanco.png"
              alt="Avance Seguros"
              className="h-12 md:h-16"
            />
            <div className="hidden md:flex items-center space-x-4 text-white">
              <span className="flex items-center">
                <Phone size={18} className="mr-2" />
                <a href="tel:+573108483562" className="hover:underline">(310)-848-35-62</a>
              </span>
              <span className="flex items-center">
                <Mail size={18} className="mr-2" />
                <a href="mailto:info@avanceseguros.com" className="hover:underline">info@avanceseguros.com</a>
              </span>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="mb-12 text-center">
            <motion.h1
              className="text-3xl md:text-4xl font-bold text-[#0A4958] mb-3"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Seguros Empresariales
            </motion.h1>
            <motion.p
              className="text-gray-600 md:text-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Selecciona el tipo de seguro empresarial que necesitas
            </motion.p>
          </div>

          {/* Breadcrumb */}
          <div className="mb-8">
            <button
              onClick={() => navigate('/')}
              className="flex items-center text-sm text-gray-600 hover:text-[#0A4958] transition-colors"
            >
              <ChevronRight className="w-4 h-4 mr-1 transform rotate-180" />
              Volver a selección de categoría
            </button>
          </div>

          {/* Opciones empresariales */}
          <div className="max-w-5xl mx-auto">
            {/* Primera fila - 3 productos */}
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              {/* Corporativos */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                onClick={() => setSelectedQuoteType('corporativos')}
                className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
              >
                <div className="relative h-48 bg-gradient-to-br from-[#0A4958] to-[#0A6578] overflow-hidden flex items-center justify-center">
                  <div className="bg-white rounded-full p-4 shadow-lg">
                    <Building2 size={40} className="text-[#0A4958]" />
                  </div>
                </div>

                <div className="p-6">
                  <h2 className="text-xl font-bold text-[#0A4958] mb-3">Corporativos y PYMES</h2>
                  <p className="text-gray-600 mb-4">
                    Protección integral para tu negocio
                  </p>

                  <ul className="space-y-2 text-sm text-gray-500 mb-6">
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-[#C69C3F] mr-2" />
                      Multiriesgo empresarial
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-[#C69C3F] mr-2" />
                      Pérdida de beneficios
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-[#C69C3F] mr-2" />
                      RC patronal
                    </li>
                  </ul>

                  <div className="flex items-center text-[#0A4958] hover:text-[#0A6578] transition-colors">
                    <span className="font-medium">Cotizar ahora</span>
                    <ChevronRight className="w-5 h-5 ml-1" />
                  </div>
                </div>
              </motion.div>

              {/* Responsabilidad Civil */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                onClick={() => setSelectedQuoteType('responsabilidad-civil')}
                className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
              >
                <div className="relative h-48 bg-gradient-to-br from-[#C69C3F] to-[#D5A429] overflow-hidden flex items-center justify-center">
                  <div className="bg-white rounded-full p-4 shadow-lg">
                    <Shield size={40} className="text-[#C69C3F]" />
                  </div>
                </div>

                <div className="p-6">
                  <h2 className="text-xl font-bold text-[#0A4958] mb-3">Responsabilidad Civil</h2>
                  <p className="text-gray-600 mb-4">
                    Protección ante responsabilidades
                  </p>

                  <ul className="space-y-2 text-sm text-gray-500 mb-6">
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-[#C69C3F] mr-2" />
                      Daños a terceros
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-[#C69C3F] mr-2" />
                      RC profesional
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-[#C69C3F] mr-2" />
                      Defensa jurídica
                    </li>
                  </ul>

                  <div className="flex items-center text-[#0A4958] hover:text-[#0A6578] transition-colors">
                    <span className="font-medium">Cotizar ahora</span>
                    <ChevronRight className="w-5 h-5 ml-1" />
                  </div>
                </div>
              </motion.div>

              {/* Transporte */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                onClick={() => setSelectedQuoteType('transporte')}
                className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
              >
                <div className="relative h-48 bg-gradient-to-br from-[#0A4958] to-[#0A6578] overflow-hidden flex items-center justify-center">
                  <div className="bg-white rounded-full p-4 shadow-lg">
                    <Truck size={40} className="text-[#0A4958]" />
                  </div>
                </div>

                <div className="p-6">
                  <h2 className="text-xl font-bold text-[#0A4958] mb-3">Transporte</h2>
                  <p className="text-gray-600 mb-4">
                    Seguridad para tus mercancías
                  </p>

                  <ul className="space-y-2 text-sm text-gray-500 mb-6">
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-[#C69C3F] mr-2" />
                      Daños
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-[#C69C3F] mr-2" />
                      Robo
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-[#C69C3F] mr-2" />
                      Cobertura internacional
                    </li>
                  </ul>

                  <div className="flex items-center text-[#0A4958] hover:text-[#0A6578] transition-colors">
                    <span className="font-medium">Cotizar ahora</span>
                    <ChevronRight className="w-5 h-5 ml-1" />
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Segunda fila - 3 productos */}
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              {/* Construcción */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                onClick={() => setSelectedQuoteType('construccion')}
                className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
              >
                <div className="relative h-48 bg-gradient-to-br from-[#C69C3F] to-[#D5A429] overflow-hidden flex items-center justify-center">
                  <div className="bg-white rounded-full p-4 shadow-lg">
                    <HardHat size={40} className="text-[#C69C3F]" />
                  </div>
                </div>

                <div className="p-6">
                  <h2 className="text-xl font-bold text-[#0A4958] mb-3">Todo Riesgo Construcción</h2>
                  <p className="text-gray-600 mb-4">
                    Protección integral para obras
                  </p>

                  <ul className="space-y-2 text-sm text-gray-500 mb-6">
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-[#C69C3F] mr-2" />
                      Daños físicos
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-[#C69C3F] mr-2" />
                      Maquinaria
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-[#C69C3F] mr-2" />
                      Periodo de mantenimiento
                    </li>
                  </ul>

                  <div className="flex items-center text-[#0A4958] hover:text-[#0A6578] transition-colors">
                    <span className="font-medium">Cotizar ahora</span>
                    <ChevronRight className="w-5 h-5 ml-1" />
                  </div>
                </div>
              </motion.div>

              {/* Cumplimiento */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                onClick={() => setSelectedQuoteType('cumplimiento')}
                className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
              >
                <div className="relative h-48 bg-gradient-to-br from-[#0A4958] to-[#0A6578] overflow-hidden flex items-center justify-center">
                  <div className="bg-white rounded-full p-4 shadow-lg">
                    <FileCheck size={40} className="text-[#0A4958]" />
                  </div>
                </div>

                <div className="p-6">
                  <h2 className="text-xl font-bold text-[#0A4958] mb-3">Cumplimiento</h2>
                  <p className="text-gray-600 mb-4">
                    Garantía para tus contratos
                  </p>

                  <ul className="space-y-2 text-sm text-gray-500 mb-6">
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-[#C69C3F] mr-2" />
                      Anticipos
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-[#C69C3F] mr-2" />
                      Estabilidad de obra
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-[#C69C3F] mr-2" />
                      Seriedad de oferta
                    </li>
                  </ul>

                  <div className="flex items-center text-[#0A4958] hover:text-[#0A6578] transition-colors">
                    <span className="font-medium">Cotizar ahora</span>
                    <ChevronRight className="w-5 h-5 ml-1" />
                  </div>
                </div>
              </motion.div>

              {/* ARL */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                onClick={() => setSelectedQuoteType('arl')}
                className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
              >
                <div className="relative h-48 bg-gradient-to-br from-[#C69C3F] to-[#D5A429] overflow-hidden flex items-center justify-center">
                  <div className="bg-white rounded-full p-4 shadow-lg">
                    <Users size={40} className="text-[#C69C3F]" />
                  </div>
                </div>

                <div className="p-6">
                  <h2 className="text-xl font-bold text-[#0A4958] mb-3">ARL</h2>
                  <p className="text-gray-600 mb-4">
                    Protección laboral para tus empleados
                  </p>

                  <ul className="space-y-2 text-sm text-gray-500 mb-6">
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-[#C69C3F] mr-2" />
                      Accidentes laborales
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-[#C69C3F] mr-2" />
                      Enfermedades profesionales
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-[#C69C3F] mr-2" />
                      Capacitaciones
                    </li>
                  </ul>

                  <div className="flex items-center text-[#0A4958] hover:text-[#0A6578] transition-colors">
                    <span className="font-medium">Cotizar ahora</span>
                    <ChevronRight className="w-5 h-5 ml-1" />
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Tercera fila - CiberSeguridad centrado */}
            <div className="grid md:grid-cols-3 gap-8">
              <div></div>
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.9 }}
                onClick={() => setSelectedQuoteType('ciberseguridad')}
                className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
              >
                <div className="relative h-48 bg-gradient-to-br from-[#0A4958] to-[#0A6578] overflow-hidden flex items-center justify-center">
                  <div className="bg-white rounded-full p-4 shadow-lg">
                    <img
                      src={cyberIcon}
                      alt="Icono CiberSeguridad"
                      className="w-16 h-16 object-contain"
                    />
                  </div>
                </div>

                <div className="p-6">
                  <h2 className="text-xl font-bold text-[#0A4958] mb-3">CiberSeguridad</h2>
                  <p className="text-gray-600 mb-4">
                    Protección contra riesgos digitales
                  </p>

                  <ul className="space-y-2 text-sm text-gray-500 mb-6">
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-[#C69C3F] mr-2" />
                      Protección de datos
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-[#C69C3F] mr-2" />
                      Ciberataques
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-[#C69C3F] mr-2" />
                      Recuperación de sistemas
                    </li>
                  </ul>

                  <div className="flex items-center text-[#0A4958] hover:text-[#0A6578] transition-colors">
                    <span className="font-medium">Cotizar ahora</span>
                    <ChevronRight className="w-5 h-5 ml-1" />
                  </div>
                </div>
              </motion.div>
              <div></div>
            </div>
          </div>

          {/* Información adicional para empresas */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16"
          >
            <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center mb-3 text-[#0A4958]">
                <Shield size={24} className="mr-2" />
                <h3 className="font-semibold">Asesoría Especializada</h3>
              </div>
              <p className="text-gray-600 text-sm">Contamos con especialistas en cada ramo empresarial para brindarte la mejor asesoría.</p>
            </div>

            <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center mb-3 text-[#0A4958]">
              <Clock size={24} className="mr-2" />
                <h3 className="font-semibold">Análisis Personalizado</h3>
              </div>
              <p className="text-gray-600 text-sm">Realizamos un análisis de riesgos específico para tu empresa y sector.</p>
            </div>

            <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center mb-3 text-[#C69C3F]">
                <DollarSign size={24} className="mr-2" />
                <h3 className="font-semibold">Mejores Tarifas</h3>
              </div>
              <p className="text-gray-600 text-sm">Negociamos las mejores tarifas empresariales del mercado para tu empresa.</p>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Si se ha seleccionado un tipo, mostrar el formulario
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0A4958] to-[#0A6578] py-4 px-4 shadow-md">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <img
            src="https://storage.googleapis.com/cluvi/Imagenes/logo_avance_blanco.png"
            alt="Avance Seguros"
            className="h-12 md:h-16"
          />
          <div className="hidden md:flex items-center space-x-4 text-white">
            <span className="flex items-center">
              <Phone size={18} className="mr-2" />
              <a href="tel:+573108483562" className="hover:underline">(310)-848-35-62</a>
            </span>
            <span className="flex items-center">
              <Mail size={18} className="mr-2" />
              <a href="mailto:info@avanceseguros.com" className="hover:underline">info@avanceseguros.com</a>
            </span>
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="max-w-5xl mx-auto px-4 py-4">
        <button
          onClick={() => setSelectedQuoteType(null)}
          className="flex items-center text-sm text-gray-600 hover:text-[#0A4958] transition-colors"
        >
          <ChevronRight className="w-4 h-4 mr-1 transform rotate-180" />
          Volver a seguros empresariales
        </button>
      </div>

      {/* Formulario correspondiente */}
      <div className="max-w-5xl mx-auto px-4 pb-12">
        <BusinessQuoteForm quoteType={selectedQuoteType} />
      </div>
    </div>
  );
};

export default BusinessInsurancePage;
