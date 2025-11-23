<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Services\PaymentService;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Log;

class MollieWebhookController extends Controller
{
    public function __construct(
        protected PaymentService $paymentService
    ) {}

    /**
     * Handle Mollie webhook.
     */
    public function __invoke(Request $request): Response
    {
        $paymentId = $request->input('id');

        if (!$paymentId) {
            Log::warning('Mollie webhook received without payment ID');
            return response()->noContent(400);
        }

        try {
            $this->paymentService->handleWebhook($paymentId);
            return response()->noContent(200);
        } catch (\Exception $e) {
            Log::error('Mollie webhook processing failed', [
                'payment_id' => $paymentId,
                'error' => $e->getMessage(),
            ]);
            return response()->noContent(500);
        }
    }
}
