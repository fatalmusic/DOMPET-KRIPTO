<?php
	header("Access-Control-Allow-Origin: *");
	header("Access-Control-Allow-Methods: DELETE");
	header("Content-Type: application/json");

	if($_SERVER["REQUEST_METHOD"] == "DELETE") {
		$input = json_decode(file_get_contents("php://input"), true);

		$username = !empty($input["username"]) ? $input["username"] : die();
		
		$utils = require_once("../utils.php");
		$helper = new Utils($username);

		$token = !empty($input["token"]) ? $input["token"] : die();
		if($helper->verifySession($token)) {
			$delete = $helper->rrmdir("../data/historical/");

			if($delete) {
				echo json_encode(array("message" => "cache berhasil dihapus."));
			} else {
				echo json_encode(array("error" => "gagal dihapus."));
			}
		} else {
			echo json_encode(array("error" => "tolong login terlebih dahulu.."));
		}
	} else {
		echo json_encode(array("error" => "request error, coba lagi"));
	}
?>