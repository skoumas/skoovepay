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
		// $list = Redis::lrange("payments",0,-1);
		$keys = Redis::keys("*");

		$sum = 0;
		forEach($keys as $key) {

			if (strpos($key, 'p_') !== false) {
				if(isset(explode("_",$key)[2])) {
					$amount = explode("_",$key)[2];
					$sum = $sum + floatval($amount);
				}
			}
		}
		if (count($keys)>0)
			$average = $sum / count($keys);
		else
			$average = 0;
		$response = [
			"total_amount"=>$sum,
			"avg_amount"=>$average
		];
		return (Response::json($response, 200));
	}

	private function method2() {

	}
}
