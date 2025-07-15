// src/components/PersonalQuotes.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, ChevronRight, Shield, Clock, DollarSign, Car, Heart, Shield as LifeShield, Home, Users } from 'lucide-react'; // Renombrar Shield para evitar conflictos

const productIconUrls = {
  car: "https://storage.googleapis.com/cluvi/Avance-Seguros/Iconos/Autos.png",
  heart: "https://storage.googleapis.com/cluvi/Avance-Seguros/Iconos/Salud.png", 
  life: "https://storage.googleapis.com/cluvi/Avance-Seguros/Iconos/Vida.png", // Usar 'life' para evitar conflicto con shield
  pet: "https://storage.googleapis.com/cluvi/Avance-Seguros/Iconos/Mascotas.png",
  home: "https://storage.googleapis.com/cluvi/Avance-Seguros/Iconos/Hogar.png"
};

const PersonalQuotes = ({ setSelectedQuoteType, setSelectedCategory }) => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="mb-12 text-center">
        <motion.h1 
          className="text-3xl md:text-4xl font-bold text-[#0A4958] mb-3"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Seguros Personales
        </motion.h1>
        <motion.p 
          className="text-gray-600 md:text-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Selecciona el tipo de seguro personal que necesitas
        </motion.p>
      </div>

      <div className="mb-8">
        <button
          onClick={() => setSelectedCategory(null)}
          className="flex items-center text-sm text-gray-600 hover:text-[#0A4958] transition-colors"
        >
          <ChevronRight className="w-4 h-4 mr-1 transform rotate-180" />
          Volver a selección de categoría
        </button>
      </div>

      <div className="max-w-5xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            onClick={() => setSelectedQuoteType('vehiculos')}
            className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
          >
            <div className="relative h-48 bg-gradient-to-br from-[#0A4958] to-[#0A6578] overflow-hidden flex items-center justify-center">
              <div className="bg-white rounded-full p-4 shadow-lg">
                <img 
                  src={productIconUrls.car} 
                  alt="Icono Auto" 
                  className="w-16 h-16 object-contain"
                />
              </div>
            </div>
            
            <div className="p-6">
              <h2 className="text-xl font-bold text-[#0A4958] mb-3">Póliza de Auto</h2>
              <p className="text-gray-600 mb-4">
                Protege tu vehículo con las mejores coberturas del mercado
              </p>
              
              <ul className="space-y-2 text-sm text-gray-500 mb-6">
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-[#C69C3F] mr-2" />
                  Cobertura integral
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-[#C69C3F] mr-2" />
                  Asistencia 24/7
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-[#C69C3F] mr-2" />
                  Talleres aliados certificados
                </li>
              </ul>
              
              <div className="flex items-center text-[#0A4958] hover:text-[#0A6578] transition-colors">
               <span className="font-medium">Cotizar ahora</span>
               <ChevronRight className="w-5 h-5 ml-1" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            onClick={() => setSelectedQuoteType('salud')}
            className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
          >
            <div className="relative h-48 bg-gradient-to-br from-[#C69C3F] to-[#D5A429] overflow-hidden flex items-center justify-center">
              <div className="bg-white rounded-full p-4 shadow-lg">
                <img 
                  src={productIconUrls.heart} 
                  alt="Icono Salud" 
                  className="w-16 h-16 object-contain"
                />
              </div>
            </div>
            
            <div className="p-6">
              <h2 className="text-xl font-bold text-[#0A4958] mb-3">Póliza de Salud</h2>
              <p className="text-gray-600 mb-4">
                Cuida de tu salud y la de tu familia con las mejores coberturas
              </p>
              
              <ul className="space-y-2 text-sm text-gray-500 mb-6">
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-[#C69C3F] mr-2" />
                  Hospitalizacion y Cirugua
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-[#C69C3F] mr-2" />
                  Consulta ilimitada especialistas
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-[#C69C3F] mr-2" />
                  Atencion medica domiciliaria
                </li>
              </ul>
              
              <div className="flex items-center text-[#0A4958] hover:text-[#0A6578] transition-colors">
                <span className="font-medium">Cotizar ahora</span>
                <ChevronRight className="w-5 h-5 ml-1" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            onClick={() => setSelectedQuoteType('vida')}
            className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
          >
            <div className="relative h-48 bg-gradient-to-br from-[#0A4958] to-[#0A6578] overflow-hidden flex items-center justify-center">
              <div className="bg-white rounded-full p-4 shadow-lg">
                <img 
                  src={productIconUrls.life} 
                  alt="Icono Vida" 
                  className="w-16 h-16 object-contain"
                />
              </div>
            </div>
            
            <div className="p-6">
              <h2 className="text-xl font-bold text-[#0A4958] mb-3">Póliza de Vida</h2>
              <p className="text-gray-600 mb-4">
                Protege a tu familia con la seguridad financiera que necesitan
              </p>
              
              <ul className="space-y-2 text-sm text-gray-500 mb-6">
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-[#C69C3F] mr-2" />
                  Protección financiera familiar
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-[#C69C3F] mr-2" />
                  Cobertura completa
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-[#C69C3F] mr-2" />
                  Planes flexibles
                </li>
              </ul>
              
              <div className="flex items-center text-[#0A4958] hover:text-[#0A6578] transition-colors">
                <span className="font-medium">Cotizar ahora</span>
                <ChevronRight className="w-5 h-5 ml-1" />
              </div>
            </div>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            onClick={() => setSelectedQuoteType('mascotas')}
            className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
          >
            <div className="relative h-48 bg-gradient-to-br from-[#C69C3F] to-[#D5A429] overflow-hidden flex items-center justify-center">
              <div className="bg-white rounded-full p-4 shadow-lg">
                <img 
                  src={productIconUrls.pet} 
                  alt="Icono Mascotas" 
                  className="w-16 h-16 object-contain"
                />
              </div>
            </div>
            
            <div className="p-6">
              <h2 className="text-xl font-bold text-[#0A4958] mb-3">Póliza de Mascotas</h2>
              <p className="text-gray-600 mb-4">
                Protege la salud de tu mejor amigo
              </p>
              
              <ul className="space-y-2 text-sm text-gray-500 mb-6">
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-[#C69C3F] mr-2" />
                  Atención veterinaria
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-[#C69C3F] mr-2" />
                  Emergencias 24/7
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-[#C69C3F] mr-2" />
                  Cuidados preventivos
                </li>
              </ul>
              
              <div className="flex items-center text-[#0A4958] hover:text-[#0A6578] transition-colors">
                <span className="font-medium">Cotizar ahora</span>
                <ChevronRight className="w-5 h-5 ml-1" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            onClick={() => setSelectedQuoteType('hogar')}
            className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
          >
            <div className="relative h-48 bg-gradient-to-br from-[#0A4958] to-[#0A6578] overflow-hidden flex items-center justify-center">
              <div className="bg-white rounded-full p-4 shadow-lg">
                <img 
                  src={productIconUrls.home} 
                  alt="Icono Hogar" 
                  className="w-16 h-16 object-contain"
                />
              </div>
            </div>
            
            <div className="p-6">
              <h2 className="text-xl font-bold text-[#0A4958] mb-3">Póliza de Hogar</h2>
              <p className="text-gray-600 mb-4">
                Protege tu hogar y tus bienes
              </p>
              
              <ul className="space-y-2 text-sm text-gray-500 mb-6">
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-[#C69C3F] mr-2" />
                  Cobertura estructural
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-[#C69C3F] mr-2" />
                  Contenidos incluidos
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-[#C69C3F] mr-2" />
                  Responsabilidad civil
                </li>
              </ul>
              
              <div className="flex items-center text-[#0A4958] hover:text-[#0A6578] transition-colors">
                <span className="font-medium">Cotizar ahora</span>
                <ChevronRight className="w-5 h-5 ml-1" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

    </div>
  );
};

export default PersonalQuotes;