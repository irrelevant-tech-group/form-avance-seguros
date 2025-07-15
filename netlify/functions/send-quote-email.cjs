const { Resend } = require('resend');
const { google } = require('googleapis');

// Inicializar Resend con la API key
const resend = new Resend(process.env.RESEND_API_KEY);

// Clase para manejar Google Sheets
class GoogleSheetsService {
  constructor() {
    // Usar el método de autenticación del código 2 que funciona
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    this.sheets = google.sheets({ version: 'v4', auth });
    this.spreadsheetId = process.env.GOOGLE_SHEET_ID;
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
      extraData1 = `Edad: ${formData.edad}`;
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
    if (!this.spreadsheetId) {
      console.error('Error: El ID de la hoja de cálculo de Google (GOOGLE_SHEET_ID) no está configurado.');
      return;
    }

    try {
      const range = 'Cotizaciones!A1';
      const values = [this._prepareSheetData(quoteType, formData, quoteId, isBusinessQuote)];
      
      const resource = { values };
      
      await this.sheets.spreadsheets.values.append({
        spreadsheetId: this.spreadsheetId,
        range,
        valueInputOption: 'USER_ENTERED',
        resource,
      });

      console.log(`Registro de cotización #${quoteId} guardado exitosamente en Google Sheets.`);

    } catch (error) {
      console.error(`Error al guardar en Google Sheets para la cotización #${quoteId}:`, error.message);
    }
  }
}

