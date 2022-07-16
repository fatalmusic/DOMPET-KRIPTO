<?php
	header("Access-Control-Allow-Origin: *");
	header("Access-Control-Allow-Methods: PUT");
	header("Content-Type: application/json");

	if($_SERVER["REQUEST_METHOD"] == "PUT") {
		$input = json_decode(file_get_contents("php://input"), true);

		$username = !empty($input["username"]) ? $input["username"] : die();

		$utils = require_once("../utils.php");
		$helper = new Utils($username);

		$token = !empty($input["token"]) ? $input["token"] : die();
		if($helper->verifySession($token)) {
			$key = !empty($input["key"]) ? $input["key"] : die();
			$value = isset($input["value"]) ? $input["value"] : die();

			$current = json_decode(file_get_contents($helper->settingsFile), true);
		
			if(array_key_exists($key, $current)) {
				$current[$key] = $value;

				$update = file_put_contents($helper->settingsFile, json_encode($current));

				if($update) {
					echo json_encode(array("message" => "pengaturan diperbarui"));
				} else {
					echo json_encode(array("error" => "pengaturan gagal diperbarui"));
				}
			} else {
				echo json_encode(array("error" => "pengaturan tidak ditemukan"));
			}
		} else {
			echo json_encode(array("error" => "tolong login terlebih dahulu."));
		}
	} else {
		echo json_encode(array("error" => "request error, coba lagi"));
	}
?>