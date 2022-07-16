<?php
	header("Access-Control-Allow-Origin: *");
	header("Access-Control-Allow-Methods: PUT");
	header("Content-Type: application/json");

	if($_SERVER["REQUEST_METHOD"] == "PUT") {
		$input = json_decode(file_get_contents("php://input"), true);

		$username = !empty($input["username"]) ? $input["username"] : die();

		$utils = require_once("../utils.php");
		$helper = new Utils($username);

		$currentPassword = !empty($input["currentPassword"]) ? $input["currentPassword"] : die();
		$newPassword = !empty($input["newPassword"]) ? $input["newPassword"] : die();

		if($helper->verifyPassword($currentPassword)) {
			$current = json_decode(file_get_contents($helper->accountFile), true);
		
			$current["password"] = password_hash($newPassword, PASSWORD_DEFAULT);

			$update = file_put_contents($helper->accountFile, json_encode($current));

			if($update) {
				$helper->generateToken("web");
				$helper->generateToken("app");
				$helper->generateToken("desktop");

				echo json_encode(array("message" => "password akun berhasil dirubah."));
			} else {
				echo json_encode(array("error" => "password tidak dapat dirubah."));
			}
		} else {
			echo json_encode(array("error" => "password salah.", "valid" => false));
		}
	} else {
		echo json_encode(array("error" => "request error, coba lagi"));
	}
?>