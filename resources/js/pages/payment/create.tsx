import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { CreditCard, Euro, ShieldCheck } from 'lucide-react';
import { useState } from 'react';

interface CreditPackage {
    id: number;
    name: string;
    description: string;
    credits: number;
    price: string | number;
    expiry_days: number | null;
    is_active: boolean;
}

interface Props {
    package: CreditPackage;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Credits',
        href: '/credits',
    },
    {
        title: 'Payment',
        href: '#',
    },
];

export default function PaymentCreate({ package: pkg }: Props) {
    const [processing, setProcessing] = useState(false);

    const handlePayment = () => {
        setProcessing(true);
        router.post(
            `/payment/${pkg.id}`,
            {},
            {
                onFinish: () => setProcessing(false),
            },
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Complete Payment" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                <div>
                    <h1 className="text-3xl font-bold">
                        Complete Your Purchase
                    </h1>
                    <p className="text-muted-foreground">
                        You're about to purchase credits for yoga classes
                    </p>
                </div>

                <div className="mx-auto w-full max-w-2xl">
                    <Card>
                        <CardHeader>
                            <CardTitle>Order Summary</CardTitle>
                            <CardDescription>
                                Review your purchase details
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between border-b pb-4">
                                <div>
                                    <h3 className="text-lg font-semibold">
                                        {pkg.name}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        {pkg.description}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-bold">
                                        €{Number(pkg.price).toFixed(2)}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {pkg.credits} credits
                                    </p>
                                </div>
                            </div>

                            {pkg.expiry_days && (
                                <div className="flex items-start gap-3 rounded-lg bg-muted p-4">
                                    <ShieldCheck className="mt-0.5 h-5 w-5 text-primary" />
                                    <div className="text-sm">
                                        <p className="font-medium">
                                            Credits Valid for {pkg.expiry_days}{' '}
                                            Days
                                        </p>
                                        <p className="text-muted-foreground">
                                            Your credits will expire{' '}
                                            {pkg.expiry_days} days after
                                            purchase
                                        </p>
                                    </div>
                                </div>
                            )}

                            <div className="space-y-3">
                                <h4 className="flex items-center gap-2 font-semibold">
                                    <CreditCard className="h-5 w-5" />
                                    Payment Methods
                                </h4>
                                <div className="grid gap-3">
                                    <div className="flex items-center gap-3 rounded-lg border p-4">
                                        <Euro className="h-6 w-6 text-primary" />
                                        <div className="flex-1">
                                            <p className="font-medium">iDEAL</p>
                                            <p className="text-sm text-muted-foreground">
                                                Pay securely with your bank
                                            </p>
                                        </div>
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        You'll be redirected to Mollie to
                                        complete your payment. Other payment
                                        methods (credit card, PayPal, etc.) are
                                        also available.
                                    </p>
                                </div>
                            </div>

                            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950">
                                <p className="text-sm text-blue-900 dark:text-blue-100">
                                    <strong>Secure Payment:</strong> Your
                                    payment is processed securely through
                                    Mollie, a trusted European payment provider.
                                    We never store your payment details.
                                </p>
                            </div>
                        </CardContent>
                        <CardFooter className="flex gap-3">
                            <Button
                                variant="outline"
                                onClick={() => router.visit('/credits')}
                                disabled={processing}
                                className="flex-1"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handlePayment}
                                disabled={processing}
                                className="flex-1"
                            >
                                {processing
                                    ? 'Processing...'
                                    : `Pay €${Number(pkg.price).toFixed(2)}`}
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
