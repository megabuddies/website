<?php
/**
 * Fallback router for Mega Buddies website
 * This file can be used if .htaccess URL rewriting is not working
 */

// Get the requested URI
$request_uri = $_SERVER['REQUEST_URI'];
$request_path = parse_url($request_uri, PHP_URL_PATH);

// Remove leading slash
$path = ltrim($request_path, '/');

// Define routes
$routes = [
    'ai-companions' => 'ai-companions.html',
    'telegram-bots' => 'telegram-bots.html',
    '' => 'index.html',
    'index' => 'index.html'
];

// Check if route exists
if (array_key_exists($path, $routes)) {
    $file = $routes[$path];
    
    // Check if file exists
    if (file_exists($file)) {
        // Set proper content type
        header('Content-Type: text/html; charset=UTF-8');
        
        // Include the HTML file
        include $file;
        exit;
    }
}

// If no route found, show 404
http_response_code(404);
if (file_exists('404.html')) {
    include '404.html';
} else {
    echo '<!DOCTYPE html>
<html>
<head><title>404 Not Found</title></head>
<body>
<h1>404 Not Found</h1>
<p>The requested page could not be found.</p>
<a href="/">Return to Home</a>
</body>
</html>';
}
?>