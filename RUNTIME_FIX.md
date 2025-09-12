# Исправление ошибки Runtime

## Проблема
```
Error: Function Runtimes must have a valid version, for example `now-php@1.0.0`.
```

## Решение
В новых версиях Vercel не нужно явно указывать `runtime: "nodejs20.x"` в `vercel.json`. Vercel автоматически определяет Node.js runtime для `.js` и `.ts` файлов.

## Изменения:

### vercel.json (исправлено):
```json
{
    "functions": {
        "api/**/*.ts": {
            "maxDuration": 10
        }
    },
    "routes": [
        {
            "src": "^/api/(.*)$",
            "dest": "/api/index.ts"
        },
        {
            "src": "^/health$",
            "dest": "/api/index.ts"
        },
        {
            "src": "^/send-email$",
            "dest": "/api/index.ts"
        }
    ]
}
```

### api/index.ts (упрощено):
```typescript
import serverless from "serverless-http";
import { app } from "../src/app.js";

const handler = serverless(app);
export default handler;
```

## Готово для деплоя!
Теперь проект должен успешно развертываться на Vercel без ошибок runtime.