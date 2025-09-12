# 🚨 CORS Ошибка - Быстрое исправление

## Проблема
```
Access to fetch at 'https://server-nine-kohl-18.vercel.app/api/send-email' 
from origin 'https://mdimona-cahnqf9ph-boris-projects-342aa06a.vercel.app' 
has been blocked by CORS policy
```

## ✅ Решение

### Шаг 1: Обновить переменную CLIENT_ORIGIN в Vercel Backend

1. Зайдите в [Vercel Dashboard](https://vercel.com/dashboard)
2. Выберите проект **"server"** (ваш backend)
3. Перейдите в **Settings → Environment Variables**
4. Найдите переменную `CLIENT_ORIGIN` или создайте новую
5. Установите значение:

```
CLIENT_ORIGIN=https://mdimona-cahnqf9ph-boris-projects-342aa06a.vercel.app,http://localhost:3000
```

### Шаг 2: Redeploy Backend
1. Перейдите в **Deployments**
2. Нажмите **"Redeploy"** на последнем деплое
3. Дождитесь завершения

### Шаг 3: Проверить
После redeploy проверьте форму бронирования на фронтенде.

## 🔄 Альтернативное решение (временное)

Если нужно быстро протестировать, можно временно разрешить все домены:

```
CLIENT_ORIGIN=*
```

⚠️ **НЕ используйте `*` в продакшене!**

## 📝 Объяснение

CORS (Cross-Origin Resource Sharing) блокирует запросы между доменами по умолчанию. 
Ваш backend настроен принимать запросы только с определенных доменов, указанных в `CLIENT_ORIGIN`.

Фронтенд: `https://mdimona-cahnqf9ph-boris-projects-342aa06a.vercel.app`
Backend: `https://server-nine-kohl-18.vercel.app`

Backend должен явно разрешить запросы с домена фронтенда.