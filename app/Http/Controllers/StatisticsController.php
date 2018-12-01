<?php

namespace App\Http\Controllers;

use App\Jobs\ProcessPayment;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Redis;

use Response;
use Validator;

class StatisticsController extends Controller
{
 	public function index(Request $request) {

		// Method 1
		return ($this->method1());
		//return ($this->method2());

	}

	private function method1() {

		$keys = Redis::keys("*");
		$sum = 0;
		forEach($keys as $key) {
			if (strpos($key, 'payment') !== false) {
				$amount = explode("_",$key)[1];
				$sum = $sum + floatval($amount);
			}
		}
		$average = $sum / count($keys);
		$response = [
			"total_amount"=>$sum,
			"avg_amount"=>$average
		];
		return (Response::json($response, 200));
	}

	private function method2() {

	}
}
