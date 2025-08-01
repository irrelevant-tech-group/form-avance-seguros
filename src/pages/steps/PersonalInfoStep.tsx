import React from 'react';
import { User, Calendar, Map, Phone, Mail } from 'lucide-react';
import { FormSection, SectionIcon, FormInput, FormRadioGroup, PhoneInput } from '../../components/FormComponent';
import { yesNoOptions } from '../../data/FormData';

const PersonalInfoStep = ({ 
  formState, 
  errors, 
  handleInputChange, 
  handleRadioChange, 
  handlePhoneChange 
}) => {
  return (
    <FormSection 
      title="Información del Solicitante" 
      icon={<SectionIcon icon={User} color="blue" />}
      description="Datos personales del propietario del vehículo"
    >
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormInput
          label="Nombre del propietario final"
          name="ownerName"
          value={formState.ownerName}
          onChange={handleInputChange}
          required
          error={errors.ownerName}
        />

        <FormInput
          label="Email"
          name="email"
          type="email"
          icon={<Mail size={18} className="text-gray-500" />}
          value={formState.email}
          onChange={handleInputChange}
          error={errors.email}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormInput
          label="Cédula"
          name="identification"
          value={formState.identification}
          onChange={handleInputChange}
          required
          error={errors.identification}
        />

        <FormInput
          label="Fecha de nacimiento"
          name="birthDate"
          type="date"
          icon={<Calendar size={18} className="text-gray-500" />}
          value={formState.birthDate}
          onChange={handleInputChange}
          required
          error={errors.birthDate}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormInput
          label="Dirección"
          name="address"
          icon={<Map size={18} className="text-gray-500" />}
          value={formState.address}
          onChange={handleInputChange}
          required
          error={errors.address}
        />

        <PhoneInput
          label="Celular"
          name="phone"
          icon={<Phone size={18} className="text-gray-500" />}
          value={formState.phone}
          onChange={handlePhoneChange}
          required
          error={errors.phone}
        />
      </div>
    </FormSection>
  );
};

export default PersonalInfoStep;