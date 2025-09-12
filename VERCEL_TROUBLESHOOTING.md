# Диагностика проблем с Vercel Backend

## 🚨 Текущая проблема
API endpoint возвращает ошибку: `FUNCTION_INVOCATION_FAILED`

## 🔍 Возможные причины:

### 1. Отсутствуют переменные окружения
В Vercel Dashboard → Project → Settings → Environment Variables должны быть:
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=boriaa85@gmail.com
SMTP_PASS=owhy oovl ywzf rlnl
MAIL_FROM="Boris <boriaa85@gmail.com>"
CLIENT_ORIGIN=*
```

### 2. Проблема с импортами в serverless функции
Проверьте что все зависимости правильно установлены

### 3. Ошибка в коде
Проверьте логи в Vercel Dashboard → Functions

## 🛠 Шаги для исправления:

### Шаг 1: Добавить переменные окружения
1. Зайдите в Vercel Dashboard
2. Выберите проект "server"
3. Settings → Environment Variables
4. Добавьте все переменные из файла `.env.production`

### Шаг 2: Временно разрешить все домены для CORS
Добавьте в Environment Variables:
```
CLIENT_ORIGIN=*
```

### Шаг 3: Redeploy проект
После добавления переменных нажмите "Redeploy" в Deployments

### Шаг 4: Проверить логи
Если проблема остается, проверьте логи в:
Vercel Dashboard → Functions → Click on function → View Logs

## 🧪 Тестирование после исправления:

```bash
# Проверка health endpoint
curl https://server-nine-kohl-18.vercel.app/api/health

# Должен вернуть: {"ok":true}
```

## 📝 Примечание
Сейчас фронтенд настроен на работу с вашим Vercel API:
```
REACT_APP_API_URL=https://server-nine-kohl-18.vercel.app/api
```