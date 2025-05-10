const { Resend } = require('resend');

// Inicializar Resend con la API key
const resend = new Resend(process.env.RESEND_API_KEY);

exports.handler = async (event, context) => {
  // Solo permitir POST requests
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
      userEmail 
    } = data;

    // Determinar el tipo de seguro
    const insuranceType = quoteType === 'vehiculos' ? 'Auto' : 
                         quoteType === 'vida' ? 'Vida' : 'Salud';

    // Template para el correo al administrador
    const adminEmailTemplate = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #0A4958; color: white; padding: 20px; text-align: center;">
          <h1>Nueva Solicitud de Cotización</h1>
          <p>Número de Referencia: ${quoteId}</p>
        </div>
        
        <div style="padding: 20px;">
          <h2>Tipo de Seguro: ${insuranceType}</h2>
          
          <h3>Información del Solicitante:</h3>
          <ul>
            <li><strong>Nombre:</strong> ${formData.ownerName || formData.nombreCompleto}</li>
            <li><strong>Documento:</strong> ${formData.identification || formData.numeroDocumento}</li>
            <li><strong>Teléfono:</strong> ${formData.phone || formData.celular}</li>
            <li><strong>Email:</strong> ${userEmail}</li>
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

    // Template para el correo al usuario
    const userEmailTemplate = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #0A4958; color: white; padding: 20px; text-align: center;">
          <img src="https://storage.googleapis.com/cluvi/Imagenes/logo-avance-seguro.jpg" alt="Avance Seguros" style="max-width: 200px; margin-bottom: 10px;">
          <h1>¡Cotización Recibida!</h1>
        </div>
        
        <div style="padding: 20px;">
          <p>Estimado/a ${formData.ownerName || formData.nombreCompleto},</p>
          
          <p>Hemos recibido tu solicitud de cotización para <strong>Seguro de ${insuranceType}</strong>.</p>
          
          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Número de Referencia:</strong> ${quoteId}</p>
            <p><strong>Fecha de Solicitud:</strong> ${new Date().toLocaleString('es-CO')}</p>
          </div>
          
          <h3>¿Qué sigue?</h3>
          <ol style="line-height: 1.8;">
            <li>Nuestro equipo analizará tu información</li>
            <li>Te contactaremos en máximo 24 horas hábiles</li>
            <li>Recibirás opciones personalizadas para tu ${quoteType === 'vehiculos' ? 'vehículo' : 'protección'}</li>
            <li>Podrás elegir el plan que mejor se adapte a tus necesidades</li>
          </ol>
          
          <div style="background-color: #e8f5e9; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h4 style="margin-top: 0;">Contacto:</h4>
            <p>📱 +57 300 123 4567</p>
            <p>✉️ contacto@avanceseguros.com</p>
          </div>
          
          <p>Gracias por confiar en nosotros para proteger lo que más importa.</p>
          
          <p>Atentamente,<br>
          <strong>Equipo Avance Seguros</strong></p>
        </div>
        
        <div style="background-color: #0A4958; color: white; padding: 15px; text-align: center; margin-top: 20px;">
          <p style="margin: 0; font-size: 12px;">© 2025 Avance Seguros. Todos los derechos reservados.</p>
        </div>
      </div>
    `;

    // Correo al administrador
    const adminEmail = await resend.emails.send({
      from: 'notificaciones@updates.stayirrelevant.com',
      to: ['juanpablog857@gmail.com'], // Cambiar por el email real del admin
      subject: `Nueva Solicitud de Cotización #${quoteId} - ${insuranceType}`,
      html: adminEmailTemplate,
    });

    // Correo al usuario - validar que exista el email
    let userEmailResponse = null;
    if (userEmail) {
      userEmailResponse = await resend.emails.send({
        from: 'notificaciones@updates.stayirrelevant.com',
        to: [userEmail],
        subject: `Confirmación: Tu Solicitud de Cotización #${quoteId}`,
        html: userEmailTemplate,
      });
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
        adminEmailId: adminEmail.data.id,
        userEmailId: userEmailResponse ? userEmailResponse.data.id : null,
        message: 'Correos enviados exitosamente'
      })
    };
  } catch (error) {
    console.error('Error sending emails:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        success: false,
        error: error.message
      })
    };
  }
};