# Vercel Deployment Guide

## Подготовка к деплою на Vercel

### 1. Структура проекта для Vercel
Проект адаптирован для Vercel serverless функций:
- `src/app.ts` - основное Express приложение без app.listen()
- `src/index.ts` - локальный сервер для разработки
- `api/index.ts` - Vercel serverless entry point
- `vercel.json` - конфигурация Vercel

### 2. Переменные окружения на Vercel
В настройках проекта на Vercel добавьте следующие переменные:

```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
MAIL_FROM="Your Name <your-email@gmail.com>"
CLIENT_ORIGIN=https://your-frontend.vercel.app
```

**ВАЖНО**: `CLIENT_ORIGIN` должен содержать точный домен вашего фронтенда для CORS.

### 3. Эндпоинты API после деплоя
После деплоя API будет доступен по адресам:
- `https://your-api.vercel.app/api/health` (проверка работоспособности)
- `https://your-api.vercel.app/api/send-email` (отправка email)

### 4. Настройка фронтенда
В вашем React приложении используйте:

```javascript
const API_URL = import.meta.env.VITE_API_URL || 'https://your-api.vercel.app/api';

// Отправка email
const response = await fetch(`${API_URL}/send-email`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    to: 'recipient@example.com',
    subject: 'Subject',
    text: 'Plain text message',
    html: '<p>HTML message</p>'
  })
});
```

### 5. Шаги деплоя
1. Пушните код в GitHub репозиторий
2. Зайдите в Vercel Dashboard
3. Создайте новый проект из GitHub репозитория
4. Добавьте переменные окружения (Settings → Environment Variables)
5. Deploy

### 6. Решение проблем
- **500 ошибка**: Проверьте переменные окружения и логи функций
- **CORS ошибки**: Убедитесь что `CLIENT_ORIGIN` содержит правильный домен
- **"net is not implemented"**: Функция запущена в Edge runtime вместо Node.js
- **Module not found**: Зависимость не добавлена в `dependencies` (не `devDependencies`)

### 7. Локальное тестирование Vercel
```bash
npm install -g vercel
vercel dev
```