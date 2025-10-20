import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Phone, ArrowRight, User, Building2 } from 'lucide-react';

// Animaciones para las secciones
const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

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

const DynamicQuotePage = () => {
  const navigate = useNavigate();

  return (
      <div className="bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 min-h-screen relative overflow-hidden">
        {/* Elementos decorativos de fondo */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-4 -right-4 w-72 h-72 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full opacity-30 blur-3xl"></div>
          <div className="absolute top-1/3 -left-8 w-96 h-96 bg-gradient-to-br from-[#C69C3F]/20 to-yellow-100 rounded-full opacity-40 blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full opacity-30 blur-3xl"></div>
        </div>

        {/* Header mejorado con gradiente y logo */}
        <div className="relative z-10 bg-gradient-to-r from-[#0A4958] via-[#0A5866] to-[#0A6578] py-4 px-4 shadow-lg">
      <div className="max-w-7xl mx-auto flex justify-center md:justify-start">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <img
            src="https://storage.googleapis.com/cluvi/Imagenes/logo_avance_blanco.png"
            alt="Avance Seguros"
            className="h-12 md:h-16 drop-shadow-md"
          />
        </motion.div>
      </div>
    </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-16">
          {/* Título principal mejorado */}
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
            
          </div>

          {/* Selección Personal vs Empresarial mejorada */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto mb-20"
          >
            {/* Opción Personal */}
            <motion.div
              variants={itemVariants}
              onClick={() => navigate('/personales')}
              className="group relative bg-white rounded-3xl shadow-xl overflow-hidden cursor-pointer transform transition-all duration-500 hover:scale-105 hover:shadow-2xl border border-gray-100"
            >
              {/* Gradiente de fondo */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#0A4958] via-[#0A5866] to-[#0A6578] opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
              
              {/* Elemento decorativo */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-700"></div>
              
              <div className="relative p-8 lg:p-12">
                {/* Icono principal */}
                <div className="flex items-center justify-between mb-8">
                  <div className="bg-gradient-to-br from-[#0A4958] to-[#0A6578] rounded-2xl p-4 shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                    <User size={48} className="text-white" />
                  </div>
                  <div className="bg-blue-50 rounded-full p-3 group-hover:bg-blue-100 transition-colors duration-300">
                    <ArrowRight size={24} className="text-[#0A4958] group-hover:translate-x-1-5 transition-transform duration-300" />
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h2 className="text-3xl lg:text-4xl font-bold text-[#0A4958] mb-3 group-hover:text-[#083a47] transition-colors duration-300">
                      Seguros Personales
                    </h2>
                    <p className="text-gray-600 text-lg leading-relaxed">
                      Protección completa para ti y tu familia. Cuidamos lo que más valoras.
                    </p>
                  </div>
                  
                  {/* Lista de beneficios */}
                  
                  
                  {/* Estadísticas */}
                 
                  
                  <div className="flex items-center justify-between">
                    <span className="text-[#C69C3F] font-semibold text-lg">Solicitar Cotizacion</span>
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-[#C69C3F] rounded-full animate-pulse"></div>
                      <div className="w-2 h-2 bg-[#C69C3F] rounded-full animate-pulse delay-100"></div>
                      <div className="w-2 h-2 bg-[#C69C3F] rounded-full animate-pulse delay-200"></div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Opción Empresarial */}
            <motion.div
              variants={itemVariants}
              onClick={() => navigate('/empresariales')}
              className="group relative bg-white rounded-3xl shadow-xl overflow-hidden cursor-pointer transform transition-all duration-500 hover:scale-105 hover:shadow-2xl border border-gray-100"
            >
              {/* Gradiente de fondo */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#C69C3F] via-[#D5A429] to-[#E6B800] opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
              
              {/* Elemento decorativo */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-700"></div>
              
              <div className="relative p-8 lg:p-12">
                {/* Icono principal */}
                <div className="flex items-center justify-between mb-8">
                  <div className="bg-gradient-to-br from-[#C69C3F] to-[#D5A429] rounded-2xl p-4 shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                    <Building2 size={48} className="text-white" />
                  </div>
                  <div className="bg-orange-50 rounded-full p-3 group-hover:bg-orange-100 transition-colors duration-300">
                    <ArrowRight size={24} className="text-[#C69C3F] group-hover:translate-x-1-5 transition-transform duration-300" />
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h2 className="text-3xl lg:text-4xl font-bold text-[#0A4958] mb-3 group-hover:text-[#083a47] transition-colors duration-300">
                      Seguros Empresariales
                    </h2>
                    <p className="text-gray-600 text-lg leading-relaxed">
                      Soluciones integrales para que tu empresa siga avanzando.
                    </p>
                  </div>
                  
                  {/* Lista de beneficios */}
                  
                  
                  {/* Estadísticas */}
                  
                  
                  <div className="flex items-center justify-between">
                    <span className="text-[#C69C3F] font-semibold text-lg">Solicitar Cotizacion</span>
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

          {/* Sección de confianza mejorada */}

          {/* Call to action adicional */}
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
            Nuestros expertos están listos para ayudarte a encontrar la protección ideal
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
      </div>
    );
};

export default DynamicQuotePage;
