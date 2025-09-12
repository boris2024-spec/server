# Frontend Integration Guide

## Интеграция с Backend на Vercel

### 1. Переменные окружения для фронтенда
Создайте файл `.env.local` в корне React приложения:

```bash
# Для локальной разработки
VITE_API_URL=http://localhost:3001

# Для production (замените на ваш домен backend)
# VITE_API_URL=https://your-backend.vercel.app/api
```

### 2. Пример использования API в React

```javascript
// services/emailService.js
const API_URL = import.meta.env.VITE_API_URL || '/api';

export const sendEmail = async (emailData) => {
  try {
    const response = await fetch(`${API_URL}/send-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailData)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

export const checkHealth = async () => {
  try {
    const response = await fetch(`${API_URL}/health`);
    return await response.json();
  } catch (error) {
    console.error('Health check failed:', error);
    throw error;
  }
};
```

### 3. Компонент формы отправки email

```jsx
// components/ContactForm.jsx
import { useState } from 'react';
import { sendEmail } from '../services/emailService';

export const ContactForm = () => {
  const [formData, setFormData] = useState({
    to: '',
    subject: '',
    message: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus('');

    try {
      await sendEmail({
        to: formData.to,
        subject: formData.subject,
        text: formData.message,
        html: `<p>${formData.message}</p>`
      });
      
      setStatus('Email sent successfully!');
      setFormData({ to: '', subject: '', message: '' });
    } catch (error) {
      setStatus('Failed to send email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="To"
        value={formData.to}
        onChange={(e) => setFormData({...formData, to: e.target.value})}
        required
      />
      <input
        type="text"
        placeholder="Subject"
        value={formData.subject}
        onChange={(e) => setFormData({...formData, subject: e.target.value})}
        required
      />
      <textarea
        placeholder="Message"
        value={formData.message}
        onChange={(e) => setFormData({...formData, message: e.target.value})}
        required
      />
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Sending...' : 'Send Email'}
      </button>
      {status && <p>{status}</p>}
    </form>
  );
};
```

### 4. Настройка переменных в Vercel (Frontend)
В настройках проекта фронтенда на Vercel добавьте:
```
VITE_API_URL=https://your-backend.vercel.app/api
```

### 5. Обновление CORS на Backend
Убедитесь, что в переменных окружения backend указан правильный домен фронтенда:
```
CLIENT_ORIGIN=https://your-frontend.vercel.app
```

### 6. Тестирование интеграции
1. Проверьте health endpoint: `GET https://your-backend.vercel.app/api/health`
2. Отправьте тестовый email через форму
3. Проверьте логи функций в Vercel Dashboard