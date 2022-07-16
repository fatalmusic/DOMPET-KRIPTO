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
			$txID = !empty($input["txID"]) ? $input["txID"] : die();

			$current = json_decode(file_get_contents($helper->activityFile), true);
			unset($current[$txID]);
			$delete = file_put_contents($helper->activityFile, json_encode($current));

			if($delete) {
				echo json_encode(array("message" => "transaksi dihapus."));
			} else {
				echo json_encode(array("error" => "transaksi tidak dapat dihapus."));
			}
		} else {
			echo json_encode(array("error" => "tolong login terlebih dahulu."));
		}
	} else {
		echo json_encode(array("error" => "request error, coba lagi"));
	}
?>