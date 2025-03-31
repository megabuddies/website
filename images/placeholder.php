<?php
// Получаем имя запрошенного изображения
$imageName = isset($_GET['name']) ? $_GET['name'] : 'placeholder';

// Устанавливаем заголовок для изображения
header('Content-Type: image/png');

// Создаем изображение
$width = 300;
$height = 300;
$image = imagecreatetruecolor($width, $height);

// Устанавливаем цвета
$bgColor = imagecolorallocate($image, 18, 18, 18);
$gridColor = imagecolorallocate($image, 0, 255, 65);
$textColor = imagecolorallocate($image, 0, 255, 65);

// Заполняем фон
imagefill($image, 0, 0, $bgColor);

// Рисуем сетку
imagesetthickness($image, 1);
for ($y = 0; $y < $height; $y += 20) {
    imageline($image, 0, $y, $width, $y, $gridColor);
}
for ($x = 0; $x < $width; $x += 20) {
    imageline($image, $x, 0, $x, $height, $gridColor);
}

// Добавляем текст
$text = $imageName;
$font = 5; // Встроенный шрифт
$textWidth = imagefontwidth($font) * strlen($text);
$textHeight = imagefontheight($font);
$x = ($width - $textWidth) / 2;
$y = ($height - $textHeight) / 2;

imagestring($image, $font, $x, $y, $text, $textColor);

// Выводим изображение
imagepng($image);
imagedestroy($image);
?>
