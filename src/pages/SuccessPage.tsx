import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowRight, Calendar, Phone, Mail, ChevronRight, Shield, Clock, Headset, Download, Share2, Car, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

const SuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [quoteId, setQuoteId] = useState('');
  const [quoteType, setQuoteType] = useState('vehiculos');
  const [timeLeft, setTimeLeft] = useState(24); // Horas estimadas de respuesta
  const [showAnimatedLogo, setShowAnimatedLogo] = useState(true);
  
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const id = params.get('id');
    const type = params.get('type') || 'vehiculos';
    
    if (id) {
      setQuoteId(id);
    } else {
      // Generate random ID if none was provided
      setQuoteId(Math.floor(100000 + Math.random() * 900000).toString());
    }
    
    setQuoteType(type);
    
    // Actualizar el contador de tiempo
    const timer = setInterval(() => {
      setTimeLeft(prev => Math.max(0, prev - 1));
    }, 60000); // Actualiza cada minuto
    
    // Cambiar a logo estático después de 4 segundos (tiempo suficiente para la animación)
    const logoTimer = setTimeout(() => {
      setShowAnimatedLogo(false);
    }, 4000);
    
    return () => {
      clearInterval(timer);
      clearTimeout(logoTimer);
    };
  }, [location]);

  // Función para descargar el resumen de cotización
  const downloadQuoteSummary = () => {
    // Crear contenido del resumen
    const content = `
      RESUMEN DE COTIZACIÓN
      ---------------------
      Número de Referencia: ${quoteId}
      Tipo de Seguro: ${quoteType === 'vehiculos' ? 'Póliza de Auto' : quoteType === 'vida' ? 'Póliza de Vida' : 'Póliza de Salud'}
      Fecha de Solicitud: ${new Date().toLocaleDateString('es-CO', { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })}
      
      Estado: En proceso
      Tiempo estimado: Máximo 24 horas hábiles
      
      Contacto:
      Tel: +57 300 123 4567
      Email: contacto@avanceseguros.com
      
      Avance Seguros - Tu aliado en protección
    `;
    
    const element = document.createElement('a');
    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `cotizacion-${quoteId}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Función para compartir
  const shareQuote = async () => {
    const url = window.location.href;
    const text = `¡He solicitado una cotización de ${quoteType === 'vehiculos' ? 'seguro de auto' : quoteType === 'vida' ? 'seguro de vida' : 'seguro de salud'} con Avance Seguros! Número de referencia: ${quoteId}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Cotización de ${quoteType === 'vehiculos' ? 'Seguro de Auto' : quoteType === 'vida' ? 'Seguro de Vida' : 'Seguro de Salud'}`,
          text: text,
          url: url,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      // Fallback para navegadores que no soportan la API de compartir
      navigator.clipboard.writeText(`${text} ${url}`);
      alert('Información copiada al portapapeles');
    }
  };

  // Contenido específico según el tipo de seguro
  const getQuoteTypeContent = () => {
    if (quoteType === 'vida') {
      return {
        icon: <Shield size={60} className="text-green-500" />,
        title: 'Tu futuro está asegurado',
        subtitle: 'Estamos preparando la mejor cotización para proteger a ti y a tu familia',
        steps: [
          {
            step: 1,
            title: "Análisis de protección",
            description: "Revisaremos tu información para encontrar las mejores opciones de cobertura de vida que se adapten a tus necesidades."
          },
          {
            step: 2,
            title: "Opciones de protección",
            description: "Recibirás una cotización detallada con diferentes planes de vida diseñados para brindar seguridad a tu familia."
          },
          {
            step: 3,
            title: "Asesoría personalizada",
            description: "Un especialista en seguros de vida te contactará para explicarte todos los beneficios y coberturas disponibles."
          }
        ]
      };
    } else if (quoteType === 'vehiculos') {
      return {
        icon: <Car size={60} className="text-green-500" />,
        title: 'Tu vehículo está en buenas manos',
        subtitle: 'Estamos preparando la mejor cotización para proteger tu auto',
        steps: [
          {
            step: 1,
            title: "Análisis del vehículo",
            description: "Nuestro equipo revisará la información de tu vehículo para encontrar las mejores opciones de cobertura disponibles en el mercado."
          },
          {
            step: 2,
            title: "Cotización personalizada",
            description: "Recibirás un correo electrónico con los detalles de tu cotización, incluyendo diferentes planes y coberturas."
          },
          {
            step: 3,
            title: "Asesoría especializada",
            description: "Un asesor especializado en seguros de auto se contactará contigo para resolver tus dudas y ayudarte a elegir."
          }
        ]
      };
    } else {
      return {
        icon: <Heart size={60} className="text-green-500" />,
        title: 'Tu salud es nuestra prioridad',
        subtitle: 'Estamos preparando la mejor cotización para cuidar de ti y tu familia',
        steps: [
          {
            step: 1,
            title: "Análisis médico",
            description: "Revisaremos tu información médica para encontrar las mejores opciones de cobertura de salud según tus necesidades."
          },
          {
            step: 2,
            title: "Planes de salud",
            description: "Recibirás una cotización detallada con diferentes planes de salud que se adapten a tu perfil y presupuesto."
          },
          {
            step: 3,
            title: "Asesoría médica",
            description: "Un asesor especializado en seguros de salud te contactará para explicarte todos los beneficios y coberturas."
          }
        ]
      };
    }
  };

  const quoteContent = getQuoteTypeContent();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header con gradiente y logo/gif */}
      <div className="bg-gradient-to-r from-[#0A4958] to-[#0A6578] py-4 px-4 shadow-md relative overflow-hidden">
        <div className="max-w-5xl mx-auto flex justify-between items-center relative z-10">
          <div className="flex items-center">
            {showAnimatedLogo ? (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="relative"
              >
                <img
                  src="https://storage.googleapis.com/cluvi/Imagenes/animacion-avance-seguros-unscreen.gif"
                  alt="Animación Avance Seguros"
                  className="h-12 md:h-16"
                  style={{ mixBlendMode: 'normal' }}
                />
              </motion.div>
            ) : (
              <motion.img
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                src="https://storage.googleapis.com/cluvi/Imagenes/logo-avance-seguro.jpg"
                alt="Avance Seguros"
                className="h-12 md:h-16"
              />
            )}
          </div>
         
        </div>
        
        {/* Partículas animadas de fondo */}
        <motion.div 
          className="absolute inset-0 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
        >
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white/20 rounded-full"
              initial={{
                x: `${Math.random() * 100}%`,
                y: "100%",
              }}
              animate={{
                y: "-10%",
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: Math.random() * 3 + 5,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </motion.div>
      </div>
      
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Tarjeta principal de éxito con animaciones mejoradas */}
        <motion.div 
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="bg-white rounded-xl shadow-lg overflow-hidden mb-8"
        >
          {/* Cabecera con gradiente y animaciones */}
          <div className="bg-gradient-to-r from-[#0A4958] to-[#0A6578] py-8 px-6 text-center relative overflow-hidden">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ 
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay: 0.3
              }}
              className="w-24 h-24 mx-auto bg-white rounded-full flex items-center justify-center mb-6 relative z-10"
            >
              {quoteContent.icon}
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="text-3xl font-bold text-white mb-2"
            >
              ¡Cotización Solicitada Exitosamente!
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="text-gray-100 text-lg"
            >
              {quoteContent.subtitle}
            </motion.p>
            
            {/* Efecto de confetti */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="absolute inset-0 overflow-hidden"
            >
              {[...Array(30)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-3 h-8 rounded"
                  style={{
                    background: `hsl(${Math.random() * 360}, 70%, 70%)`,
                    left: `${Math.random() * 100}%`,
                    top: "-10%",
                  }}
                  animate={{
                    y: "120%",
                    rotate: Math.random() * 720 - 360,
                    opacity: [1, 0],
                  }}
                  transition={{
                    duration: Math.random() * 2 + 2,
                    delay: Math.random() * 2,
                    ease: "easeIn",
                  }}
                />
              ))}
            </motion.div>
          </div>
          
          <div className="p-8">
            {/* Número de radicado y acciones rápidas */}
            <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-lg p-6 border border-gray-200 mb-8">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Número de radicado:</p>
                  <p className="text-2xl font-bold text-[#0A4958] font-mono">{quoteId}</p>
                  <div className="mt-4 md:mt-0">
                    <p className="text-sm text-gray-500 mb-1">Fecha de solicitud:</p>
                    <p className="font-medium">{new Date().toLocaleDateString('es-CO', { 
                      day: 'numeric', 
                      month: 'long', 
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}</p>
                  </div>
                </div>
               
              </div>
            </div>
            
            {/* Tiempo estimado con progreso visual */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-5 border border-blue-200 mb-8">
              <div className="flex items-start">
                <div className="mr-4 mt-1">
                  <div className="bg-blue-100 rounded-full p-2">
                    <Clock className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-blue-900 mb-1">Tiempo estimado de respuesta</h3>
                  <p className="text-blue-800">
                    Te contactaremos en un máximo de 24 horas hábiles para brindarte tu cotización personalizada.
                  </p>
                  <div className="mt-3 relative">
                    <div className="flex justify-between text-sm text-blue-700 mb-2">
                      <span>Procesando...</span>
                      <span className="font-medium">{timeLeft} {timeLeft === 1 ? 'hora' : 'horas'}</span>
                    </div>
                    <div className="w-full bg-blue-100 rounded-full h-2">
                      <motion.div
                        className="bg-blue-600 h-2 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(((24 - timeLeft) / 24) * 100, 100)}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Próximos pasos con animación stagger */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-[#0A4958] mb-4">
                Próximos pasos:
              </h2>
              <motion.div 
                className="space-y-6"
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.2
                    }
                  }
                }}
              >
                {quoteContent.steps.map((item) => (
                  <motion.div
                    key={item.step}
                    variants={{
                      hidden: { opacity: 0, x: -50 },
                      visible: { opacity: 1, x: 0 }
                    }}
                    className="flex items-start"
                  >
                    <motion.div 
                      className="bg-[#C69C3F] text-white rounded-full w-10 h-10 flex items-center justify-center text-lg font-semibold mr-4 shrink-0"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {item.step}
                    </motion.div>
                    <div>
                      <h3 className="font-medium text-gray-900 mb-1">{item.title}</h3>
                      <p className="text-gray-600">{item.description}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </motion.div>
        
        {/* Contacto directo */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.5 }}
          className="text-center"
        >
          <p className="text-gray-600 mb-3">¿Necesitas asistencia inmediata?</p>
          <div className="flex flex-col md:flex-row justify-center space-y-3 md:space-y-0 md:space-x-6">
            <motion.a 
              href="tel:+57300123456" 
              className="flex items-center justify-center text-[#0A4958] hover:text-[#083a47] font-medium"
              whileHover={{ scale: 1.05 }}
            >
              <Phone size={18} className="mr-2" />
              <span>+57 300 123 4567</span>
            </motion.a>
            <motion.a 
              href="mailto:contacto@avanceseguros.com" 
              className="flex items-center justify-center text-[#0A4958] hover:text-[#083a47] font-medium"
              whileHover={{ scale: 1.05 }}
            >
              <Mail size={18} className="mr-2" />
              <span>contacto@avanceseguros.com</span>
            </motion.a>
          </div>
        </motion.div>
      </div>
      
    </div>
  );
};

export default SuccessPage;