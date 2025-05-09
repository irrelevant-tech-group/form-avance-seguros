import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowRight, Calendar, Phone, Mail, ChevronRight, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
// Componente faltante
import { Clock, Headset } from 'lucide-react';

const SuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [quoteId, setQuoteId] = useState('');
  const [timeLeft, setTimeLeft] = useState(24); // Horas estimadas de respuesta
  
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const id = params.get('id');
    
    if (id) {
      setQuoteId(id);
    } else {
      // Generate random ID if none was provided
      setQuoteId(Math.floor(100000 + Math.random() * 900000).toString());
    }
    
    // Actualizar el contador de tiempo
    const timer = setInterval(() => {
      setTimeLeft(prev => Math.max(0, prev - 1));
    }, 60000); // Actualiza cada minuto
    
    return () => clearInterval(timer);
  }, [location]);

  return (
    <div className="min-h-screen bg-gray-50">
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
      
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Tarjeta principal de éxito */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl shadow-lg overflow-hidden mb-8"
        >
          {/* Cabecera con gradiente */}
          <div className="bg-gradient-to-r from-[#0A4958] to-[#0A6578] py-8 px-6 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ 
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay: 0.2
              }}
              className="w-24 h-24 mx-auto bg-white rounded-full flex items-center justify-center mb-6"
            >
              <CheckCircle size={60} className="text-green-500" />
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-3xl font-bold text-white mb-2"
            >
              ¡Cotización Solicitada Exitosamente!
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-gray-100 text-lg"
            >
              Revisaremos tu solicitud y te contactaremos pronto
            </motion.p>
          </div>
          
          <div className="p-8">
            {/* Número de radicado */}
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 mb-8">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Número de radicado:</p>
                  <p className="text-2xl font-semibold text-[#0A4958]">{quoteId}</p>
                </div>
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
            
            {/* Tiempo estimado de respuesta */}
            <div className="bg-blue-50 rounded-lg p-5 border border-blue-200 mb-8">
              <div className="flex items-start">
                <div className="mr-4 mt-1">
                  <div className="bg-blue-100 rounded-full p-2">
                    <Clock className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-blue-900 mb-1">Tiempo estimado de respuesta</h3>
                  <p className="text-blue-800">
                    Te contactaremos en un máximo de 24 horas hábiles para brindarte tu cotización personalizada.
                  </p>
                  <div className="mt-2 font-medium text-blue-900">
                    Tiempo restante: aproximadamente {timeLeft} {timeLeft === 1 ? 'hora' : 'horas'}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Próximos pasos */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-[#0A4958] mb-4">
                Próximos pasos:
              </h2>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-[#C69C3F] text-white rounded-full w-10 h-10 flex items-center justify-center text-lg font-semibold mr-4 shrink-0">
                    1
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">Análisis de solicitud</h3>
                    <p className="text-gray-600">Nuestro equipo revisará la información proporcionada para encontrar las mejores opciones de cobertura para tu vehículo.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-[#C69C3F] text-white rounded-full w-10 h-10 flex items-center justify-center text-lg font-semibold mr-4 shrink-0">
                    2
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">Envío de cotización</h3>
                    <p className="text-gray-600">Recibirás un correo electrónico con los detalles de tu cotización personalizada, incluyendo coberturas y precios.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-[#C69C3F] text-white rounded-full w-10 h-10 flex items-center justify-center text-lg font-semibold mr-4 shrink-0">
                    3
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">Asesoría personalizada</h3>
                    <p className="text-gray-600">Un asesor especializado se pondrá en contacto contigo para resolver todas tus dudas y ayudarte a elegir la mejor opción.</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Botones de acción */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <Button
                onClick={() => navigate('/')}
                variant="outline"
                className="border-[#0A4958] text-[#0A4958] hover:bg-[#0A4958]/10"
              >
                Volver al inicio
              </Button>
              
              <Button
                onClick={() => navigate('/seguros')}
                variant="outline"
                className="border-[#C69C3F] text-[#C69C3F] hover:bg-[#C69C3F]/10"
              >
                Ver productos relacionados
              </Button>
              
              <Button
                onClick={() => window.location.href = 'tel:+57300123456'}
                className="bg-[#C69C3F] hover:bg-[#b38a33] text-white"
              >
                Contactar asesor
              </Button>
            </div>
            
            {/* Añadir al calendario */}
            <div className="flex justify-center mb-6">
              <button className="flex items-center text-[#0A4958] hover:text-[#083a47] font-medium">
                <Calendar size={18} className="mr-2" />
                <span>Agregar recordatorio al calendario</span>
              </button>
            </div>
          </div>
        </motion.div>
        
        {/* Tarjeta de información adicional */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 mb-8">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-[#0A4958] mb-4">Información Importante</h2>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="mt-1 mr-3 text-[#C69C3F]">
                  <ChevronRight size={18} />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">¿Cómo me contactarán?</h3>
                  <p className="text-gray-600 text-sm">Nos comunicaremos contigo a través del número telefónico o correo electrónico que proporcionaste en el formulario.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="mt-1 mr-3 text-[#C69C3F]">
                  <ChevronRight size={18} />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">¿Qué documentos necesitaré?</h3>
                  <p className="text-gray-600 text-sm">Para la cotización no necesitas documentos adicionales, pero para la emisión de la póliza se requerirá la matrícula del vehículo y tu documento de identidad.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="mt-1 mr-3 text-[#C69C3F]">
                  <ChevronRight size={18} />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">¿Cuándo entra en vigencia la póliza?</h3>
                  <p className="text-gray-600 text-sm">Una vez que selecciones y pagues la póliza, la cobertura comenzará según la fecha que acordemos, generalmente desde las 00:00 horas del día siguiente.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Tarjetas de beneficios */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center mb-3 text-[#0A4958]">
              <Shield size={24} className="mr-2" />
              <h3 className="font-semibold">Cobertura Completa</h3>
            </div>
            <p className="text-gray-600 text-sm">Ofrecemos pólizas con las mejores coberturas para proteger tu vehículo contra todo tipo de riesgos.</p>
          </div>
          
          <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center mb-3 text-[#0A4958]">
              <Clock size={24} className="mr-2" />
              <h3 className="font-semibold">Proceso Rápido</h3>
            </div>
            <p className="text-gray-600 text-sm">Emitimos tu póliza en tiempo récord para que disfrutes de la protección que necesitas sin esperas.</p>
          </div>
          
          <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center mb-3 text-[#0A4958]">
              <Headset size={24} className="mr-2" />
              <h3 className="font-semibold">Soporte 24/7</h3>
            </div>
            <p className="text-gray-600 text-sm">Nuestro equipo de asistencia está disponible las 24 horas para atenderte en caso de emergencia.</p>
          </div>
        </div>
        
        {/* Contacto directo */}
        <div className="text-center">
          <p className="text-gray-600 mb-3">¿Necesitas asistencia inmediata?</p>
          <div className="flex flex-col md:flex-row justify-center space-y-3 md:space-y-0 md:space-x-6">
            <a href="tel:+57300123456" className="flex items-center justify-center text-[#0A4958] hover:text-[#083a47] font-medium">
              <Phone size={18} className="mr-2" />
              <span>+57 300 123 4567</span>
            </a>
            <a href="mailto:contacto@avanceseguros.com" className="flex items-center justify-center text-[#0A4958] hover:text-[#083a47] font-medium">
              <Mail size={18} className="mr-2" />
              <span>contacto@avanceseguros.com</span>
            </a>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6 mt-12">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <img 
                src="https://storage.googleapis.com/cluvi/Imagenes/logo-avance-seguro.jpg" 
                alt="Avance Seguros" 
                className="h-10 mb-2"
              />
              <p className="text-gray-400 text-sm">Tu aliado en protección y tranquilidad</p>
            </div>
            
            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-8 text-center md:text-left">
              <a href="#" className="text-gray-300 hover:text-white transition-colors">Inicio</a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">Seguros</a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">Contacto</a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">Blog</a>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-6 pt-6 text-sm text-gray-400 text-center">
            <p>© {new Date().getFullYear()} Avance Seguros. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};



export default SuccessPage;