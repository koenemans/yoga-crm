<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Services\CreditService;
use Illuminate\Console\Command;

class ExpireCredits extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'credits:expire';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Expire old credits based on expiry dates';

    /**
     * Execute the console command.
     */
    public function handle(CreditService $creditService): int
    {
        $this->info('Expiring old credits...');

        $count = $creditService->expireCredits();

        $this->info("Expired {$count} credit transactions.");

        return Command::SUCCESS;
    }
}
