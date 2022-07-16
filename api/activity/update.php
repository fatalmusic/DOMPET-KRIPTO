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
			$txID = !empty($input["txID"]) ? $input["txID"] : die();
			$id = !empty($input["id"]) ? $input["id"] : die();
			$symbol = !empty($input["symbol"]) ? $input["symbol"] : die();
			$date = !empty($input["date"]) ? $input["date"] : die();
			$type = !empty($input["type"]) ? $input["type"] : die();
			$amount = !empty($input["amount"]) ? $input["amount"] : die();
			$fee = !empty($input["fee"]) ? $input["fee"] : 0;
			$notes = !empty($input["notes"]) ? $input["notes"] : "-";

			if($helper->validDate($date)) {
				$activity = array("id" => $id, "symbol" => $symbol, "date" => $date, "time" => strtotime($date), "type" => $type, "amount" => $amount, "fee" => $fee, "notes" => $notes);
			
				if($type == "buy" || $type == "sell" || $type == "transfer") {
					if($type == "buy" || $type == "sell") {
						$exchange = !empty($input["exchange"]) ? $input["exchange"] : "-";
						$pair = !empty($input["pair"]) ? $input["pair"] : "-";
						$price = !empty($input["price"]) ? $input["price"] : 0;
					
						$activity["exchange"] = $exchange;
						$activity["pair"] = $pair;
						$activity["price"] = $price;
					} else if($type == "transfer") {
						$from = !empty($input["from"]) ? $input["from"] : "-";
						$to = !empty($input["to"]) ? $input["to"] : "-";

						$activity["from"] = $from;
						$activity["to"] = $to;
					}
				} else {
					echo json_encode(array("error" => "request error, coba lagi"));
				}

				$current = json_decode(file_get_contents($helper->activityFile), true);
		
				if(array_key_exists($txID, $current)) {
					$current[$txID] = $activity;

					if(time() - 1 > filemtime($helper->activityFile)) {
						$update = file_put_contents($helper->activityFile, json_encode($current));

						if($update) {
							echo json_encode(array("message" => "transaksi berhasil diperbarui."));
						} else {
							echo json_encode(array("error" => "transaksi gagal diperbarui."));
						}
					} else {
						echo json_encode(array("error" => "permintaan duplikat terdeteksi. hanya yang lebih awal akan diproses."));
					}
				} else {
					echo json_encode(array("error" => "transaksi tidak ditemukan."));
				}
			} else {
				echo json_encode(array("error" => "tanggal invalid."));
			}
		} else {
			echo json_encode(array("error" => "tolong login terlebih dahulu."));
		}
	} else {
		echo json_encode(array("error" => "request error, coba lagi"));
	}
?>