// src/components/CategorySelection.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { User, Building2, CheckCircle, ArrowRight, Shield, Zap, DollarSign, Phone, MessageSquare } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  }
};

const CategorySelection = ({ setSelectedCategory }) => {
  return (
    <div className="relative z-10 max-w-7xl mx-auto px-4 py-16">
      <div className="mb-16 text-center">
        
        <motion.h1 
          className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-[#0A4958] via-[#0A5866] to-[#0A6578] bg-clip-text text-transparent leading-tight"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          ¿Qué tipo de protección
          <br />
          <span className="bg-gradient-to-r from-[#C69C3F] to-[#D5A429] bg-clip-text text-transparent">
            necesitas hoy?
          </span>
        </motion.h1>
        
        <motion.p 
          className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Protege lo que más valoras con nuestros seguros personalizados.
          <br />
          <span className="text-[#0A4958] font-semibold">Elige tu categoría y comienza ahora.</span>
        </motion.p>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto mb-20"
      >
        <motion.div
          variants={itemVariants}
          onClick={() => setSelectedCategory('personal')}
          className="group relative bg-white rounded-3xl shadow-xl overflow-hidden cursor-pointer transform transition-all duration-500 hover:scale-105 hover:shadow-2xl border border-gray-100"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#0A4958] via-[#0A5866] to-[#0A6578] opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-700"></div>
          
          <div className="relative p-8 lg:p-12">
            <div className="flex items-center justify-between mb-8">
              <div className="bg-gradient-to-br from-[#0A4958] to-[#0A6578] rounded-2xl p-4 shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                <User size={48} className="text-white" />
              </div>
              <div className="bg-blue-50 rounded-full p-3 group-hover:bg-blue-100 transition-colors duration-300">
                <ArrowRight size={24} className="text-[#0A4958] group-hover:translate-x-1.5 transition-transform duration-300" />
              </div>
            </div>
            
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl lg:text-4xl font-bold text-[#0A4958] mb-3 group-hover:text-[#083a47] transition-colors duration-300">
                  Seguros Personales
                </h2>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Protección completa para ti y tu familia. Desde tu auto hasta tu hogar, cuidamos lo que más amas.
                </p>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center">
                  <div className="bg-green-100 rounded-full p-1 mr-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <span className="text-gray-700 font-medium">Seguros de Auto, Salud y Vida</span>
                </div>
                <div className="flex items-center">
                  <div className="bg-green-100 rounded-full p-1 mr-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <span className="text-gray-700 font-medium">Protección para Mascotas y Hogar</span>
                </div>
                <div className="flex items-center">
                  <div className="bg-green-100 rounded-full p-1 mr-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <span className="text-gray-700 font-medium">Atención personalizada 24/7</span>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-xl p-4 group-hover:bg-blue-50 transition-colors duration-300">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-[#0A4958]">+5K</div>
                    <div className="text-sm text-gray-600">Familias protegidas</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-[#0A4958]">24h</div>
                    <div className="text-sm text-gray-600">Respuesta rápida</div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-[#C69C3F] font-semibold text-lg">Comenzar cotización</span>
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-[#C69C3F] rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-[#C69C3F] rounded-full animate-pulse delay-100"></div>
                  <div className="w-2 h-2 bg-[#C69C3F] rounded-full animate-pulse delay-200"></div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          onClick={() => setSelectedCategory('empresarial')}
          className="group relative bg-white rounded-3xl shadow-xl overflow-hidden cursor-pointer transform transition-all duration-500 hover:scale-105 hover:shadow-2xl border border-gray-100"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#C69C3F] via-[#D5A429] to-[#E6B800] opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-700"></div>
          
          <div className="relative p-8 lg:p-12">
            <div className="flex items-center justify-between mb-8">
              <div className="bg-gradient-to-br from-[#C69C3F] to-[#D5A429] rounded-2xl p-4 shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                <Building2 size={48} className="text-white" />
              </div>
              <div className="bg-orange-50 rounded-full p-3 group-hover:bg-orange-100 transition-colors duration-300">
                <ArrowRight size={24} className="text-[#C69C3F] group-hover:translate-x-1.5 transition-transform duration-300" />
              </div>
            </div>
            
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl lg:text-4xl font-bold text-[#0A4958] mb-3 group-hover:text-[#083a47] transition-colors duration-300">
                  Seguros Empresariales
                </h2>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Soluciones integrales para proteger tu empresa. Desde responsabilidad civil hasta construcción.
                </p>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center">
                  <div className="bg-orange-100 rounded-full p-1 mr-3">
                    <CheckCircle className="w-5 h-5 text-orange-600" />
                  </div>
                  <span className="text-gray-700 font-medium">Responsabilidad Civil y ARL</span>
                </div>
                <div className="flex items-center">
                  <div className="bg-orange-100 rounded-full p-1 mr-3">
                    <CheckCircle className="w-5 h-5 text-orange-600" />
                  </div>
                  <span className="text-gray-700 font-medium">Transporte y Construcción</span>
                </div>
                <div className="flex items-center">
                  <div className="bg-orange-100 rounded-full p-1 mr-3">
                    <CheckCircle className="w-5 h-5 text-orange-600" />
                  </div>
                  <span className="text-gray-700 font-medium">Asesoría especializada</span>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-xl p-4 group-hover:bg-orange-50 transition-colors duration-300">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-[#C69C3F]">+500</div>
                    <div className="text-sm text-gray-600">Empresas confiadas</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-[#C69C3F]">15+</div>
                    <div className="text-sm text-gray-600">Años experiencia</div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-[#C69C3F] font-semibold text-lg">Comenzar cotización</span>
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-[#C69C3F] rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-[#C69C3F] rounded-full animate-pulse delay-100"></div>
                  <div className="w-2 h-2 bg-[#C69C3F] rounded-full animate-pulse delay-200"></div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        className="text-center bg-gradient-to-r from-[#0A4958] to-[#0A6578] rounded-3xl p-12 text-white relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-indigo-600/20"></div>
        <div className="relative z-10">
          <h3 className="text-3xl md:text-4xl font-bold mb-4">
            ¿Necesitas asesoría personalizada?
          </h3>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Nuestros expertos están listos para ayudarte a encontrar la protección perfecta
          </p>
          <div className="flex flex-col md:flex-row justify-center gap-6">
            <a
              href="tel:+57300123456"
              className="inline-flex items-center bg-white text-[#0A4958] px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-colors duration-300 shadow-lg"
            >
              <Phone size={20} className="mr-3" />
              Llamar ahora: (310)-848-35-62
            </a>
            <a
              href="https://wa.me/573108483562"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center bg-green-500 text-white px-8 py-4 rounded-xl font-semibold hover:bg-green-600 transition-colors duration-300 shadow-lg"
            >
              <MessageSquare size={20} className="mr-3" />
              WhatsApp
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CategorySelection;