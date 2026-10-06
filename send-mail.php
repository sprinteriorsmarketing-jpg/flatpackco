<?php

header('Content-Type: application/json');

$input = json_decode(file_get_contents('php://input'), true);
if (!is_array($input)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid input']);
    exit;
}

$name  = trim($input['Last_Name'] ?? '');
$phone = trim($input['Mobile'] ?? '');

if ($name === '' || $phone === '') {
    http_response_code(422);
    echo json_encode(['error' => 'Name and Mobile are required']);
    exit;
}

// ── Whitelist only known BMS fields (blocks arbitrary data injection) ──
$allowed = ['Last_Name', 'Mobile', 'Email', 'City', 'service',
            'Preferred_Language', 'Whatsapp_Opt_in',
            'UTM_Source', 'UTM_Medium', 'UTM_Content',
            'UTM_Term', 'Campaign_Name'];

$payload = array_intersect_key($input, array_flip($allowed));

// ── Proxy to BMS server-to-server (no CORS) ──
$ch = curl_init('http://bms.sprint-co.com/api/leads');
curl_setopt_array($ch, [
    CURLOPT_POST           => true,
    CURLOPT_POSTFIELDS     => json_encode($payload),
    CURLOPT_HTTPHEADER     => ['Content-Type: application/json', 'Accept: application/json'],
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT        => 10,
    CURLOPT_SSL_VERIFYPEER => true,
]);
$response = curl_exec($ch);
if (curl_errno($ch)) {
    error_log('BMS Lead Error: ' . curl_error($ch));
}
curl_close($ch);

echo $response ?: json_encode(['success' => true]);
exit;
