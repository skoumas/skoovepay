<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Jobs\ProcessPayment;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Redis;

use Response;
use Validator;

use App\Payment;

class PaymentController extends Controller
{
 	public function index(Request $request) {

	    if (!$this->checkFormat($request)) {
			return $this->wrongFormat();
		}
		// We should be able to use this command safely now.
		$amount = json_decode($request->getContent())->amount;

		// Send to Redis first for quick calculations
		Redis::incr("counter");
		Redis::set('p_' . Redis::get("counter") . "_" . $amount , $amount, 'EX', 1200);

		// OLDER Solution
		// Send to the Queue and then to the database (MYSQL)
		//ProcessPayment::dispatch($amount);

		$payment = new Payment();
		$payment->amount = $amount;
		$payment->save();

		// Return a 201 created status code
		return response(null, 201);
	}

	private function checkFormat($request) {
		 if($request->header('Content-Type')!=='application/json') {
			return false;
		}
		$validator = Validator::make($request->all(), [
            'amount' => 'required|numeric|min:0'
        ]);
        return (!$validator->fails());
	}

	private function wrongFormat() {
		return (Response::json(array(
			'code'      =>  400,
			'message'   =>  "Wrong format"
		), 400));

	}
}