// Función para generar contenido del correo según el tipo
const generateEmailContent = (formData, quoteId, quoteType, isBusinessQuote) => {
  if (isBusinessQuote) {
    const typeLabels = {
      'corporativos': 'Corporativos y PYMES',
      'responsabilidad-civil': 'Responsabilidad Civil',
      'transporte': 'Transporte',
      'construccion': 'Todo Riesgo Construcción',
      'cumplimiento': 'Cumplimiento',
      'arl': 'ARL'
    };

    return `
      <h2>Nueva Solicitud de Cotización Empresarial</h2>
      <p><strong>Tipo de Seguro:</strong> ${typeLabels[quoteType] || quoteType}</p>
      <p><strong>Número de Radicado:</strong> ${quoteId}</p>
      <p><strong>Fecha:</strong> ${new Date().toLocaleDateString('es-CO')}</p>
      
      <h3>Información de la Empresa:</h3>
      <ul>
        <li><strong>Nombre del Contacto:</strong> ${formData.nombreContacto}</li>
        <li><strong>NIT:</strong> ${formData.nit}</li>
        <li><strong>Razón Social:</strong> ${formData.razonSocial}</li>
        <li><strong>Dirección:</strong> ${formData.direccion}</li>
        <li><strong>Teléfono:</strong> ${formData.telefono}</li>
        <li><strong>Correo Electrónico:</strong> ${formData.correoElectronico}</li>
        <li><strong>Objeto Social:</strong> ${formData.objetoSocial}</li>
        <li><strong>Persona de Contacto:</strong> ${formData.personaContacto}</li>
        <li><strong>Representante Legal:</strong> ${formData.representanteLegal}</li>
        ${formData.mensajeAdicional ? `<li><strong>Mensaje Adicional:</strong> ${formData.mensajeAdicional}</li>` : ''}
      </ul>
    `;
  } else {
    const insuranceType = quoteType === 'vehiculos' ? 'Auto' : 
                         quoteType === 'vida' ? 'Vida' : 
                         quoteType === 'salud' ? 'Salud' :
                         quoteType === 'mascotas' ? 'Mascotas' : 'Hogar';

    return `
      <h2>Tipo de Seguro: ${insuranceType}</h2>
      
      <h3>Información del Solicitante:</h3>
      <ul>
        <li><strong>Nombre:</strong> ${formData.ownerName || formData.nombreCompleto}</li>
        <li><strong>Documento:</strong> ${formData.identification || formData.numeroDocumento}</li>
        <li><strong>Teléfono:</strong> ${formData.phone || formData.celular}</li>
        <li><strong>Email:</strong> ${formData.email || 'No proporcionado'}</li>
        ${formData.birthDate ? `<li><strong>Fecha de Nacimiento:</strong> ${formData.birthDate}</li>` : ''}
        ${formData.address ? `<li><strong>Dirección:</strong> ${formData.address}</li>` : ''}
      </ul>
      
      ${quoteType === 'vehiculos' ? `
        <h3>Información del Vehículo:</h3>
        <ul>
          <li><strong>Placa:</strong> ${formData.licensePlate || 'N/A'}</li>
          <li><strong>Marca:</strong> ${formData.brand}</li>
          <li><strong>Modelo:</strong> ${formData.model}</li>
          <li><strong>Año:</strong> ${formData.year}</li>
          <li><strong>Tipo:</strong> ${formData.vehicleType}</li>
          <li><strong>Transmisión:</strong> ${formData.transmission}</li>
          <li><strong>Prenda:</strong> ${formData.hasLien === 'si' ? 'Sí' : 'No'}</li>
          ${formData.lienDetails ? `<li><strong>Entidad:</strong> ${formData.lienDetails}</li>` : ''}
        </ul>
      ` : quoteType === 'vida' || quoteType === 'salud' ? `
        <h3>Información de Salud:</h3>
        <ul>
          <li><strong>Enfermedad:</strong> ${formData.sufreEnfermedad === 'si' ? 'Sí' : 'No'}</li>
          ${formData.cualEnfermedad ? `<li><strong>Detalle:</strong> ${formData.cualEnfermedad}</li>` : ''}
          <li><strong>Asegurar a más personas:</strong> ${formData.deseaAsegurarAlguienMas === 'si' ? 'Sí' : 'No'}</li>
          ${formData.cantidadPersonasAdicionales ? `<li><strong>Cantidad adicional:</strong> ${formData.cantidadPersonasAdicionales}</li>` : ''}
        </ul>
        
        ${formData.personasAdicionales && formData.personasAdicionales.length > 0 ? `
          <h3>Personas Adicionales:</h3>
          ${formData.personasAdicionales.map((persona, index) => `
            <div style="margin-left: 20px; margin-bottom: 10px;">
              <h4>Persona ${index + 1}:</h4>
              <ul>
                <li><strong>Nombre:</strong> ${persona.nombreCompleto}</li>
                <li><strong>Documento:</strong> ${persona.numeroDocumento}</li>
                <li><strong>Edad:</strong> ${persona.edad}</li>
                <li><strong>Teléfono:</strong> ${persona.celular}</li>
                <li><strong>Enfermedad:</strong> ${persona.sufreEnfermedad === 'si' ? 'Sí' : 'No'}</li>
                ${persona.cualEnfermedad ? `<li><strong>Detalle:</strong> ${persona.cualEnfermedad}</li>` : ''}
              </ul>
            </div>
          `).join('')}
        ` : ''}
      ` : ''}
    `;
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
       quoteType === 'arl' ? 'ARL' : 'Empresarial') :
      (quoteType === 'vehiculos' ? 'Auto' : 
       quoteType === 'vida' ? 'Vida' : 
       quoteType === 'salud' ? 'Salud' :
       quoteType === 'mascotas' ? 'Mascotas' : 'Hogar');

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
    try {
      const sheetsService = new GoogleSheetsService();
      await sheetsService.addQuoteRecord(quoteType, formData, quoteId, isBusinessQuote);
      console.log('Quote saved to Google Sheets successfully');
    } catch (sheetsError) {
      console.error('Error saving to Google Sheets:', sheetsError);
    }

    // 2. Enviar correo al administrador
    let adminEmailId = null;
    try {
      console.log('Intentando enviar correo al administrador...');
      const adminEmail = await resend.emails.send({
        from: 'notificaciones@updates.stayirrelevant.com',
        to: ['juanpablog857@gmail.com'],
        subject: `Nueva Solicitud de Cotización #${quoteId} - ${insuranceType}${isBusinessQuote ? ' (Empresarial)' : ''}`,
        html: adminEmailTemplate,
      });

      if (adminEmail && adminEmail.data && adminEmail.data.id) {
        adminEmailId = adminEmail.data.id;
        console.log('Correo al administrador enviado exitosamente:', adminEmailId);
      } else {
        console.log('Respuesta del correo admin:', JSON.stringify(adminEmail, null, 2));
        throw new Error('La respuesta del envío de correo no tiene el formato esperado');
      }
    } catch (emailError) {
      console.error('Error enviando correo al administrador:', emailError);
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
        message: 'Solicitud procesada exitosamente',
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