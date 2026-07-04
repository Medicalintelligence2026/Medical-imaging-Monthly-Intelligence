<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

$counterFile = '/tmp/hotspots_may2026_counter.txt';

if (!file_exists($counterFile)) {
    file_put_contents($counterFile, '0', LOCK_EX);
}

$count = (int)file_get_contents($counterFile);

if (!isset($_COOKIE['vst_hs_may26'])) {
    $count++;
    file_put_contents($counterFile, (string)$count, LOCK_EX);
    setcookie('vst_hs_may26', '1', [
        'expires' => time() + 86400,
        'path' => '/',
        'httponly' => true,
        'samesite' => 'Lax'
    ]);
}

echo json_encode(['count' => $count], JSON_UNESCAPED_UNICODE);
