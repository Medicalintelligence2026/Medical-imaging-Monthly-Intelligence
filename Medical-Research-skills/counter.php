<?php
/**
 * 访问计数器 - 基于文件存储，24h 内同一访客不重复计数
 * 部署路径: /www/wwwroot/medicaldashboards.com.cn/Medical-Research-skills/counter.php
 */
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

$counterFile = __DIR__ . '/counter.txt';

// 初始化计数器文件
if (!file_exists($counterFile)) {
    file_put_contents($counterFile, '0', LOCK_EX);
}

$count = (int)file_get_contents($counterFile);

// 基于 Cookie 的会话去重（24小时内同一浏览器不重复计数）
if (!isset($_COOKIE['visitor_counted'])) {
    $count++;
    file_put_contents($counterFile, (string)$count, LOCK_EX);
    setcookie('visitor_counted', '1', [
        'expires' => time() + 86400,
        'path' => '/',
        'httponly' => true,
        'samesite' => 'Lax'
    ]);
}

echo json_encode(['count' => $count], JSON_UNESCAPED_UNICODE);
