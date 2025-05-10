import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, AlertTriangle, ArrowRight, Phone, Mail, Shield, Clock, DollarSign, Car, Heart, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';

// Componentes para cada tipo de cotización
import HealthQuoteForm from './HealthQuoteForm';
import VehicleQuoteForm from './VehicleQuoteForm';
import LifeQuoteForm from './LifeQuoteForm';

// Animaciones para las secciones
const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const DynamicQuotePage = () => {
  const navigate = useNavigate();
  const [selectedQuoteType, setSelectedQuoteType] = useState(null);

  // Si no se ha seleccionado el tipo de cotización, mostrar el selector
  if (!selectedQuoteType) {
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
        
        <div className="max-w-5xl mx-auto px-4 py-12">
          <div className="mb-12 text-center">
            <motion.h1 
              className="text-3xl md:text-4xl font-bold text-[#0A4958] mb-3"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              ¿Qué tipo de seguro necesitas?
            </motion.h1>
            <motion.p 
              className="text-gray-600 md:text-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Selecciona el tipo de cotización que deseas realizar
            </motion.p>
          </div>

          {/* Opciones de cotización */}
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Opción de Vehículos */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              onClick={() => setSelectedQuoteType('vehiculos')}
              className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              <div className="relative h-48 bg-gradient-to-br from-[#0A4958] to-[#0A6578] overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Car className="w-24 h-24 text-white/20" />
                  <Car className="w-20 h-20 text-white absolute" />
                </div>
              </div>
              
              <div className="p-6">
                <h2 className="text-2xl font-bold text-[#0A4958] mb-3">Póliza de Auto</h2>
                <p className="text-gray-600 mb-4">
                  Protege tu vehículo con las mejores coberturas del mercado
                </p>
                
                <ul className="space-y-2 text-sm text-gray-500 mb-6">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Cobertura integral
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Asistencia 24/7
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Talleres aliados certificados
                  </li>
                </ul>
                
                <div className="mt-4 flex items-center text-[#0A4958] hover:text-[#0A6578] transition-colors">
                  <span className="font-medium">Cotizar ahora</span>
                  <ChevronRight className="w-5 h-5 ml-1" />
                </div>
              </div>
            </motion.div>

            {/* Opción de Salud */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              onClick={() => setSelectedQuoteType('salud')}
              className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              <div className="relative h-48 bg-gradient-to-br from-[#C69C3F] to-[#D5A429] overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Heart className="w-24 h-24 text-white/20" />
                  <Heart className="w-20 h-20 text-white absolute" />
                </div>
              </div>
              
              <div className="p-6">
                <h2 className="text-2xl font-bold text-[#0A4958] mb-3">Póliza de Salud</h2>
                <p className="text-gray-600 mb-4">
                  Cuida de tu salud y la de tu familia con las mejores coberturas
                </p>
                
                <ul className="space-y-2 text-sm text-gray-500 mb-6">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Atención hospitalaria
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Consulta médica ilimitada
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Medicamentos cubiertos
                  </li>
                </ul>
                
                <div className="mt-4 flex items-center text-[#0A4958] hover:text-[#0A6578] transition-colors">
                  <span className="font-medium">Cotizar ahora</span>
                  <ChevronRight className="w-5 h-5 ml-1" />
                </div>
              </div>
            </motion.div>

            {/* Opción de Vida */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              onClick={() => setSelectedQuoteType('vida')}
              className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              <div className="relative h-48 bg-gradient-to-br from-[#0A4958] to-[#0A6578] overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Shield className="w-24 h-24 text-white/20" />
                  <Shield className="w-20 h-20 text-white absolute" />
                </div>
              </div>
              
              <div className="p-6">
                <h2 className="text-2xl font-bold text-[#0A4958] mb-3">Póliza de Vida</h2>
                <p className="text-gray-600 mb-4">
                  Protege a tu familia con la seguridad financiera que necesitan
                </p>
                
                <ul className="space-y-2 text-sm text-gray-500 mb-6">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Protección financiera familiar
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Cobertura completa
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Planes flexibles
                  </li>
                </ul>
                
                <div className="mt-4 flex items-center text-[#0A4958] hover:text-[#0A6578] transition-colors">
                  <span className="font-medium">Cotizar ahora</span>
                  <ChevronRight className="w-5 h-5 ml-1" />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Información adicional y confianza */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16"
          >
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
          </motion.div>
        </div>
      </div>
    );
  }

  // Si se ha seleccionado un tipo, mostrar el formulario correspondiente
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

      {/* Breadcrumb para regresar */}
      <div className="max-w-5xl mx-auto px-4 py-4">
        <button
          onClick={() => setSelectedQuoteType(null)}
          className="flex items-center text-sm text-gray-600 hover:text-[#0A4958] transition-colors"
        >
          <ChevronRight className="w-4 h-4 mr-1 transform rotate-180" />
          Volver a selección de productos
        </button>
      </div>

      {/* Formulario correspondiente */}
      <div className="max-w-5xl mx-auto px-4 pb-12">
        {selectedQuoteType === 'vehiculos' ? (
          <VehicleQuoteForm />
        ) : selectedQuoteType === 'salud' ? (
          <HealthQuoteForm />
        ) : (
          <LifeQuoteForm />
        )}
      </div>
    </div>
  );
};

export default DynamicQuotePage;