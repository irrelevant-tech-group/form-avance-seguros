const { Resend } = require('resend');
const { google } = require('googleapis');

// Inicializar Resend con la API key
const resend = new Resend(process.env.RESEND_API_KEY);

// Clase para manejar Google Sheets
class GoogleSheetsService {
  constructor() {
    try {
      console.log('🔄 Inicializando GoogleSheetsService...');
      
      // Priorizar variables de entorno para compatibilidad con Netlify
      let auth;
      
      // Método 1: Credenciales desde Base64 (PRIORIDAD en producción)
      if (process.env.GOOGLE_CREDENTIALS_BASE64) {
        console.log('🔑 Usando credenciales desde Base64 (producción)...');
        
        try {
          // Decodificar las credenciales desde base64
          const credentialsJson = Buffer.from(process.env.GOOGLE_CREDENTIALS_BASE64, 'base64').toString('utf-8');
          const credentials = JSON.parse(credentialsJson);
          
          console.log('📋 Credenciales decodificadas exitosamente:', {
            hasType: !!credentials.type,
            hasProjectId: !!credentials.project_id,
            hasClientEmail: !!credentials.client_email,
            hasPrivateKey: !!credentials.private_key,
            clientEmail: credentials.client_email?.substring(0, 30) + '...'
          });
          
          auth = new google.auth.GoogleAuth({
            credentials: credentials,
            scopes: [
              'https://www.googleapis.com/auth/spreadsheets',
              'https://www.googleapis.com/auth/drive.file'
            ],
          });
          
        } catch (decodeError) {
          console.error('❌ Error decodificando credenciales desde base64:', decodeError.message);
          throw new Error(`Error al decodificar credenciales base64: ${decodeError.message}`);
        }
        
      } else if (process.env.GOOGLE_CLIENT_EMAIL && process.env.GOOGLE_PRIVATE_KEY) {
        // Método 2: Variables individuales (fallback)
        console.log('🔑 Usando autenticación con variables individuales (fallback)...');
        console.log('📋 Variables detectadas:', {
          hasClientEmail: !!process.env.GOOGLE_CLIENT_EMAIL,
          hasPrivateKey: !!process.env.GOOGLE_PRIVATE_KEY,
          hasSheetId: !!process.env.GOOGLE_SHEET_ID,
          clientEmail: process.env.GOOGLE_CLIENT_EMAIL?.substring(0, 20) + '...'
        });
        
        // Limpiar y formatear la clave privada correctamente
        let privateKey = process.env.GOOGLE_PRIVATE_KEY;
        
        if (!privateKey.includes('BEGIN PRIVATE KEY')) {
          throw new Error('Formato de clave privada inválido en variables de entorno');
        }
        
        // Múltiples intentos de limpieza de la clave
        privateKey = privateKey
          .replace(/\\n/g, '\n')
          .replace(/"/g, '')
          .replace(/'/g, '')
          .trim();
        
        // Si la clave no termina con newline, agregarlo
        if (!privateKey.endsWith('\n')) {
          privateKey += '\n';
        }
        
        const credentials = {
          type: 'service_account',
          project_id: 'cluvi-392522',
          client_email: process.env.GOOGLE_CLIENT_EMAIL,
          private_key: privateKey,
          private_key_id: '7cf71e0f248e4fc9aad9667ba78a561bdd284796',
          client_id: '100439673911701332394',
          auth_uri: 'https://accounts.google.com/o/oauth2/auth',
          token_uri: 'https://oauth2.googleapis.com/token',
          auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
          client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${encodeURIComponent(process.env.GOOGLE_CLIENT_EMAIL)}`,
          universe_domain: 'googleapis.com'
        };
        
        auth = new google.auth.GoogleAuth({
          credentials: credentials,
          scopes: [
            'https://www.googleapis.com/auth/spreadsheets',
            'https://www.googleapis.com/auth/drive.file'
          ],
        });
        
      } else {
        // Método 3: Fallback a archivo de credenciales (solo desarrollo local)
        console.log('⚠️ Variables de entorno no encontradas, intentando con archivo creds.json...');
        
        try {
          const fs = require('fs');
          const path = require('path');
          const credsPath = path.join(__dirname, '../../creds.json');
          
          if (fs.existsSync(credsPath)) {
            console.log('📁 Usando archivo creds.json (desarrollo local)');
            auth = new google.auth.GoogleAuth({
              keyFile: credsPath,
              scopes: [
                'https://www.googleapis.com/auth/spreadsheets',
                'https://www.googleapis.com/auth/drive.file'
              ],
            });
          } else {
            throw new Error('Archivo creds.json no encontrado y variables de entorno faltantes');
          }
        } catch (fileError) {
          throw new Error('No se pudo configurar la autenticación: faltan credenciales base64, variables individuales y archivo creds.json');
        }
      }

      this.sheets = google.sheets({ version: 'v4', auth });
      this.spreadsheetId = process.env.GOOGLE_SHEET_ID;
      
      if (!this.spreadsheetId) {
        throw new Error('GOOGLE_SHEET_ID no está configurado');
      }
      
      console.log('✅ GoogleSheetsService inicializado correctamente');
    } catch (error) {
      console.error('❌ Error inicializando GoogleSheetsService:', error.message);
      console.error('Stack trace:', error.stack);
      this.sheets = null;
      this.spreadsheetId = null;
    }
  }

  _prepareSheetData(quoteType, formData, quoteId, isBusinessQuote) {
    const timestamp = new Date().toLocaleString('es-CO', { timeZone: 'America/Bogota' });
    
    let contactName = 'N/A';
    let contactId = 'N/A';
    let contactPhone = 'N/A';
    let contactEmail = 'N/A';
    let contactAddress = 'N/A';
    let extraData1 = '';
    let extraData2 = '';
    let extraData3 = '';
    let message = '';

    if (isBusinessQuote) {
      contactName = formData.nombreContacto;
      contactId = `NIT: ${formData.nit}`;
      contactPhone = formData.telefono;
      contactEmail = formData.correoElectronico;
      contactAddress = formData.direccion;
      extraData1 = `Razón Social: ${formData.razonSocial}`;
      extraData2 = `Objeto Social: ${formData.objetoSocial}`;
      extraData3 = `Rep. Legal: ${formData.representanteLegal}`;
      message = formData.mensajeAdicional || '';
    } else if (quoteType === 'vehiculos') {
      contactName = formData.ownerName;
      contactId = formData.identification;
      contactPhone = formData.phone;
      contactEmail = formData.email || formData.additionalEmail;
      contactAddress = formData.address;
      extraData1 = `Marca: ${formData.brand}`;
      extraData2 = `Modelo: ${formData.model}`;
      extraData3 = `Año: ${formData.year}`;
    } else {
      contactName = formData.nombreCompleto;
      contactId = `${formData.tipoDocumento}: ${formData.numeroDocumento}`;
      contactPhone = formData.celular;
      contactEmail = formData.email;
      extraData1 = `Fecha de nacimiento: ${formData.fechaNacimiento}`;
      extraData2 = `Sufre Enfermedad: ${formData.sufreEnfermedad}`;
      extraData3 = formData.sufreEnfermedad === 'si' ? formData.cualEnfermedad : 'N/A';
    }

    return [
      timestamp,
      quoteId,
      quoteType,
      contactName,
      contactId,
      contactPhone,
      contactEmail,
      contactAddress,
      extraData1,
      extraData2,
      extraData3,
      message,
      JSON.stringify(formData, null, 2),
    ];
  }

  async addQuoteRecord(quoteType, formData, quoteId, isBusinessQuote = false) {
    if (!this.sheets || !this.spreadsheetId) {
      console.error('Error: GoogleSheetsService no está inicializado correctamente.');
      console.error('Sheets instance:', !!this.sheets);
      console.error('Spreadsheet ID:', !!this.spreadsheetId);
      return false;
    }

    try {
      console.log(`Intentando guardar cotización #${quoteId} en Google Sheets...`);
      
      // Preparar los datos
      const rowData = this._prepareSheetData(quoteType, formData, quoteId, isBusinessQuote);
      console.log('Datos preparados para Google Sheets:', {
        timestamp: rowData[0],
        quoteId: rowData[1],
        quoteType: rowData[2],
        contactName: rowData[3]
      });
      
      // Primero verificar si la hoja existe
      try {
        await this.sheets.spreadsheets.get({
          spreadsheetId: this.spreadsheetId
        });
        console.log('Hoja de cálculo encontrada y accesible');
      } catch (accessError) {
        console.error('Error accediendo a la hoja de cálculo:', accessError.message);
        throw new Error(`No se puede acceder a la hoja: ${accessError.message}`);
      }
      
      // Encontrar la siguiente fila disponible después de los datos existentes
      console.log('🔍 Buscando la última fila con datos...');
      let nextRow = 2; // Empezar en fila 2 (asumiendo que fila 1 es header)
      
      try {
        // Obtener todos los datos existentes en la columna A (timestamp) para encontrar la última fila
        const existingData = await this.sheets.spreadsheets.values.get({
          spreadsheetId: this.spreadsheetId,
          range: 'Cotizaciones!A:A', // Solo columna A para ser eficiente
        });
        
        if (existingData.data.values && existingData.data.values.length > 1) {
          // La última fila con datos + 1
          nextRow = existingData.data.values.length + 1;
          console.log(`📍 Última fila con datos: ${existingData.data.values.length}, insertando en fila: ${nextRow}`);
        } else {
          console.log('📍 No hay datos existentes, insertando en fila 2 (después del header)');
          nextRow = 2;
        }
      } catch (dataError) {
        console.log('⚠️ No se pudo determinar la última fila, insertando en fila 2');
        nextRow = 2;
      }
      
      // Usar update en lugar de append para insertar en la fila específica
      const targetRange = `Cotizaciones!A${nextRow}:M${nextRow}`;
      console.log(`📝 Insertando datos en rango: ${targetRange}`);
      
      const result = await this.sheets.spreadsheets.values.update({
        spreadsheetId: this.spreadsheetId,
        range: targetRange,
        valueInputOption: 'USER_ENTERED',
        resource: {
          values: [rowData],
          majorDimension: 'ROWS'
        },
      });

      if (result && result.data) {
        console.log(`✅ Registro de cotización #${quoteId} guardado exitosamente en Google Sheets en la fila ${nextRow}.`);
        console.log('Resultado:', {
          updatedCells: result.data.updatedCells,
          updatedRows: result.data.updatedRows,
          updatedRange: result.data.updatedRange
        });
        return true;
      } else {
        throw new Error('Respuesta inesperada de Google Sheets API');
      }

    } catch (error) {
      console.error(`❌ Error detallado al guardar en Google Sheets para la cotización #${quoteId}:`);
      console.error('Mensaje de error:', error.message);
      console.error('Código de error:', error.code);
      console.error('Detalles del error:', error.errors);
      console.error('Stack trace:', error.stack);
      
      // Información de debug adicional
      console.error('Debug info:', {
        spreadsheetId: this.spreadsheetId,
        hasSheets: !!this.sheets,
        quoteType,
        quoteId,
        isBusinessQuote
      });
      
      return false;
    }
  }
}

// Función para determinar el destinatario del correo según el tipo de seguro
const getAdminEmail = (quoteType, isBusinessQuote) => {
  if (isBusinessQuote) {
    return process.env.ADMIN_EMAIL_EMPRESARIAL || 'juanpablog857@gmail.com';
  }

  // Mapeo de tipos de seguros personales a variables de entorno
  const emailMapping = {
    'vehiculos': process.env.ADMIN_EMAIL_AUTO,
    'salud': process.env.ADMIN_EMAIL_SALUD,
    'vida': process.env.ADMIN_EMAIL_VIDA,
    'mascotas': process.env.ADMIN_EMAIL_MASCOTAS,
    'hogar': process.env.ADMIN_EMAIL_HOGAR
  };

  return emailMapping[quoteType] || process.env.ADMIN_EMAIL_AUTO || 'jpgomez@stayirrelevant.com';
};

// Función para obtener la lista completa de destinatarios (TO + CC)
const getEmailRecipients = (quoteType, isBusinessQuote) => {
  const mainEmail = getAdminEmail(quoteType, isBusinessQuote);
  const ccEmail = process.env.ADMIN_CC_EMAIL || 'jpgomez@stayirrelevant.com';
  
  // Si el correo principal es el mismo que el CC, solo enviar a uno
  const recipients = [mainEmail];
  if (mainEmail !== ccEmail) {
    recipients.push(ccEmail);
  }
  
  return {
    to: [mainEmail],
    cc: mainEmail !== ccEmail ? [ccEmail] : []
  };
};

// Función para generar contenido del correo según el tipo
const generateEmailContent = (formData, quoteId, quoteType, isBusinessQuote) => {
  if (isBusinessQuote) {
    const typeLabels = {
      'corporativos': 'Corporativos y PYMES',
      'responsabilidad-civil': 'Responsabilidad Civil',
      'transporte': 'Transporte',
      'construccion': 'Todo Riesgo Construcción',
      'cumplimiento': 'Cumplimiento',
      'arl': 'ARL',
      'ciberseguridad': 'CiberSeguridad'
    };

    let content = `
      <h2>Nueva Solicitud de Cotización Empresarial</h2>
      <p><strong>Tipo de Seguro:</strong> ${typeLabels[quoteType] || quoteType}</p>
      <p><strong>Número de Radicado:</strong> ${quoteId}</p>
      <p><strong>Fecha:</strong> ${new Date().toLocaleDateString('es-CO')}</p>
    `;
    
    // Para tipo CORPORATIVOS - estructura especial con DEL TOMADOR, DE LA EMPRESA, INVENTARIO
    if (quoteType === 'corporativos') {
      content += `
        <h3>DEL TOMADOR:</h3>
        <ul>
          <li><strong>Razón Social:</strong> ${formData.razonSocial || 'No especificado'}</li>
          <li><strong>Identificación:</strong> ${formData.identificacion || 'No especificado'}</li>
          <li><strong>Dirección:</strong> ${formData.direccion || 'No especificado'}</li>
          <li><strong>Objeto Social:</strong> ${formData.objetoSocial || 'No especificado'}</li>
          <li><strong>Persona de Contacto:</strong> ${formData.personaContacto || 'No especificado'}</li>
          <li><strong>Celular:</strong> ${formData.celular || 'No especificado'}</li>
          <li><strong>Email:</strong> ${formData.email || 'No especificado'}</li>
          <li><strong>Representante Legal:</strong> ${formData.representanteLegal || 'No especificado'}</li>
        </ul>
        
        <h3>DE LA EMPRESA:</h3>
        <ul>
          <li><strong>Dirección del Riesgo:</strong> ${formData.direccionRiesgo || 'No especificado'}</li>
          <li><strong>Local Propio o Alquilado:</strong> ${formData.localPropioAlquilado || 'No especificado'}</li>
          <li><strong>Área m² construidos:</strong> ${formData.areaM2 || 'No especificado'}</li>
          <li><strong>Número de pisos:</strong> ${formData.numeroPisos || 'No especificado'}</li>
          <li><strong>Mejoras Locativas:</strong> $${formData.mejorasLocativas ? parseInt(formData.mejorasLocativas).toLocaleString() : 'No especificado'}</li>
        </ul>
        
        <h3>INVENTARIO:</h3>
        <ul>
          <li><strong>Valor global Equipos eléctricos:</strong> $${formData.valorEquiposElectricos ? parseInt(formData.valorEquiposElectricos).toLocaleString() : 'No especificado'}</li>
          <li><strong>Valor global Muebles y Enseres:</strong> $${formData.valorMueblesEnseres ? parseInt(formData.valorMueblesEnseres).toLocaleString() : 'No especificado'}</li>
          <li><strong>Valor global mercancías fijas:</strong> $${formData.valorMercanciasFijas ? parseInt(formData.valorMercanciasFijas).toLocaleString() : 'No especificado'}</li>
          <li><strong>Valor global Maquinaria y Equipo:</strong> $${formData.valorMaquinariaEquipo ? parseInt(formData.valorMaquinariaEquipo).toLocaleString() : 'No especificado'}</li>
          <li><strong>Valor global equipos móviles:</strong> $${formData.valorEquiposMoviles ? parseInt(formData.valorEquiposMoviles).toLocaleString() : 'No especificado'}</li>
        </ul>`;
        
        // Calcular total del inventario si hay valores
        const inventarioTotal = [
          parseInt(formData.valorEquiposElectricos || '0'),
          parseInt(formData.valorMueblesEnseres || '0'),
          parseInt(formData.valorMercanciasFijas || '0'),
          parseInt(formData.valorMaquinariaEquipo || '0'),
          parseInt(formData.valorEquiposMoviles || '0')
        ].reduce((sum, val) => sum + val, 0);
        
        if (inventarioTotal > 0) {
          content += `
            <div style="background-color: #e8f5e9; padding: 10px; margin: 10px 0; border-radius: 5px;">
              <p><strong>VALOR TOTAL DEL INVENTARIO: $${inventarioTotal.toLocaleString()}</strong></p>
            </div>`;
        }
        
    } else {
      // Para otros tipos empresariales (ARL, transporte, etc.) - estructura original
      content += `
        <h3>Información de la Empresa:</h3>
        <ul>
          <li><strong>Nombre del Contacto:</strong> ${formData.nombreContacto || 'No especificado'}</li>
          <li><strong>NIT:</strong> ${formData.nit || 'No especificado'}</li>
          <li><strong>Razón Social:</strong> ${formData.razonSocial || 'No especificado'}</li>
          <li><strong>Dirección:</strong> ${formData.direccion || 'No especificado'}</li>
          <li><strong>Teléfono:</strong> ${formData.telefono || 'No especificado'}</li>
          <li><strong>Correo Electrónico:</strong> ${formData.correoElectronico || 'No especificado'}</li>
          <li><strong>Objeto Social:</strong> ${formData.objetoSocial || 'No especificado'}</li>
          <li><strong>Persona de Contacto:</strong> ${formData.personaContacto || 'No especificado'}</li>
          <li><strong>Representante Legal:</strong> ${formData.representanteLegal || 'No especificado'}</li>
          ${formData.mensajeAdicional ? `<li><strong>Mensaje Adicional:</strong> ${formData.mensajeAdicional}</li>` : ''}
        </ul>`;
      
      // Campos específicos de TRANSPORTE
      if (quoteType === 'transporte') {
        content += `
          <h3>DATOS DE TRANSPORTE:</h3>
          <h4>Despachos Nacionales:</h4>
          <ul>
            <li><strong>Presupuesto anual de movilizaciones:</strong> $${formData.presupuestoAnualMovilizaciones ? parseInt(formData.presupuestoAnualMovilizaciones).toLocaleString() : 'No especificado'}</li>
            <li><strong>Presupuesto anual de Ventas:</strong> $${formData.presupuestoAnualVentas ? parseInt(formData.presupuestoAnualVentas).toLocaleString() : 'No especificado'}</li>
            <li><strong>Límite máximo por despacho nacional:</strong> $${formData.limiteMaximoDespachoNacional ? parseInt(formData.limiteMaximoDespachoNacional).toLocaleString() : 'No especificado'}</li>
          </ul>
          <h4>Importaciones:</h4>
          <ul>
            <li><strong>Presupuesto anual de importaciones:</strong> $${formData.presupuestoAnualImportaciones ? parseInt(formData.presupuestoAnualImportaciones).toLocaleString() : 'No especificado'}</li>
            <li><strong>Límite máximo por despacho de importación:</strong> $${formData.limiteMaximoDespachoImportacion ? parseInt(formData.limiteMaximoDespachoImportacion).toLocaleString() : 'No especificado'}</li>
          </ul>
          <h4>Exportaciones:</h4>
          <ul>
            <li><strong>Presupuesto anual de exportaciones:</strong> $${formData.presupuestoAnualExportaciones ? parseInt(formData.presupuestoAnualExportaciones).toLocaleString() : 'No especificado'}</li>
            <li><strong>Límite máximo por despacho de exportación:</strong> $${formData.limiteMaximoDespachoExportacion ? parseInt(formData.limiteMaximoDespachoExportacion).toLocaleString() : 'No especificado'}</li>
          </ul>`;
      }
      
      // Campos específicos de ARL
      if (quoteType === 'arl') {
        content += `
          <h3>DATOS DE ARL:</h3>
          <ul>
            <li><strong>Número de empleados:</strong> ${formData.numeroEmpleados || 'No especificado'}</li>
            <li><strong>ARL actual:</strong> ${formData.arlActual || 'No especificado'}</li>
            <li><strong>Valor aportes mensual solo ARL:</strong> $${formData.valorAportesMensualARL ? parseInt(formData.valorAportesMensualARL).toLocaleString() : 'No especificado'}</li>
          </ul>`;
      }

      // Campos específicos de CiberSeguridad
      if (quoteType === 'ciberseguridad') {
        content += `
          <h3>INFORMACIÓN DE LA EMPRESA:</h3>
          <ul>
            <li><strong>Nombre de la Empresa:</strong> ${formData.nombreEmpresa || 'No especificado'}</li>
            <li><strong>NIT:</strong> ${formData.nit || 'No especificado'}</li>
            <li><strong>Razón Social:</strong> ${formData.razonSocial || 'No especificado'}</li>
            <li><strong>Tipo de Persona:</strong> ${formData.tipoPersona === 'juridica' ? 'Persona Jurídica' : formData.tipoPersona === 'natural' ? 'Persona Natural' : 'No especificado'}</li>
            <li><strong>Nombre del Contacto:</strong> ${formData.nombreContacto || 'No especificado'}</li>
            <li><strong>Teléfono:</strong> ${formData.telefono || 'No especificado'}</li>
            <li><strong>Correo Electrónico:</strong> ${formData.correoElectronico || 'No especificado'}</li>
            <li><strong>Dirección:</strong> ${formData.direccion || 'No especificado'}</li>
          </ul>`;
      }
    }
    
    return content;
  } else {
    const insuranceType = quoteType === 'vehiculos' ? 'Auto' :
                         quoteType === 'vida' ? 'Vida' :
                         quoteType === 'salud' ? 'Salud' :
                         quoteType === 'mascotas' ? 'Mascotas' :
                         quoteType === 'credito-vehicular' ? 'Crédito Vehicular' :
                         quoteType === 'asistencia-viajes' ? 'Asistencia en Viajes' : 'Hogar';

    let content = `<h2>Tipo de Seguro: ${insuranceType}</h2>`;
    
    // INFORMACIÓN COMPLETA SEGÚN EL TIPO DE FORMULARIO
    if (quoteType === 'vehiculos') {
      content += `
        <h3>Información del Propietario:</h3>
        <ul>
          <li><strong>Nombre del Propietario:</strong> ${formData.ownerName || 'No especificado'}</li>
          <li><strong>Cédula:</strong> ${formData.identification || 'No especificado'}</li>
          <li><strong>Fecha de Nacimiento:</strong> ${formData.birthDate || 'No especificado'}</li>
          <li><strong>Dirección:</strong> ${formData.address || 'No especificado'}</li>
          <li><strong>Celular:</strong> ${formData.phone || 'No especificado'}</li>
          <li><strong>Email:</strong> ${formData.email || formData.additionalEmail || 'No especificado'}</li>
        </ul>

        <h3>Información del Vehículo:</h3>
        <ul>
          <li><strong>Placa:</strong> ${formData.licensePlate || 'Sin placa/Vehículo nuevo'}</li>
          <li><strong>Tipo de Vehículo:</strong> ${formData.vehicleType || 'No especificado'}</li>
          <li><strong>Marca:</strong> ${formData.brand || 'No especificado'}</li>
          <li><strong>Año:</strong> ${formData.year || 'No especificado'}</li>
          <li><strong>Transmisión:</strong> ${formData.transmission || 'No especificado'}</li>
          <li><strong>Estado del Vehículo:</strong> ${formData.vehicleCondition === '0km' ? '0 Km (Nuevo)' : formData.vehicleCondition === 'usado' ? 'Usado' : 'No especificado'}</li>
          ${formData.vehicleCondition === '0km' && formData.invoiceValue ? `<li><strong>Valor de la Factura:</strong> $${parseInt(formData.invoiceValue).toLocaleString()}</li>` : ''}
          <li><strong>¿Tiene Prenda?:</strong> ${formData.hasLien === 'si' ? 'Sí' : formData.hasLien === 'no' ? 'No' : 'No especificado'}</li>
          ${formData.hasLien === 'si' && formData.lienDetails ? `<li><strong>Entidad Financiera:</strong> ${formData.lienDetails}</li>` : ''}
        </ul>`;
        
    } else if (quoteType === 'salud') {
      content += `
        <h3>Información Personal del Tomador:</h3>
        <ul>
          <li><strong>Nombre Completo:</strong> ${formData.nombreCompleto || 'No especificado'}</li>
          <li><strong>Tipo de Documento:</strong> ${formData.tipoDocumento || 'No especificado'}</li>
          <li><strong>Número de Documento:</strong> ${formData.numeroDocumento || 'No especificado'}</li>
          <li><strong>Fecha de Nacimiento:</strong> ${formData.fechaNacimiento || 'No especificado'}</li>
          <li><strong>Celular:</strong> ${formData.celular || 'No especificado'}</li>
          <li><strong>Email:</strong> ${formData.email || 'No especificado'}</li>
          ${formData.epsActual ? `<li><strong>EPS Actual:</strong> ${formData.epsActual}</li>` : ''}
        </ul>

        <h3>Información de Salud:</h3>
        <ul>
          <li><strong>¿Sufre alguna enfermedad?:</strong> ${formData.sufreEnfermedad === 'si' ? 'Sí' : formData.sufreEnfermedad === 'no' ? 'No' : 'No especificado'}</li>
          ${formData.sufreEnfermedad === 'si' && formData.cualEnfermedad ? `<li><strong>¿Cuál enfermedad?:</strong> ${formData.cualEnfermedad}</li>` : ''}
          <li><strong>¿Desea asegurar a alguien más?:</strong> ${formData.deseaAsegurarAlguienMas === 'si' ? 'Sí' : formData.deseaAsegurarAlguienMas === 'no' ? 'No' : 'No especificado'}</li>
          ${formData.deseaAsegurarAlguienMas === 'si' && formData.cantidadPersonasAdicionales ? `<li><strong>Cantidad de personas adicionales:</strong> ${formData.cantidadPersonasAdicionales}</li>` : ''}
        </ul>`;
        
      // Personas adicionales
      if (formData.personasAdicionales && formData.personasAdicionales.length > 0) {
        content += `<h3>Personas Adicionales a Asegurar:</h3>`;
        formData.personasAdicionales.forEach((persona, index) => {
          content += `
            <div style="margin-left: 20px; margin-bottom: 15px; border-left: 3px solid #0A4958; padding-left: 15px;">
              <h4>Persona Adicional ${index + 1}:</h4>
              <ul>
                <li><strong>Nombre Completo:</strong> ${persona.nombreCompleto || 'No especificado'}</li>
                <li><strong>Tipo de Documento:</strong> ${persona.tipoDocumento || 'No especificado'}</li>
                <li><strong>Número de Documento:</strong> ${persona.numeroDocumento || 'No especificado'}</li>
                <li><strong>Fecha de Nacimiento:</strong> ${persona.fechaNacimiento || 'No especificado'}</li>
                <li><strong>Celular:</strong> ${persona.celular || 'No especificado'}</li>
                <li><strong>¿Sufre alguna enfermedad?:</strong> ${persona.sufreEnfermedad === 'si' ? 'Sí' : persona.sufreEnfermedad === 'no' ? 'No' : 'No especificado'}</li>
                ${persona.sufreEnfermedad === 'si' && persona.cualEnfermedad ? `<li><strong>¿Cuál enfermedad?:</strong> ${persona.cualEnfermedad}</li>` : ''}
              </ul>
            </div>`;
        });
      }

    } else if (quoteType === 'vida') {
      content += `
        <h3>Información Personal del Tomador:</h3>
        <ul>
          <li><strong>Nombre Completo:</strong> ${formData.nombreCompleto || 'No especificado'}</li>
          <li><strong>Tipo de Documento:</strong> ${formData.tipoDocumento || 'No especificado'}</li>
          <li><strong>Número de Documento:</strong> ${formData.numeroDocumento || 'No especificado'}</li>
          <li><strong>Edad:</strong> ${formData.edad || 'No especificado'} años</li>
          <li><strong>Celular:</strong> ${formData.celular || 'No especificado'}</li>
          <li><strong>Email:</strong> ${formData.email || 'No especificado'}</li>
        </ul>

        <h3>Tipo de Seguro y Coberturas:</h3>
        <ul>
          <li><strong>Tipo de Seguro:</strong> ${formData.tipoSeguro === 'vida' ? 'Seguro de Vida' : formData.tipoSeguro === 'credito' ? 'Plan Crédito Protegido' : 'No especificado'}</li>
          ${formData.tipoSeguro === 'vida' ? `
            ${formData.fallecimientoCualquierCausa ? `<li><strong>Fallecimiento por cualquier causa:</strong> $${parseInt(formData.fallecimientoCualquierCausa).toLocaleString()}</li>` : ''}
            ${formData.fallecimientoAccidente ? `<li><strong>Fallecimiento por accidente:</strong> $${parseInt(formData.fallecimientoAccidente).toLocaleString()}</li>` : ''}
            ${formData.enfermedadesGraves ? `<li><strong>Enfermedades graves:</strong> $${parseInt(formData.enfermedadesGraves).toLocaleString()}</li>` : ''}
            ${formData.invalidezEnfermedad ? `<li><strong>Invalidez por enfermedad:</strong> $${parseInt(formData.invalidezEnfermedad).toLocaleString()}</li>` : ''}
            ${formData.invalidezAccidente ? `<li><strong>Invalidez por accidente:</strong> $${parseInt(formData.invalidezAccidente).toLocaleString()}</li>` : ''}
            ${formData.rentaDiaria ? `<li><strong>Renta diaria por hospitalización:</strong> $${parseInt(formData.rentaDiaria).toLocaleString()}</li>` : ''}
          ` : ''}
          ${formData.tipoSeguro === 'credito' ? `
            ${formData.valorCredito ? `<li><strong>Valor del crédito a asegurar:</strong> $${parseInt(formData.valorCredito).toLocaleString()}</li>` : ''}
            ${formData.entidadFinanciera ? `<li><strong>Entidad financiera:</strong> ${formData.entidadFinanciera}</li>` : ''}
          ` : ''}
        </ul>

        <h3>Información de Salud:</h3>
        <ul>
          <li><strong>¿Sufre alguna enfermedad?:</strong> ${formData.sufreEnfermedad === 'si' ? 'Sí' : formData.sufreEnfermedad === 'no' ? 'No' : 'No especificado'}</li>
          ${formData.sufreEnfermedad === 'si' && formData.cualEnfermedad ? `<li><strong>¿Cuál enfermedad?:</strong> ${formData.cualEnfermedad}</li>` : ''}
          ${formData.conduceMoto ? `<li><strong>¿Conduce moto?:</strong> ${formData.conduceMoto === 'si' ? 'Sí' : formData.conduceMoto === 'no' ? 'No' : 'No especificado'}</li>` : ''}
          <li><strong>¿Desea asegurar a alguien más?:</strong> ${formData.deseaAsegurarAlguienMas === 'si' ? 'Sí' : formData.deseaAsegurarAlguienMas === 'no' ? 'No' : 'No especificado'}</li>
          ${formData.deseaAsegurarAlguienMas === 'si' && formData.cantidadPersonasAdicionales ? `<li><strong>Cantidad de personas adicionales:</strong> ${formData.cantidadPersonasAdicionales}</li>` : ''}
        </ul>`;

      // Personas adicionales para vida
      if (formData.personasAdicionales && formData.personasAdicionales.length > 0) {
        content += `<h3>Personas Adicionales a Asegurar:</h3>`;
        formData.personasAdicionales.forEach((persona, index) => {
          content += `
            <div style="margin-left: 20px; margin-bottom: 15px; border-left: 3px solid #0A4958; padding-left: 15px;">
              <h4>Persona Adicional ${index + 1}:</h4>
              <ul>
                <li><strong>Nombre Completo:</strong> ${persona.nombreCompleto || 'No especificado'}</li>
                <li><strong>Tipo de Documento:</strong> ${persona.tipoDocumento || 'No especificado'}</li>
                <li><strong>Número de Documento:</strong> ${persona.numeroDocumento || 'No especificado'}</li>
                <li><strong>Edad:</strong> ${persona.edad || 'No especificado'} años</li>
                <li><strong>Celular:</strong> ${persona.celular || 'No especificado'}</li>
                <li><strong>¿Sufre alguna enfermedad?:</strong> ${persona.sufreEnfermedad === 'si' ? 'Sí' : persona.sufreEnfermedad === 'no' ? 'No' : 'No especificado'}</li>
                ${persona.sufreEnfermedad === 'si' && persona.cualEnfermedad ? `<li><strong>¿Cuál enfermedad?:</strong> ${persona.cualEnfermedad}</li>` : ''}
              </ul>
            </div>`;
        });
      }

    } else if (quoteType === 'hogar') {
      content += `
        <h3>Información Personal:</h3>
        <ul>
          <li><strong>Nombre Completo:</strong> ${formData.nombreCompleto || 'No especificado'}</li>
          <li><strong>Tipo de Documento:</strong> ${formData.tipoDocumento || 'No especificado'}</li>
          <li><strong>Número de Documento:</strong> ${formData.numeroDocumento || 'No especificado'}</li>
          <li><strong>Teléfono/Celular:</strong> ${formData.celular || 'No especificado'}</li>
          <li><strong>Email:</strong> ${formData.email || 'No especificado'}</li>
          <li><strong>Ciudad:</strong> ${formData.ciudad || 'No especificado'}</li>
          <li><strong>Dirección del Inmueble:</strong> ${formData.direccionInmueble || 'No especificado'}</li>
        </ul>
        
        <h3>Información del Inmueble:</h3>
        <ul>
          <li><strong>Tipo de Inmueble:</strong> ${formData.tipoInmueble || 'No especificado'}</li>
          <li><strong>¿Es propietario?:</strong> ${formData.esPropietario === 'si' ? 'Sí' : 'No'}</li>
          <li><strong>Área construida (m²):</strong> ${formData.areaConstruida || 'No especificado'}</li>
          <li><strong>Número de pisos:</strong> ${formData.numeroPisos || 'No especificado'}</li>
          <li><strong>Año de construcción:</strong> ${formData.anioConstruccion || 'No especificado'}</li>
          <li><strong>Material de construcción:</strong> ${formData.materialConstruccion || 'No especificado'}</li>
          <li><strong>¿Conjunto cerrado?:</strong> ${formData.conjuntoCerrado === 'si' ? 'Sí' : 'No'}</li>
          <li><strong>Valor del inmueble:</strong> ${formData.valorInmueble ? '$' + parseInt(formData.valorInmueble).toLocaleString() : 'No especificado'}</li>
          <li><strong>Valor de contenidos:</strong> ${formData.valorContenidos ? '$' + parseInt(formData.valorContenidos).toLocaleString() : 'No especificado'}</li>
        </ul>`;
        
    } else if (quoteType === 'mascotas') {
      content += `
        <h3>Información del Propietario:</h3>
        <ul>
          <li><strong>Nombre Completo:</strong> ${formData.nombreCompleto || 'No especificado'}</li>
          <li><strong>Tipo de Documento:</strong> ${formData.tipoDocumento || 'No especificado'}</li>
          <li><strong>Número de Documento:</strong> ${formData.numeroDocumento || 'No especificado'}</li>
          <li><strong>Dirección:</strong> ${formData.direccion || 'No especificado'}</li>
          <li><strong>Celular:</strong> ${formData.celular || 'No especificado'}</li>
          <li><strong>Email:</strong> ${formData.email || 'No especificado'}</li>
        </ul>

        <h3>Información de la Mascota:</h3>
        <ul>
          <li><strong>Nombre de la mascota:</strong> ${formData.nombreMascota || 'No especificado'}</li>
          <li><strong>Ciudad de residencia:</strong> ${formData.ciudadResidencia || 'No especificado'}</li>
          <li><strong>Edad:</strong> ${formData.edadMascota || 'No especificado'} años</li>
          <li><strong>Raza:</strong> ${formData.raza || 'No especificado'}</li>
          ${formData.enfermedadesSufridas ? `<li><strong>Enfermedades sufridas:</strong> ${formData.enfermedadesSufridas}</li>` : '<li><strong>Enfermedades sufridas:</strong> Ninguna</li>'}
          ${formData.cirugias ? `<li><strong>Cirugías:</strong> ${formData.cirugias}</li>` : '<li><strong>Cirugías:</strong> Ninguna</li>'}
        </ul>`;
    } else if (quoteType === 'credito-vehicular') {
      content += `
        <h3>Información de Contacto:</h3>
        <ul>
          <li><strong>Nombre Completo:</strong> ${formData.name || 'No especificado'}</li>
          <li><strong>Teléfono:</strong> ${formData.phone || 'No especificado'}</li>
          <li><strong>Email:</strong> ${formData.email || 'No especificado'}</li>
        </ul>

        <h3>Información del Vehículo:</h3>
        <ul>
          <li><strong>Monto a Financiar:</strong> ${formData.loanAmount || 'No especificado'}</li>
          <li><strong>Marca del Vehículo:</strong> ${formData.vehicleBrand || 'No especificado'}</li>
          <li><strong>Modelo del Vehículo:</strong> ${formData.vehicleModel || 'No especificado'}</li>
        </ul>`;
    } else if (quoteType === 'asistencia-viajes') {
      content += `
        <h3>Información de Contacto:</h3>
        <ul>
          <li><strong>Nombre Completo:</strong> ${formData.name || 'No especificado'}</li>
          <li><strong>Teléfono:</strong> ${formData.phone || 'No especificado'}</li>
          <li><strong>Email:</strong> ${formData.email || 'No especificado'}</li>
        </ul>

        <h3>Información del Viaje:</h3>
        <ul>
          <li><strong>Fecha de Salida:</strong> ${formData.departureDate || 'No especificado'}</li>
          <li><strong>Fecha de Regreso:</strong> ${formData.returnDate || 'No especificado'}</li>
          <li><strong>Origen:</strong> ${formData.origin || 'No especificado'}</li>
          <li><strong>Destino:</strong> ${formData.destination || 'No especificado'}</li>
          <li><strong>Motivo del Viaje:</strong> ${formData.travelReason || 'No especificado'}</li>
        </ul>`;
    }

    return content;
  }
};

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const data = JSON.parse(event.body);
    const { 
      formData, 
      quoteId, 
      quoteType,
      userEmail,
      isBusinessQuote = false
    } = data;

    if (!formData || !quoteId || !quoteType) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
        body: JSON.stringify({ success: false, error: 'Faltan datos en la solicitud.' })
      };
    }

    // Determinar el tipo de seguro
    const insuranceType = isBusinessQuote ?
      (quoteType === 'corporativos' ? 'Corporativos y PYMES' :
       quoteType === 'responsabilidad-civil' ? 'Responsabilidad Civil' :
       quoteType === 'transporte' ? 'Transporte' :
       quoteType === 'construccion' ? 'Todo Riesgo Construcción' :
       quoteType === 'cumplimiento' ? 'Cumplimiento' :
       quoteType === 'arl' ? 'ARL' :
       quoteType === 'ciberseguridad' ? 'CiberSeguridad' : 'Empresarial') :
      (quoteType === 'vehiculos' ? 'Auto' :
       quoteType === 'vida' ? 'Vida' :
       quoteType === 'salud' ? 'Salud' :
       quoteType === 'mascotas' ? 'Mascotas' :
       quoteType === 'credito-vehicular' ? 'Crédito Vehicular' :
       quoteType === 'asistencia-viajes' ? 'Asistencia en Viajes' : 'Hogar');

    // Generar contenido específico según el tipo
    const emailContent = generateEmailContent(formData, quoteId, quoteType, isBusinessQuote);

    // Template para el correo al administrador
    const adminEmailTemplate = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #0A4958; color: white; padding: 20px; text-align: center;">
          <h1>Nueva Solicitud de Cotización${isBusinessQuote ? ' Empresarial' : ''}</h1>
          <p>Número de Referencia: ${quoteId}</p>
        </div>
        
        <div style="padding: 20px;">
          ${emailContent}
          
          <div style="margin-top: 30px; padding: 15px; background-color: #f5f5f5; border-radius: 5px;">
            <p><strong>Fecha de Solicitud:</strong> ${new Date().toLocaleString('es-CO')}</p>
            <p><strong>Acción Requerida:</strong> Contactar al cliente en máximo 24 horas</p>
          </div>
        </div>
        
        <div style="background-color: #0A4958; color: white; padding: 10px; text-align: center; margin-top: 20px;">
          <p style="margin: 0;">Avance Seguros - Sistema de Cotizaciones</p>
        </div>
      </div>
    `;

    // Obtener el nombre del cliente según el tipo de formulario
    const clientName = isBusinessQuote ? 
      formData.nombreContacto : 
      (formData.ownerName || formData.nombreCompleto);

    // Template para el correo al usuario
    const userEmailTemplate = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #0A4958; color: white; padding: 20px; text-align: center;">
          <img src="https://storage.googleapis.com/cluvi/Imagenes/logo-avance-seguro.jpg" alt="Avance Seguros" style="max-width: 200px; margin-bottom: 10px;">
          <h1>¡Cotización Recibida!</h1>
        </div>
        
        <div style="padding: 20px;">
          <p>Estimado/a ${clientName},</p>
          
          <p>Hemos recibido tu solicitud de cotización para <strong>${insuranceType}</strong>.</p>
          
          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Número de Referencia:</strong> ${quoteId}</p>
            <p><strong>Fecha de Solicitud:</strong> ${new Date().toLocaleString('es-CO')}</p>
            <p><strong>Tipo:</strong> ${isBusinessQuote ? 'Empresarial' : 'Personal'}</p>
          </div>
          
          <h3>¿Qué sigue?</h3>
          <ol style="line-height: 1.8;">
            <li>Nuestro equipo ${isBusinessQuote ? 'comercial especializado en seguros empresariales' : 'de asesores'} analizará tu información</li>
            <li>Te contactaremos en máximo 24 horas hábiles</li>
            <li>Recibirás opciones personalizadas para tu ${isBusinessQuote ? 'empresa' : (quoteType === 'vehiculos' ? 'vehículo' : 'protección')}</li>
            <li>Podrás elegir el plan que mejor se adapte a tus necesidades${isBusinessQuote ? ' empresariales' : ''}</li>
          </ol>
          
          <div style="background-color: #e8f5e9; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h4 style="margin-top: 0;">Contacto:</h4>
            <p>📱 (310)-848-35-62</p>
            <p>✉️ info@avanceseguros.com</p>
          </div>
          
          <p>Gracias por confiar en nosotros para proteger lo que más importa${isBusinessQuote ? ' para tu empresa' : ''}.</p>
          
          <p>Atentamente,<br>
          <strong>Equipo Avance Seguros</strong></p>
        </div>
        
        <div style="background-color: #0A4958; color: white; padding: 15px; text-align: center; margin-top: 20px;">
          <p style="margin: 0; font-size: 12px;">© 2025 Avance Seguros. Todos los derechos reservados.</p>
        </div>
      </div>
    `;

    // 1. Guardar en Google Sheets primero
    let sheetsSuccess = false;
    try {
      console.log('🔄 Inicializando GoogleSheetsService...');
      const sheetsService = new GoogleSheetsService();
      
      console.log('🔄 Intentando guardar en Google Sheets...');
      sheetsSuccess = await sheetsService.addQuoteRecord(quoteType, formData, quoteId, isBusinessQuote);
      
      if (sheetsSuccess) {
        console.log('✅ Cotización guardada en Google Sheets exitosamente');
      } else {
        console.error('❌ Falló el guardado en Google Sheets');
      }
    } catch (sheetsError) {
      console.error('❌ Excepción al guardar en Google Sheets:', sheetsError.message);
      console.error('Stack trace completo:', sheetsError.stack);
    }

    // 2. Enviar correo al administrador con destinatarios dinámicos
    let adminEmailId = null;
    try {
      const recipients = getEmailRecipients(quoteType, isBusinessQuote);
      console.log('Intentando enviar correo al administrador...');
      console.log('📧 Destinatarios:', {
        to: recipients.to,
        cc: recipients.cc,
        quoteType: quoteType,
        isBusinessQuote: isBusinessQuote
      });
      
      const emailData = {
        from: 'notificaciones@updates.stayirrelevant.com',
        to: recipients.to,
        subject: `Nueva Solicitud de Cotización #${quoteId} - ${insuranceType}${isBusinessQuote ? ' (Empresarial)' : ''}`,
        html: adminEmailTemplate,
      };
      
      // Agregar CC solo si hay destinatarios en copia
      if (recipients.cc && recipients.cc.length > 0) {
        emailData.cc = recipients.cc;
        console.log('📧 Agregando CC:', recipients.cc);
      }
      
      const adminEmail = await resend.emails.send(emailData);

      if (adminEmail && adminEmail.data && adminEmail.data.id) {
        adminEmailId = adminEmail.data.id;
        console.log('✅ Correo al administrador enviado exitosamente:', adminEmailId);
        console.log('📧 Enviado a:', recipients.to);
        if (recipients.cc.length > 0) {
          console.log('📧 Con copia a:', recipients.cc);
        }
      } else {
        console.log('Respuesta del correo admin:', JSON.stringify(adminEmail, null, 2));
        throw new Error('La respuesta del envío de correo no tiene el formato esperado');
      }
    } catch (emailError) {
      console.error('❌ Error enviando correo al administrador:', emailError);
    }

    // 3. Enviar correo al usuario (si se proporcionó email)
    let userEmailId = null;
    const emailToSend = userEmail || (isBusinessQuote ? formData.correoElectronico : formData.email);
    
    if (emailToSend) {
      try {
        console.log('Intentando enviar correo al usuario:', emailToSend);
        const userEmailResponse = await resend.emails.send({
          from: 'notificaciones@updates.stayirrelevant.com',
          to: [emailToSend],
          subject: `Confirmación: Tu Solicitud de Cotización #${quoteId}${isBusinessQuote ? ' Empresarial' : ''}`,
          html: userEmailTemplate,
        });

        if (userEmailResponse && userEmailResponse.data && userEmailResponse.data.id) {
          userEmailId = userEmailResponse.data.id;
          console.log('Correo al usuario enviado exitosamente:', userEmailId);
        } else {
          console.log('Respuesta del correo usuario:', JSON.stringify(userEmailResponse, null, 2));
        }
      } catch (userEmailError) {
        console.error('Error enviando correo al usuario:', userEmailError);
      }
    }

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        success: true,
        adminEmailId: adminEmailId,
        userEmailId: userEmailId,
        sheetsSuccess: sheetsSuccess,
        message: sheetsSuccess ? 
          'Solicitud procesada exitosamente' : 
          'Solicitud procesada, pero falló el guardado en Google Sheets',
        quoteType: isBusinessQuote ? 'empresarial' : 'personal'
      })
    };

  } catch (error) {
    console.error('Error en la función:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        success: false,
        error: 'Hubo un error al procesar tu solicitud.'
      })
    };
  }
};