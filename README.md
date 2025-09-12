# Email Server

Сервер для отправки email сообщений через SMTP.

## Настройка

1. Скопируйте `.env.example` в `.env` и заполните переменные окружения
2. Установите зависимости: `npm install`
3. Соберите проект: `npm run build`

## Переменные окружения

```
PORT=3001
CLIENT_ORIGIN=http://localhost:3000
MAIL_FROM="Your Name <your-email@gmail.com>"
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-16-digit-app-password
```

⚠️ **Важно**: Для Gmail нужно включить App Passwords в настройках аккаунта и использовать 16-значный пароль приложения в `SMTP_PASS`.

## Команды

- `npm run dev` - запуск в режиме разработки с автоперезагрузкой
- `npm run build` - сборка TypeScript в JavaScript
- `npm start` - запуск production версии

## API

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

## Ограничения

- Максимум 5 писем в минуту с одного IP адреса
- Максимальный размер тела запроса: 200kb
- CORS настроен для указанных в `CLIENT_ORIGIN` доменов

## Безопасность

- Используется helmet для базовой защиты
- Rate limiting для предотвращения спама
- Валидация данных с помощью Zod
- CORS защита
