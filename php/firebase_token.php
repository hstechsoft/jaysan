<?php

function getFirebaseAccessToken() {
    $serviceAccountPath = "/var/www/html/php/firebase/firebase_service_account.json";

    $json = json_decode(file_get_contents($serviceAccountPath), true);

    $header = [
        "alg" => "RS256",
        "typ" => "JWT"
    ];

    $now = time();

    $payload = [
        "iss" => $json["client_email"],
        "scope" => "https://www.googleapis.com/auth/firebase.messaging",
        "aud" => "https://oauth2.googleapis.com/token",
        "iat" => $now,
        "exp" => $now + 3600
    ];

    $base64UrlEncode = function ($data) {
        return rtrim(strtr(base64_encode(json_encode($data)), '+/', '-_'), '=');
    };

    $jwtHeader = $base64UrlEncode($header);
    $jwtPayload = $base64UrlEncode($payload);
    $jwtUnsigned = "$jwtHeader.$jwtPayload";

    openssl_sign($jwtUnsigned, $signature, $json["private_key"], OPENSSL_ALGO_SHA256);

    $jwtSignature = rtrim(strtr(base64_encode($signature), '+/', '-_'), '=');

    $jwt = "$jwtUnsigned.$jwtSignature";

    $ch = curl_init("https://oauth2.googleapis.com/token");
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST => true,
        CURLOPT_HTTPHEADER => ["Content-Type: application/x-www-form-urlencoded"],
        CURLOPT_POSTFIELDS => http_build_query([
            "grant_type" => "urn:ietf:params:oauth:grant-type:jwt-bearer",
            "assertion" => $jwt
        ])
    ]);

    $response = curl_exec($ch);
    curl_close($ch);

    $result = json_decode($response, true);

    return $result["access_token"] ?? null;
}
