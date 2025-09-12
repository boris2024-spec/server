# 🚀 Быстрая настройка Vercel Backend

## 📋 Что нужно сделать:

### 1. Добавить переменные окружения в Vercel

Зайдите в [Vercel Dashboard](https://vercel.com/dashboard) → проект **"server"** → **Settings** → **Environment Variables**

Добавьте каждую переменную отдельно:

```
SMTP_HOST = smtp.gmail.com
SMTP_PORT = 465
SMTP_SECURE = true
SMTP_USER = boriaa85@gmail.com
SMTP_PASS = owhy oovl ywzf rlnl
MAIL_FROM = "Boris <boriaa85@gmail.com>"
CLIENT_ORIGIN = https://mdimona-cahnqf9ph-boris-projects-342aa06a.vercel.app,http://localhost:3000
```

### 2. Redeploy проект

После добавления всех переменных:
1. Перейдите в **Deployments**
2. Нажмите **"Redeploy"** на последнем деплое
3. Дождитесь завершения

### 3. Проверьте работу

После redeploy проверьте:

**Диагностика:** `https://server-nine-kohl-18.vercel.app/api/debug`
- Должно показать все переменные как `true`

**Health check:** `https://server-nine-kohl-18.vercel.app/api/health`
- Должно вернуть `{"ok":true}`

**Фронтенд:** Попробуйте отправить форму бронирования

### 4. Если проблемы остаются

Проверьте логи в Vercel:
**Dashboard → Functions → кликните на функцию → View Function Logs**

## ✅ Результат

После этих действий:
- ✅ CORS ошибка исчезнет
- ✅ Форма бронирования будет работать
- ✅ Email будет отправляться

## 🆘 Если ничего не помогает

Временно установите `CLIENT_ORIGIN = *` для тестирования
(НЕ оставляйте так в продакшене!)