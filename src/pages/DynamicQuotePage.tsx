// src/components/DynamicQuotePage.jsx (o MainQuotePage.jsx)
import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';

// Importa tus componentes modularizados
import Navbar from './Navbar';
import CategorySelection from './CategorySelection';
import PersonalQuotes from './PersonalQuotes';
import BusinessQuotes from './BusinessQuotes';

// Componentes para cada tipo de cotización (asegúrate de que existan)
import HealthQuoteForm from './HealthQuoteForm';
import VehicleQuoteForm from './VehicleQuoteForm';
import LifeQuoteForm from './LifeQuoteForm';
import PetQuoteForm from './PetQuoteForm';
import HomeQuoteForm from './HomeQuoteForm';
import BusinessQuoteForm from './BusinessQuoteForm'; // Asumo que este maneja los distintos tipos empresariales por prop

const DynamicQuotePage = () => {
  const [selectedCategory, setSelectedCategory] = useState(null); // 'personal' o 'empresarial'
  const [selectedQuoteType, setSelectedQuoteType] = useState(null); // Ej: 'vehiculos', 'salud', 'corporativos', etc.

  const handleBackButtonClick = () => {
    if (selectedQuoteType) {
      setSelectedQuoteType(null);
    } else if (selectedCategory) {
      setSelectedCategory(null);
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 min-h-screen relative overflow-hidden">
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 -right-4 w-72 h-72 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full opacity-30 blur-3xl"></div>
        <div className="absolute top-1/3 -left-8 w-96 h-96 bg-gradient-to-br from-[#C69C3F]/20 to-yellow-100 rounded-full opacity-40 blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full opacity-30 blur-3xl"></div>
      </div>

      <Navbar />

      {/* Contenido principal */}
      <div className="relative z-10">
        {!selectedCategory && (
          <CategorySelection setSelectedCategory={setSelectedCategory} />
        )}

        {selectedCategory && !selectedQuoteType && (
          <div className="bg-gray-50 min-h-screen">
             <div className="max-w-5xl mx-auto px-4 py-4">
                
              </div>
            {selectedCategory === 'personal' ? (
              <PersonalQuotes setSelectedQuoteType={setSelectedQuoteType} setSelectedCategory={setSelectedCategory} />
            ) : (
              <BusinessQuotes setSelectedQuoteType={setSelectedQuoteType} setSelectedCategory={setSelectedCategory} />
            )}
          </div>
        )}

        {selectedQuoteType && (
          <div className="bg-gray-50 min-h-screen">
             <div className="max-w-5xl mx-auto px-4 py-4">
                <button
                  onClick={handleBackButtonClick}
                  className="flex items-center text-sm text-gray-600 hover:text-[#0A4958] transition-colors"
                >
                  <ChevronRight className="w-4 h-4 mr-1 transform rotate-180" />
                  {selectedCategory === 'empresarial' ? 'Volver a seguros empresariales' : 'Volver a seguros personales'}
                </button>
              </div>
            <div className="max-w-5xl mx-auto px-4 pb-12">
              {selectedCategory === 'personal' ? (
                selectedQuoteType === 'vehiculos' ? (
                  <VehicleQuoteForm />
                ) : selectedQuoteType === 'salud' ? (
                  <HealthQuoteForm />
                ) : selectedQuoteType === 'vida' ? (
                  <LifeQuoteForm />
                ) : selectedQuoteType === 'mascotas' ? (
                  <PetQuoteForm />
                ) : (
                  <HomeQuoteForm />
                )
              ) : (
                <BusinessQuoteForm quoteType={selectedQuoteType} />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DynamicQuotePage;