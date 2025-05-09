
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FormSection from '@/components/FormSection';
import FormInput from '@/components/FormInput';
import FormSelect from '@/components/FormSelect';
import FormRadioGroup from '@/components/FormRadioGroup';
import FormFileUpload from '@/components/FormFileUpload';
import PhoneInput from '@/components/PhoneInput';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

// Generate years from 2010 to 2025
const years = Array.from({ length: 16 }, (_, i) => {
  const year = 2010 + i;
  return { value: year.toString(), label: year.toString() };
});

const vehicleTypes = [
  { value: 'sedan', label: 'Sedán' },
  { value: 'suv', label: 'SUV / Camioneta' },
  { value: 'hatchback', label: 'Hatchback' },
  { value: 'pickup', label: 'Pickup' },
  { value: 'van', label: 'Van / Furgoneta' },
  { value: 'deportivo', label: 'Deportivo' },
];

const vehicleBrands = [
  { value: 'chevrolet', label: 'Chevrolet' },
  { value: 'mazda', label: 'Mazda' },
  { value: 'renault', label: 'Renault' },
  { value: 'toyota', label: 'Toyota' },
  { value: 'nissan', label: 'Nissan' },
  { value: 'ford', label: 'Ford' },
  { value: 'kia', label: 'Kia' },
  { value: 'hyundai', label: 'Hyundai' },
  { value: 'bmw', label: 'BMW' },
  { value: 'mercedes', label: 'Mercedes-Benz' },
];

const vehicleModels = [
  { value: 'modelo1', label: 'Modelo 1' },
  { value: 'modelo2', label: 'Modelo 2' },
  { value: 'modelo3', label: 'Modelo 3' },
  { value: 'modelo4', label: 'Modelo 4' },
];

const vehicleTrim = [
  { value: 'basico', label: 'Básico' },
  { value: 'intermedio', label: 'Intermedio' },
  { value: 'full', label: 'Full Equipo' },
  { value: 'premium', label: 'Premium' },
];

const transmission = [
  { value: 'automatica', label: 'Automática' },
  { value: 'mecanica', label: 'Mecánica' },
];

const yesNoOptions = [
  { value: 'si', label: 'Sí' },
  { value: 'no', label: 'No' },
];

const QuotePage = () => {
  const navigate = useNavigate();
  const [formState, setFormState] = useState({
    isCollective: 'no',
    ownerName: '',
    identification: '',
    birthDate: '',
    address: '',
    phone: '',
    email: '',
    
    licensePlate: '',
    vehicleType: '',
    brand: '',
    model: '',
    year: '',
    trim: '',
    transmission: '',
    hasLien: 'no',
    invoiceValue: '',
    isNewVehicle: false,
    
    additionalEmail: '',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  const handlePhoneChange = (value: string) => {
    setFormState((prev) => ({
      ...prev,
      phone: value,
    }));
    
    // Clear error when field is edited
    if (errors.phone) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.phone;
        return newErrors;
      });
    }
  };
  
  const handleFileChange = (newFiles: File[]) => {
    setFiles(newFiles);
  };
  
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };
  
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    // Required fields validation
    if (!formState.ownerName) {
      newErrors.ownerName = 'Este campo es obligatorio';
    }
    
    if (!formState.identification) {
      newErrors.identification = 'Este campo es obligatorio';
    }
    
    if (!formState.birthDate) {
      newErrors.birthDate = 'Este campo es obligatorio';
    }
    
    if (!formState.address) {
      newErrors.address = 'Este campo es obligatorio';
    }
    
    if (!formState.phone) {
      newErrors.phone = 'Este campo es obligatorio';
    }
    
    if (formState.email && !/\S+@\S+\.\S+/.test(formState.email)) {
      newErrors.email = 'Correo electrónico inválido';
    }
    
    if (!formState.vehicleType) {
      newErrors.vehicleType = 'Este campo es obligatorio';
    }
    
    if (!formState.brand) {
      newErrors.brand = 'Este campo es obligatorio';
    }
    
    if (!formState.model) {
      newErrors.model = 'Este campo es obligatorio';
    }
    
    if (!formState.year) {
      newErrors.year = 'Este campo es obligatorio';
    }
    
    if (!formState.trim) {
      newErrors.trim = 'Este campo es obligatorio';
    }
    
    if (!formState.transmission) {
      newErrors.transmission = 'Este campo es obligatorio';
    }
    
    if (formState.additionalEmail && !/\S+@\S+\.\S+/.test(formState.additionalEmail)) {
      newErrors.additionalEmail = 'Correo electrónico inválido';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Hay errores en el formulario. Por favor revisa los campos marcados.');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate a random quote ID
      const quoteId = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Redirect to success page with the quote ID
      navigate(`/exito?id=${quoteId}`);
    } catch (error) {
      toast.error('Ocurrió un error al enviar la solicitud. Por favor intenta nuevamente.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-primary-800 mb-2">Cotización de Póliza de Auto</h1>
          <p className="text-gray-600">Completa el formulario para recibir una cotización personalizada</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <FormSection title="Información del Solicitante">
            <FormRadioGroup
              name="isCollective"
              label="¿Deseas cotizar Póliza Colectiva de Autos?"
              options={yesNoOptions}
              value={formState.isCollective}
              onChange={handleRadioChange}
              error={errors.isCollective}
              className="mb-6"
            />
            
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
                label="Cédula"
                name="identification"
                value={formState.identification}
                onChange={handleInputChange}
                required
                error={errors.identification}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput
                label="Fecha de nacimiento"
                name="birthDate"
                type="date"
                value={formState.birthDate}
                onChange={handleInputChange}
                required
                error={errors.birthDate}
              />
              
              <FormInput
                label="Dirección"
                name="address"
                value={formState.address}
                onChange={handleInputChange}
                required
                error={errors.address}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <PhoneInput
                label="Celular"
                name="phone"
                value={formState.phone}
                onChange={handlePhoneChange}
                required
                error={errors.phone}
              />
              
              <FormInput
                label="Email"
                name="email"
                type="email"
                value={formState.email}
                onChange={handleInputChange}
                error={errors.email}
              />
            </div>
          </FormSection>
          
          <FormSection title="Datos del Vehículo">
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
                />
              </div>
              
              <div className="flex items-center mt-8">
                <input
                  type="checkbox"
                  id="isNewVehicle"
                  name="isNewVehicle"
                  checked={formState.isNewVehicle}
                  onChange={handleCheckboxChange}
                  className="w-4 h-4 text-primary-800 border-gray-300 rounded focus:ring-primary-500"
                />
                <label htmlFor="isNewVehicle" className="ml-2 text-sm text-gray-700">
                  Aplica para vehículo 0 km
                </label>
              </div>
            </div>
          </FormSection>
          
          <FormSection title="Documentación Adicional">
            <FormFileUpload
              label="Adjuntar foto de la matrícula y/o copia del seguro actual"
              accept=".jpg,.jpeg,.png,.pdf"
              onChange={handleFileChange}
            />
          </FormSection>
          
          <FormSection title="Confirmación y Contacto" className="mb-10">
            <FormInput
              label="Correo adicional para seguimiento (opcional)"
              name="additionalEmail"
              type="email"
              value={formState.additionalEmail}
              onChange={handleInputChange}
              error={errors.additionalEmail}
            />
          </FormSection>
          
          <div className="flex justify-center mb-10">
            <Button
              type="submit"
              className="bg-secondary hover:bg-secondary-700 text-white font-semibold py-3 px-8 rounded-md text-lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Enviando...' : 'Solicitar Cotización'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuotePage;
