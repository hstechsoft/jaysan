<?php

include "firebase_token.php";

function send_fcm(array $tokens, string $title, string $body, string $url)
{
    $accessToken = getFirebaseAccessToken();
    $projectId = "jaysan-8fa8d";
echo "Access Token: " . $accessToken . "<br>";
    foreach ($tokens as $fcm_token) {

        $payload = [
            "message" => [
                "token" => $fcm_token,
                "notification" => [
                    "title" => $title,
                    "body"  => $body,
                    // "image" => $image_url ?? "https://5.imimg.com/data5/SELLER/Default/2022/9/DU/WF/FQ/24355906/jaysan-round-baler.jpg"
                ],
                "data" => [
                    "url" => $url
                ]
            ]
        ];

        $ch = curl_init("https://fcm.googleapis.com/v1/projects/$projectId/messages:send");

        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POST => true,
            CURLOPT_HTTPHEADER => [
                "Authorization: Bearer $accessToken",
                "Content-Type: application/json"
            ],
            CURLOPT_POSTFIELDS => json_encode($payload)
        ]);

        $response = curl_exec($ch);

        // Check curl errors
        if (curl_errno($ch)) {
            return "Curl Error: " . curl_error($ch) . "<br>";
        } else {

echo "FCM Response for token $fcm_token: " . $response . "<br>";
           
          
        }

        curl_close($ch);
    }
}

?>