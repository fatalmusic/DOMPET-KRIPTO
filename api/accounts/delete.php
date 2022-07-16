<?php
	header("Access-Control-Allow-Origin: *");
	header("Access-Control-Allow-Methods: DELETE");
	header("Content-Type: application/json");

	if($_SERVER["REQUEST_METHOD"] == "DELETE") {
		$input = json_decode(file_get_contents("php://input"), true);

		$username = !empty($input["username"]) ? $input["username"] : die();
		$account = !empty($input["account"]) ? $input["account"] : die();
		
		$utils = require_once("../utils.php");
		$helper = new Utils($username);

		$token = !empty($input["token"]) ? $input["token"] : die();
		if($helper->verifySession($token)) {
			if($helper->username == "admin") {
				if(trim(strtolower($account)) !== "admin") {
					$helper->rrmdir("../data/users/" . $account);

					$delete = !is_dir("../data/users/" . $account);

					if($delete) {
						echo json_encode(array("message" => "akun telah dihapus."));
					} else {
						echo json_encode(array("error" => "akun tidak dapat dihapus."));
					}
				} else {
					echo json_encode(array("error" => "akun admin tidak dapat dihapus."));
				}
			} else {
				echo json_encode(array("error" => "hanya admin yang memiliki akses."));
			}
		} else {
			echo json_encode(array("error" => "tolong login terlebih dahulu."));
		}
	} else {
		echo json_encode(array("error" => "gunakan metode DELETE."));
	}
?>