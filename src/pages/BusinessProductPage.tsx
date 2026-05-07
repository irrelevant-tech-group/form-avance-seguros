import React from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { ChevronRight, Mail, Phone } from 'lucide-react';

import BusinessQuoteForm from './BusinessQuoteForm';

const BUSINESS_PRODUCTS = [
  'corporativos',
  'responsabilidad-civil',
  'transporte',
  'construccion',
  'cumplimiento',
  'arl',
  'ciberseguridad',
] as const;

const BusinessProductPage = () => {
  const navigate = useNavigate();
  const { product } = useParams<{ product: string }>();

  if (!product || !BUSINESS_PRODUCTS.includes(product as typeof BUSINESS_PRODUCTS[number])) {
    return <Navigate to="/empresariales" replace />;
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-gradient-to-r from-[#0A4958] to-[#0A6578] py-4 px-4 shadow-md">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <img
            src="https://storage.googleapis.com/cluvi/Imagenes/logo_avance_blanco.png"
            alt="Avance Seguros"
            className="h-12 md:h-16 cursor-pointer"
            onClick={() => navigate('/')}
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

      <div className="max-w-5xl mx-auto px-4 py-4">
        <button
          onClick={() => navigate('/empresariales')}
          className="flex items-center text-sm text-gray-600 hover:text-[#0A4958] transition-colors"
        >
          <ChevronRight className="w-4 h-4 mr-1 transform rotate-180" />
          Volver a seguros empresariales
        </button>
      </div>

      <div className="max-w-5xl mx-auto px-4 pb-12">
        <BusinessQuoteForm quoteType={product} />
      </div>
    </div>
  );
};

export default BusinessProductPage;
