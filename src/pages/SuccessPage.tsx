
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

const SuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [quoteId, setQuoteId] = useState('');
  
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const id = params.get('id');
    
    if (id) {
      setQuoteId(id);
    } else {
      // Generate random ID if none was provided
      setQuoteId(Math.floor(100000 + Math.random() * 900000).toString());
    }
  }, [location]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <div className="flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <CheckCircle size={50} className="text-green-600" />
          </div>
          
          <h1 className="text-2xl font-bold text-primary-800 mb-4">
            ¡Cotización Solicitada Exitosamente!
          </h1>
          
          <p className="text-gray-600 mb-6">
            Revisaremos tu solicitud y te contactaremos pronto
          </p>
          
          <div className="bg-gray-100 rounded-lg p-4 mb-8 w-full">
            <p className="text-sm text-gray-500 mb-1">Número de radicado:</p>
            <p className="text-xl font-semibold text-primary-800">{quoteId}</p>
          </div>
          
          <div className="w-full mb-8">
            <h3 className="font-semibold text-left mb-3 text-primary-800">Próximos pasos:</h3>
            <ol className="space-y-4">
              <li className="flex items-start">
                <div className="bg-primary-100 rounded-full w-6 h-6 flex items-center justify-center text-primary-800 font-medium mr-3 shrink-0">1</div>
                <p className="text-gray-700 text-left">Nuestro equipo revisará la información proporcionada</p>
              </li>
              <li className="flex items-start">
                <div className="bg-primary-100 rounded-full w-6 h-6 flex items-center justify-center text-primary-800 font-medium mr-3 shrink-0">2</div>
                <p className="text-gray-700 text-left">Recibirás un correo electrónico con los detalles de tu cotización</p>
              </li>
              <li className="flex items-start">
                <div className="bg-primary-100 rounded-full w-6 h-6 flex items-center justify-center text-primary-800 font-medium mr-3 shrink-0">3</div>
                <p className="text-gray-700 text-left">Un asesor se pondrá en contacto contigo para resolver cualquier duda</p>
              </li>
            </ol>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
            <Button
              onClick={() => navigate('/')}
              variant="outline"
              className="border-primary-800 text-primary-800 hover:bg-primary-100"
            >
              Volver al inicio
            </Button>
            
            <Button
              variant="outline"
              className="border-secondary text-secondary hover:bg-secondary-100"
            >
              Ver productos relacionados
            </Button>
            
            <Button
              className="bg-secondary hover:bg-secondary-700 text-white"
            >
              Contactar asesor
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;
