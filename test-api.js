// Простой тест API
// Запустите этот файл с помощью: node test-api.js

const testHealth = async () => {
    try {
        const response = await fetch('http://localhost:3001/health');
        const data = await response.json();
        console.log('Health check:', data);
    } catch (error) {
        console.error('Health check failed:', error.message);
    }
};

const testSendEmail = async () => {
    try {
        const response = await fetch('http://localhost:3001/send-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                to: 'test@example.com',
                subject: 'Тестовое письмо',
                html: '<p>Это тестовое HTML письмо</p>',
                text: 'Это тестовое текстовое письмо'
            })
        });

        const data = await response.json();
        console.log('Send email test:', data);
    } catch (error) {
        console.error('Send email test failed:', error.message);
    }
};

// Запуск тестов
console.log('Тестирование API...');
testHealth();

// Осторожно с тестом отправки email - он попытается отправить реальное письмо
// testSendEmail();
