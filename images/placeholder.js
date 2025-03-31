// Создаем заглушки для изображений
document.addEventListener('DOMContentLoaded', function() {
    // Функция для создания заглушки изображения
    function createPlaceholderImage(width, height, text, bgColor = '#121212', textColor = '#00ff41') {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        
        // Фон
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, width, height);
        
        // Сетка
        ctx.strokeStyle = 'rgba(0, 255, 65, 0.2)';
        ctx.lineWidth = 1;
        
        // Горизонтальные линии
        for (let y = 0; y < height; y += 20) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }
        
        // Вертикальные линии
        for (let x = 0; x < width; x += 20) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
            ctx.stroke();
        }
        
        // Текст
        ctx.fillStyle = textColor;
        ctx.font = 'bold 16px "VT323", monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, width/2, height/2);
        
        // Добавляем неоновое свечение
        ctx.shadowColor = textColor;
        ctx.shadowBlur = 10;
        ctx.fillText(text, width/2, height/2);
        
        return canvas.toDataURL();
    }
    
    // Заменяем отсутствующие изображения на заглушки
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.onerror = function() {
            const width = img.width || 200;
            const height = img.height || 200;
            const text = img.alt || 'Mega Buddies';
            img.src = createPlaceholderImage(width, height, text);
        };
    });
});
