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
			$id = !empty($input["id"]) ? $input["id"] : die();

			$current = json_decode(file_get_contents($helper->watchlistFile), true);
			unset($current[$id]);
			$delete = file_put_contents($helper->watchlistFile, json_encode($current));

			if($delete) {
				echo json_encode(array("message" => "Koin dihapus dari daftar Favorit."));
			} else {
				echo json_encode(array("error" => "koin gagal dihapus dari daftar favorit."));
			}
		} else {
			echo json_encode(array("error" => "tolong login terlebih dahulu."));
		}
	} else {
		echo json_encode(array("error" => "request error, coba lagi"));
	}
?>