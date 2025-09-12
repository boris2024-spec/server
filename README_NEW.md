# Email Server для Dimona Transportation

SMTP-сервер для отправки email с поддержкой развертывания на Vercel как serverless функции.

## 🚀 Функциональность

- **POST /send-email** - отправка email через SMTP
- **GET /health** - проверка работоспособности сервера
- Rate limiting (5 запросов в минуту)
- CORS настройки для интеграции с фронтендом
- Валидация данных с помощью Zod

## 📁 Структура проекта

```
├── src/
│   ├── app.ts          # Express приложение (без app.listen)
│   ├── index.ts        # Локальный сервер для разработки
│   ├── mailer.ts       # SMTP функциональность
│   ├── validators.ts   # Zod схемы валидации
│   └── rateLimit.ts    # Rate limiting middleware
├── api/
│   └── index.ts        # Vercel serverless entry point
├── vercel.json         # Конфигурация Vercel
├── .env                # Локальные переменные окружения
└── .env.vercel.example # Пример переменных для Vercel
```

## 🛠 Локальная разработка

### Установка зависимостей
```bash
npm install
```

### Настройка переменных окружения
Создайте файл `.env`:
```bash
PORT=3001
CLIENT_ORIGIN=http://localhost:3000
MAIL_FROM="Your Name <your-email@gmail.com>"
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

⚠️ **Важно**: Для Gmail нужно включить App Passwords и использовать 16-значный пароль приложения в `SMTP_PASS`.

### Запуск в режиме разработки
```bash
npm run dev
```

### Сборка проекта
```bash
npm run build
```

## ☁️ Развертывание на Vercel

### 1. Подготовка проекта
Проект уже подготовлен для Vercel:
- ✅ Express приложение вынесено в отдельный модуль (`src/app.ts`)
- ✅ Создан serverless entry point (`api/index.ts`)
- ✅ Настроен `vercel.json` с правильным роутингом
- ✅ Добавлен `serverless-http` в зависимости

### 2. Создание проекта на Vercel
1. Пушните код в GitHub
2. Зайдите в [Vercel Dashboard](https://vercel.com/dashboard)
3. Нажмите "Add New Project"
4. Выберите ваш GitHub репозиторий
5. Deploy

### 3. Настройка переменных окружения
В Vercel Dashboard → Project → Settings → Environment Variables добавьте:

```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
MAIL_FROM="Your Name <your-email@gmail.com>"
CLIENT_ORIGIN=https://your-frontend.vercel.app
```

### 4. API Endpoints после деплоя
- `https://your-api.vercel.app/api/health`
- `https://your-api.vercel.app/api/send-email`

## 🔗 Интеграция с фронтендом

### React/Vite пример
```javascript
const API_URL = import.meta.env.VITE_API_URL || '/api';

const sendEmail = async (emailData) => {
  const response = await fetch(`${API_URL}/send-email`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(emailData)
  });
  return response.json();
};
```

### Переменная окружения для фронтенда
```bash
# .env.local в React приложении
VITE_API_URL=https://your-backend.vercel.app/api
```

## API Документация

### POST /send-email

Отправка email сообщения.

**Тело запроса:**
```json
{
  "to": "recipient@example.com",
  "subject": "Тема письма",
  "html": "<p>HTML содержимое</p>",
  "text": "Текстовое содержимое (опционально)"
}
```

**Ответ:**
```json
{
  "ok": true
}
```

### GET /health

Проверка состояния сервера.

**Ответ:**
```json
{
  "ok": true
}
```

## 🐛 Решение проблем

### 500 Internal Server Error
- Проверьте переменные окружения в Vercel
- Убедитесь что `runtime: "nodejs20.x"` (nodemailer не работает в Edge runtime)
- Проверьте логи функций: Vercel Dashboard → Functions → Logs

### CORS ошибки
- Убедитесь что `CLIENT_ORIGIN` содержит правильный домен фронтенда
- Для множественных доменов: `CLIENT_ORIGIN=https://domain1.com,https://domain2.com`

### Module not found
- Все runtime зависимости должны быть в `dependencies`, не в `devDependencies`

## 🧪 Тестирование

### Health check
```bash
curl https://your-api.vercel.app/api/health
```

### Отправка email
```bash
curl -X POST https://your-api.vercel.app/api/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "to": "test@example.com",
    "subject": "Test",
    "text": "Test message",
    "html": "<p>Test message</p>"
  }'
```

## Ограничения и безопасность

- Максимум 5 писем в минуту с одного IP адреса
- Максимальный размер тела запроса: 200kb
- CORS настроен для указанных в `CLIENT_ORIGIN` доменов
- Используется helmet для базовой защиты
- Валидация данных с помощью Zod

## 📚 Дополнительные файлы
- `VERCEL_DEPLOY.md` - подробная инструкция по деплою
- `FRONTEND_INTEGRATION.md` - примеры интеграции с React
- `.env.vercel.example` - шаблон переменных окружения