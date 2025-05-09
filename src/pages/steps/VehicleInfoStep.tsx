import React from 'react';
import { Car } from 'lucide-react';
import { FormSection, SectionIcon, FormInput, FormSelect } from '../../components/FormComponent';
import { 
  vehicleTypes, 
  vehicleBrands, 
  vehicleModels, 
  years, 
  vehicleTrim, 
  transmission, 
  yesNoOptions 
} from '../../data/FormData';

const VehicleInfoStep = ({ 
  formState, 
  errors, 
  handleInputChange, 
  handleCheckboxChange 
}) => {
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
        <FormSelect
          label="Marca"
          name="brand"
          options={vehicleBrands}
          value={formState.brand}
          onChange={handleInputChange}
          required
          error={errors.brand}
        />
        
        <FormSelect
          label="Modelo"
          name="model"
          options={vehicleModels}
          value={formState.model}
          onChange={handleInputChange}
          required
          error={errors.model}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormSelect
          label="Año"
          name="year"
          options={years}
          value={formState.year}
          onChange={handleInputChange}
          required
          error={errors.year}
        />
        
        <FormSelect
          label="Corte"
          name="trim"
          options={vehicleTrim}
          value={formState.trim}
          onChange={handleInputChange}
          required
          error={errors.trim}
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <FormInput
            label="Valor de la factura"
            name="invoiceValue"
            type="number"
            value={formState.invoiceValue}
            onChange={handleInputChange}
            error={errors.invoiceValue}
            placeholder="0"
            prefix="$"
          />
        </div>
        
        <div className="flex items-center mt-8">
          <input
            type="checkbox"
            id="isNewVehicle"
            name="isNewVehicle"
            checked={formState.isNewVehicle}
            onChange={handleCheckboxChange}
            className="w-5 h-5 text-primary-800 border-gray-300 rounded focus:ring-primary-500"
          />
          <label htmlFor="isNewVehicle" className="ml-2 text-gray-700">
            Aplica para vehículo 0 km
          </label>
        </div>
      </div>
    </FormSection>
  );
};

export default VehicleInfoStep;