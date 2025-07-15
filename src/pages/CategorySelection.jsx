// src/components/CategorySelection.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { User, Building2, CheckCircle, ArrowRight, Shield, Zap, DollarSign, Phone } from 'lucide-react';

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
  // Componente SVG de WhatsApp real
  const WhatsAppIcon = ({ size = 18, className = "" }) => (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="currentColor" 
      className={className}
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.085"/>
    </svg>
  );

  return (
    <div className="relative z-10 max-w-6xl mx-auto px-4 py-8">
      <div className="mb-12 text-center">
        
        <motion.h1 
          className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-[#0A4958] via-[#0A5866] to-[#0A6578] bg-clip-text text-transparent leading-tight"
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
          className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed"
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
        className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto mb-12"
      >
        <motion.div
          variants={itemVariants}
          onClick={() => setSelectedCategory('personal')}
          className="group relative bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer transform transition-all duration-500 hover:scale-105 hover:shadow-xl border border-gray-100"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#0A4958] via-[#0A5866] to-[#0A6578] opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full -translate-y-12 translate-x-12 group-hover:scale-150 transition-transform duration-700"></div>
          
          <div className="relative p-6 lg:p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="bg-gradient-to-br from-[#0A4958] to-[#0A6578] rounded-xl p-3 shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                <User size={36} className="text-white" />
              </div>
              <div className="bg-blue-50 rounded-full p-2 group-hover:bg-blue-100 transition-colors duration-300">
                <ArrowRight size={20} className="text-[#0A4958] group-hover:translate-x-1.5 transition-transform duration-300" />
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h2 className="text-2xl lg:text-3xl font-bold text-[#0A4958] mb-2 group-hover:text-[#083a47] transition-colors duration-300">
                  Seguros Personales
                </h2>
                <p className="text-gray-600 text-base leading-relaxed">
                  Protección completa para ti y tu familia. Desde tu auto hasta tu hogar, cuidamos lo que más amas.
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center">
                  <div className="bg-green-100 rounded-full p-1 mr-3">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-gray-700 font-medium text-sm">Seguros de Auto, Salud y Vida</span>
                </div>
                <div className="flex items-center">
                  <div className="bg-green-100 rounded-full p-1 mr-3">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-gray-700 font-medium text-sm">Protección para Mascotas y Hogar</span>
                </div>
                <div className="flex items-center">
                  <div className="bg-green-100 rounded-full p-1 mr-3">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-gray-700 font-medium text-sm">Atención personalizada 24/7</span>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-xl p-3 group-hover:bg-blue-50 transition-colors duration-300">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-xl font-bold text-[#0A4958]">+5K</div>
                    <div className="text-xs text-gray-600">Familias protegidas</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-[#0A4958]">24h</div>
                    <div className="text-xs text-gray-600">Respuesta rápida</div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-[#C69C3F] font-semibold text-base">Comenzar cotización</span>
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
          className="group relative bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer transform transition-all duration-500 hover:scale-105 hover:shadow-xl border border-gray-100"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#C69C3F] via-[#D5A429] to-[#E6B800] opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-full -translate-y-12 translate-x-12 group-hover:scale-150 transition-transform duration-700"></div>
          
          <div className="relative p-6 lg:p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="bg-gradient-to-br from-[#C69C3F] to-[#D5A429] rounded-xl p-3 shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                <Building2 size={36} className="text-white" />
              </div>
              <div className="bg-orange-50 rounded-full p-2 group-hover:bg-orange-100 transition-colors duration-300">
                <ArrowRight size={20} className="text-[#C69C3F] group-hover:translate-x-1.5 transition-transform duration-300" />
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h2 className="text-2xl lg:text-3xl font-bold text-[#0A4958] mb-2 group-hover:text-[#083a47] transition-colors duration-300">
                  Seguros Empresariales
                </h2>
                <p className="text-gray-600 text-base leading-relaxed">
                  Soluciones integrales para proteger tu empresa. Ante diferentes eventos que puedan afectar su continuidad.
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center">
                  <div className="bg-orange-100 rounded-full p-1 mr-3">
                    <CheckCircle className="w-4 h-4 text-orange-600" />
                  </div>
                  <span className="text-gray-700 font-medium text-sm">Perdida o daño de bienes materiales</span>
                </div>
                <div className="flex items-center">
                  <div className="bg-orange-100 rounded-full p-1 mr-3">
                    <CheckCircle className="w-4 h-4 text-orange-600" />
                  </div>
                  <span className="text-gray-700 font-medium text-sm">Afectacion a otros por daños a terceros</span>
                </div>
                <div className="flex items-center">
                  <div className="bg-orange-100 rounded-full p-1 mr-3">
                    <CheckCircle className="w-4 h-4 text-orange-600" />
                  </div>
                  <span className="text-gray-700 font-medium text-sm">Asistencia Empresarial</span>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-xl p-3 group-hover:bg-orange-50 transition-colors duration-300">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-xl font-bold text-[#C69C3F]">TOP</div>
                    <div className="text-xs text-gray-600">Tub aliado en riesgos y tendencias</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-[#C69C3F]">15+</div>
                    <div className="text-xs text-gray-600">Años experiencia</div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-[#C69C3F] font-semibold text-base">Comenzar cotización</span>
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
        className="text-center bg-gradient-to-r from-[#0A4958] to-[#0A6578] rounded-2xl p-8 text-white relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-indigo-600/20"></div>
        <div className="relative z-10">
          <h3 className="text-2xl md:text-3xl font-bold mb-3">
            ¿Necesitas asesoría personalizada?
          </h3>
          <p className="text-lg text-blue-100 mb-6 max-w-xl mx-auto">
            Nuestros expertos están listos para ayudarte a encontrar la protección perfecta
          </p>
          <div className="flex flex-col md:flex-row justify-center gap-4">
            <a
              href="tel:+57300123456"
              className="inline-flex items-center bg-white text-[#0A4958] px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors duration-300 shadow-lg text-sm"
            >
              <Phone size={18} className="mr-2" />
              Llamar ahora: (310)-848-35-62
            </a>
            <a
              href="https://wa.me/573108483562"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center bg-green-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-600 transition-colors duration-300 shadow-lg text-sm"
            >
              <WhatsAppIcon size={18} className="mr-2" />
              WhatsApp
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CategorySelection;