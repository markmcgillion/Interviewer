<?php

$URL     = $_GET["URL"];
$METHOD  = $_GET["METHOD"];
$HEADER  = $_GET["HEADER"];
$AMOUNT = $_GET["AMOUNT"];



    $curl = curl_init();
    
    curl_setopt_array($curl, array(
        CURLOPT_URL => $URL,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_ENCODING => "",
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 30,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => $METHOD,
        CURLOPT_POSTFIELDS => $AMOUNT,
        CURLOPT_HTTPHEADER => array(
            "accept: application/json",
            "cache-control: no-cache",
            "content-type: application/json",
            $HEADER
        )
    ));

    $response  = curl_exec($curl);
    $err       = curl_error($curl);
    $http_code = curl_getinfo($curl, CURLINFO_HTTP_CODE);

    http_response_code($http_code);

    curl_close($curl);
    
    if ($err) {
        http_response_code(404);
        echo "Could not resolve Host";
    } else {
        
            echo $response;
        
        
    }

?>