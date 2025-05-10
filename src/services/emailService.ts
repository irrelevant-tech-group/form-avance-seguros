interface FormData {
  name: string;
  email: string;
  company: string;
  [key: string]: any;
}

export const sendRegistrationEmails = async (formData: FormData) => {
  try {
    const response = await fetch('/.netlify/functions/send-emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ formData }),
    });

    if (!response.ok) {
      throw new Error('Error sending emails');
    }

    return await response.json();
  } catch (error) {
    console.error('Error in sendRegistrationEmails:', error);
    throw error;
  }
}; 