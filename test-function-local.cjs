const axios = require('axios');

// Datos de prueba para diferentes tipos de cotización
const testData = {
  personal: {
    formData: {
      nombreCompleto: "Juan Pérez",
      tipoDocumento: "CC",
      numeroDocumento: "12345678",
      celular: "3001234567",
      email: "juan.perez@test.com",
      fechaNacimiento: "1990-05-15",
      sufreEnfermedad: "no"
    },
    quoteId: `TEST-PERSONAL-${Date.now()}`,
    quoteType: "vida",
    userEmail: "juan.perez@test.com",
    isBusinessQuote: false
  },
  vehiculo: {
    formData: {
      ownerName: "María González",
      identification: "87654321",
      phone: "3009876543",
      email: "maria.gonzalez@test.com",
      address: "Carrera 7 # 123-45",
      brand: "Toyota",
      model: "Corolla",
      year: "2020",
      vehicleType: "Sedan",
      transmission: "Automática",
      hasLien: "no",
      licensePlate: "ABC123"
    },
    quoteId: `TEST-VEHICULO-${Date.now()}`,
    quoteType: "vehiculos",
    userEmail: "maria.gonzalez@test.com",
    isBusinessQuote: false
  },
  empresarial: {
    formData: {
      nombreContacto: "Carlos Silva",
      nit: "900123456-1",
      razonSocial: "Empresa Test S.A.S.",
      direccion: "Calle 100 # 50-25",
      telefono: "3105555555",
      correoElectronico: "carlos.silva@empresatest.com",
      objetoSocial: "Servicios de consultoría",
      personaContacto: "Carlos Silva",
      representanteLegal: "Carlos Silva",
      mensajeAdicional: "Cotización de prueba para seguro empresarial"
    },
    quoteId: `TEST-EMPRESA-${Date.now()}`,
    quoteType: "corporativos",
    userEmail: "carlos.silva@empresatest.com",
    isBusinessQuote: true
  },
  salud: {
    formData: {
      nombreCompleto: "Ana Rodríguez",
      tipoDocumento: "CC",
      numeroDocumento: "98765432",
      celular: "3012345678",
      email: "ana.rodriguez@test.com",
      fechaNacimiento: "1985-03-20",
      sufreEnfermedad: "si",
      cualEnfermedad: "Hipertensión controlada"
    },
    quoteId: `TEST-SALUD-${Date.now()}`,
    quoteType: "salud",
    userEmail: "ana.rodriguez@test.com",
    isBusinessQuote: false
  },
  mascotas: {
    formData: {
      nombreCompleto: "Pedro López",
      tipoDocumento: "CC",
      numeroDocumento: "11223344",
      celular: "3009988776",
      email: "pedro.lopez@test.com",
      nombreMascota: "Max",
      tipoMascota: "Perro",
      razaMascota: "Golden Retriever",
      edadMascota: "3 años"
    },
    quoteId: `TEST-MASCOTAS-${Date.now()}`,
    quoteType: "mascotas",
    userEmail: "pedro.lopez@test.com",
    isBusinessQuote: false
  }
};

async function testNetlifyFunction(testType = 'personal', functionUrl = 'http://localhost:8888/.netlify/functions/send-quote-email') {
  console.log(`🧪 Probando función de ${testType} con datos de prueba...`);
  console.log(`📍 URL: ${functionUrl}`);
  
  const data = testData[testType];
  
  if (!data) {
    console.error('❌ Tipo de prueba no válido. Usa: personal, vehiculo, o empresarial');
    return;
  }

  try {
    console.log('📤 Enviando datos...');
    console.log('Datos enviados:', {
      quoteId: data.quoteId,
      quoteType: data.quoteType,
      isBusinessQuote: data.isBusinessQuote,
      contactName: data.isBusinessQuote ? data.formData.nombreContacto : (data.formData.nombreCompleto || data.formData.ownerName)
    });

    const response = await axios.post(functionUrl, data, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 30000 // 30 segundos timeout
    });

    console.log('✅ Respuesta exitosa:');
    console.log('Status:', response.status);
    console.log('Respuesta:', JSON.stringify(response.data, null, 2));
    
    // Verificar qué funcionó
    if (response.data.adminEmailId) {
      console.log('✅ Correo al administrador enviado');
    }
    if (response.data.userEmailId) {
      console.log('✅ Correo al usuario enviado');
    }
    if (response.data.sheetsSuccess) {
      console.log('✅ Datos guardados en Google Sheets');
    } else {
      console.log('⚠️ Falló el guardado en Google Sheets');
    }

  } catch (error) {
    console.error('❌ Error en la prueba:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Error data:', error.response.data);
    } else if (error.request) {
      console.error('No se recibió respuesta del servidor');
      console.error('¿Está corriendo `netlify dev`?');
    } else {
      console.error('Error:', error.message);
    }
  }
}

// Script principal
async function runTests() {
  console.log('🚀 Iniciando pruebas de la función de Netlify...');
  console.log('⚠️  Asegúrate de que `netlify dev` esté corriendo en otra terminal\n');

  const testType = process.argv[2] || 'personal';
  
  console.log('Tipos de prueba disponibles:');
  console.log('- personal: Prueba cotización personal (vida/salud) -> jpgomez@stayirrelevant.com');
  console.log('- vehiculo: Prueba cotización de vehículo (auto) -> jpgomez@stayirrelevant.com');
  console.log('- empresarial: Prueba cotización empresarial -> juanpablog857@gmail.com + CC jpgomez@stayirrelevant.com');
  console.log('- salud: Prueba cotización de salud -> jpgomez@stayirrelevant.com');
  console.log('- mascotas: Prueba cotización de mascotas -> jpgomez@stayirrelevant.com');
  console.log('');

  if (testType === 'all') {
    console.log('🧪 Ejecutando todas las pruebas...\n');
    
    const testTypes = ['personal', 'vehiculo', 'empresarial'];
    for (const type of testTypes) {
      console.log(`\n--- Probando ${type.toUpperCase()} ---`);
      await testNetlifyFunction(type);
      await new Promise(resolve => setTimeout(resolve, 2000)); // Esperar 2 segundos entre pruebas
    }
  } else {
    await testNetlifyFunction(testType);
  }
}

// Instalar axios si no está disponible
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = { testNetlifyFunction, testData };