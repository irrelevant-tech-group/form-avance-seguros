import React from 'react';
import { Car, Building2, AlertCircle } from 'lucide-react';
import { FormSection, SectionIcon, FormInput, FormSelect } from '../../components/FormComponent';
import { 
  vehicleTypes, 
  vehicleBrands, 
  years,
  transmission,
  yesNoOptions
} from '../../data/FormData';

const VehicleInfoStep = ({ 
  formState, 
  errors, 
  handleInputChange, 
  handleCheckboxChange 
}) => {
  // Agregar lienDetails al formState si no existe
  const lienDetails = formState.lienDetails || '';
  
  // Función para manejar cambios en el campo de prenda
  const handleLienDetailsChange = (e) => {
    handleInputChange({
      ...e,
      target: {
        ...e.target,
        name: 'lienDetails'
      }
    });
  };

  return (
    <FormSection 
      title="Datos del Vehículo" 
      icon={<SectionIcon icon={Car} color="emerald" />}
      description="Información específica sobre tu auto"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormInput
          label="Placa del vehículo"
          name="licensePlate"
          value={formState.licensePlate}
          onChange={handleInputChange}
          error={errors.licensePlate}
          placeholder="ABC123"
        />
        
        <FormSelect
          label="Tipo de vehículo"
          name="vehicleType"
          options={vehicleTypes}
          value={formState.vehicleType}
          onChange={handleInputChange}
          required
          error={errors.vehicleType}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormInput
          label="Marca del vehículo"
          name="brand"
          type="text"
          value={formState.brand}
          onChange={handleInputChange}
          required
          error={errors.brand}
        />

        <FormSelect
          label="Año"
          name="year"
          options={years}
          value={formState.year}
          onChange={handleInputChange}
          required
          error={errors.year}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormSelect
          label="Transmisión"
          name="transmission"
          options={transmission}
          value={formState.transmission}
          onChange={handleInputChange}
          required
          error={errors.transmission}
        />
        
        <FormSelect
          label="¿El vehículo tiene o tendrá prenda con alguna entidad?"
          name="hasLien"
          options={yesNoOptions}
          value={formState.hasLien}
          onChange={handleInputChange}
          required
          error={errors.hasLien}
        />
      </div>
      
      {/* Campo condicional para detalles de la prenda */}
      {formState.hasLien === 'si' && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <FormInput
            label="¿Con cuál entidad financiera?"
            name="lienDetails"
            value={lienDetails}
            onChange={handleLienDetailsChange}
            error={errors.lienDetails}
            placeholder="Ejemplo: Banco de Bogotá, Bancolombia, etc."
            icon={<Building2 size={18} className="text-blue-600" />}
            required={formState.hasLien === 'si'}
          />
          <p className="mt-2 text-sm text-blue-700">
            Por favor especifica el nombre de la entidad financiera con la que tiene prenda el vehículo
          </p>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div>
          <FormInput
            label="Valor de la factura"
            name="invoiceValue"
            type="number"
            value={formState.invoiceValue}
            onChange={handleInputChange}
            error={errors.invoiceValue}
            placeholder="Solo aplicable para vehículos 0 km"
            prefix="$"
          />
        </div>
        
       
      </div>
      
      {/* Mensaje informativo cuando se selecciona vehículo 0 km */}
      {formState.isNewVehicle && (
        <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-medium text-green-900">Vehículo 0 km detectado</h4>
              <p className="text-sm text-green-800 mt-1">
                Por favor asegúrate de ingresar el valor de la factura ya que es requerido para vehículos nuevos.
              </p>
            </div>
          </div>
        </div>
      )}
    </FormSection>
  );
};

export default VehicleInfoStep;