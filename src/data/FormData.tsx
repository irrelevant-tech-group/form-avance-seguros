// Generate years from 2010 to 2025
export const years = Array.from({ length: 16 }, (_, i) => {
    const year = 2010 + i;
    return { value: year.toString(), label: year.toString() };
  });
  
  export const vehicleTypes = [
    { value: 'sedan', label: 'Sedán' },
    { value: 'suv', label: 'SUV / Camioneta' },
    { value: 'hatchback', label: 'Hatchback' },
    { value: 'pickup', label: 'Pickup' },
    { value: 'van', label: 'Van / Furgoneta' },
    { value: 'deportivo', label: 'Deportivo' },
  ];
  
  export const vehicleBrands = [
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
  
  export const vehicleModels = [
    { value: 'modelo1', label: 'Modelo 1' },
    { value: 'modelo2', label: 'Modelo 2' },
    { value: 'modelo3', label: 'Modelo 3' },
    { value: 'modelo4', label: 'Modelo 4' },
  ];
  
  export const vehicleTrim = [
    { value: 'basico', label: 'Básico' },
    { value: 'intermedio', label: 'Intermedio' },
    { value: 'full', label: 'Full Equipo' },
    { value: 'premium', label: 'Premium' },
  ];
  
  export const transmission = [
    { value: 'automatica', label: 'Automática' },
    { value: 'mecanica', label: 'Mecánica' },
  ];
  
  export const yesNoOptions = [
    { value: 'si', label: 'Sí' },
    { value: 'no', label: 'No' },
  ];