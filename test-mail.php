<?php

require_once __DIR__ . '/phpmailer/Exception.php';
require_once __DIR__ . '/phpmailer/PHPMailer.php';
require_once __DIR__ . '/phpmailer/SMTP.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

echo '<h2>FPCO Mail Test</h2>';
echo '<pre>';

$mail = new PHPMailer(true);

try {
    $mail->isSMTP();
    $mail->SMTPDebug  = 2; // Show full SMTP conversation
    $mail->Host       = 'mail.sprint-co.com';
    $mail->SMTPAuth   = true;
    $mail->Username   = 'noreply@sprint-co.com';
    $mail->Password   = 'Sprint@2030';
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
    $mail->Port       = 465;
    $mail->Timeout    = 10;

    $mail->setFrom('noreply@sprint-co.com', 'FPCO Website');
    $mail->addAddress('rajesh.gholap@sprinteriors.com', 'Rajesh Gholap');

    $mail->isHTML(false);
    $mail->CharSet = 'UTF-8';
    $mail->Subject = 'FPCO Test Email';
    $mail->Body    = 'This is a test email from the FPCO website. If you received this, the mail setup is working.';

    $mail->send();
    echo "\n\n✅ SUCCESS — Email sent!";
} catch (Exception $e) {
    echo "\n\n❌ FAILED — " . $mail->ErrorInfo;
}

echo '</pre>';
