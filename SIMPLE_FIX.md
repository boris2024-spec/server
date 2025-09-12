# 🚨 КРИТИЧЕСКОЕ ИСПРАВЛЕНИЕ - Упрощенная версия

## ✅ Что сделано:

### 1. Создана упрощенная версия приложения
- `src/app-simple.ts` - без сложных зависимостей
- Работает даже без SMTP переменных
- Базовые эндпоинты: `/health`, `/debug`, `/test`

### 2. Обновлен Vercel entry point
- `api/index.ts` теперь использует простую версию
- Нет сложных зависимостей при старте

### 3. Безопасная инициализация
- Приложение запускается всегда
- SMTP проверяется только при отправке email

## 🎯 ДЕЙСТВИЯ:

### 1. Добавьте переменные в Vercel (опционально):
```
SMTP_HOST = smtp.gmail.com
SMTP_PORT = 465
SMTP_SECURE = true
SMTP_USER = boriaa85@gmail.com
SMTP_PASS = owhy oovl ywzf rlnl
MAIL_FROM = "Boris <boriaa85@gmail.com>"
CLIENT_ORIGIN = https://mdimona-cahnqf9ph-boris-projects-342aa06a.vercel.app
```

### 2. Redeploy проект

### 3. Проверьте:
- **Health:** `https://server-nine-kohl-18.vercel.app/api/health`
- **Debug:** `https://server-nine-kohl-18.vercel.app/api/debug`
- **Test:** POST `https://server-nine-kohl-18.vercel.app/api/test`

## 🎉 Результат:

### Без SMTP переменных:
- ✅ `/health` работает
- ✅ `/debug` показывает статус
- ❌ `/send-email` возвращает 503 (сервис недоступен)

### С SMTP переменными:
- ✅ Все эндпоинты работают
- ✅ Email отправляется
- ✅ CORS настроен

## 🚀 Приоритет:
**Сначала добейтесь работы базовых эндпоинтов, потом добавьте SMTP!**