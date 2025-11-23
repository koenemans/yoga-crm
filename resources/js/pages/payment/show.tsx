import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { AlertCircle, CheckCircle2, Clock, XCircle } from 'lucide-react';

interface CreditPackage {
    id: number;
    name: string;
    description: string;
    credits: number;
    price: string | number;
}

interface Purchase {
    id: number;
    credits: number;
    price: string | number;
    status: string;
    payment_reference: string;
    payment_method: string | null;
    mollie_payment_status: string | null;
    paid_at: string | null;
    created_at: string;
    credit_package: CreditPackage;
}

interface Props {
    purchase: Purchase;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Credits',
        href: '/credits',
    },
    {
        title: 'Payment Status',
        href: '#',
    },
];

const statusConfig = {
    paid: {
        icon: CheckCircle2,
        color: 'text-green-600 dark:text-green-400',
        bgColor: 'bg-green-50 dark:bg-green-950',
        borderColor: 'border-green-200 dark:border-green-900',
        label: 'Paid',
        badgeVariant: 'default' as const,
    },
    pending: {
        icon: Clock,
        color: 'text-yellow-600 dark:text-yellow-400',
        bgColor: 'bg-yellow-50 dark:bg-yellow-950',
        borderColor: 'border-yellow-200 dark:border-yellow-900',
        label: 'Pending',
        badgeVariant: 'secondary' as const,
    },
    failed: {
        icon: XCircle,
        color: 'text-red-600 dark:text-red-400',
        bgColor: 'bg-red-50 dark:bg-red-950',
        borderColor: 'border-red-200 dark:border-red-900',
        label: 'Failed',
        badgeVariant: 'destructive' as const,
    },
};

export default function PaymentShow({ purchase }: Props) {
    const status = purchase.status as keyof typeof statusConfig;
    const config = statusConfig[status] || statusConfig.pending;
    const StatusIcon = config.icon;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Payment Status" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                <div>
                    <h1 className="text-3xl font-bold">Payment Status</h1>
                    <p className="text-muted-foreground">
                        View your payment details
                    </p>
                </div>

                <div className="mx-auto w-full max-w-2xl">
                    <Card className={`${config.bgColor} ${config.borderColor}`}>
                        <CardHeader className="text-center">
                            <div className="mx-auto mb-4">
                                <StatusIcon
                                    className={`h-16 w-16 ${config.color}`}
                                />
                            </div>
                            <CardTitle className="text-2xl">
                                {status === 'paid' && 'Payment Successful!'}
                                {status === 'pending' && 'Payment Pending'}
                                {status === 'failed' && 'Payment Failed'}
                            </CardTitle>
                            <CardDescription>
                                {status === 'paid' &&
                                    'Your credits have been added to your account'}
                                {status === 'pending' &&
                                    'Your payment is being processed'}
                                {status === 'failed' &&
                                    'There was an issue processing your payment'}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-3">
                                <div className="flex items-center justify-between border-b py-2">
                                    <span className="text-muted-foreground">
                                        Package
                                    </span>
                                    <span className="font-medium">
                                        {purchase.credit_package.name}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between border-b py-2">
                                    <span className="text-muted-foreground">
                                        Credits
                                    </span>
                                    <span className="font-medium">
                                        {purchase.credits}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between border-b py-2">
                                    <span className="text-muted-foreground">
                                        Amount
                                    </span>
                                    <span className="font-medium">
                                        €{Number(purchase.price).toFixed(2)}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between border-b py-2">
                                    <span className="text-muted-foreground">
                                        Status
                                    </span>
                                    <Badge variant={config.badgeVariant}>
                                        {config.label}
                                    </Badge>
                                </div>
                                <div className="flex items-center justify-between border-b py-2">
                                    <span className="text-muted-foreground">
                                        Reference
                                    </span>
                                    <span className="font-mono text-sm">
                                        {purchase.payment_reference}
                                    </span>
                                </div>
                                {purchase.payment_method && (
                                    <div className="flex items-center justify-between border-b py-2">
                                        <span className="text-muted-foreground">
                                            Payment Method
                                        </span>
                                        <span className="font-medium capitalize">
                                            {purchase.payment_method}
                                        </span>
                                    </div>
                                )}
                                <div className="flex items-center justify-between py-2">
                                    <span className="text-muted-foreground">
                                        Date
                                    </span>
                                    <span className="font-medium">
                                        {new Date(
                                            purchase.created_at,
                                        ).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                        })}
                                    </span>
                                </div>
                            </div>

                            {status === 'pending' && (
                                <div className="flex items-start gap-3 rounded-lg bg-muted p-4">
                                    <AlertCircle className="mt-0.5 h-5 w-5 text-primary" />
                                    <div className="text-sm">
                                        <p className="font-medium">
                                            Payment Processing
                                        </p>
                                        <p className="text-muted-foreground">
                                            Your payment is being verified. This
                                            usually takes a few moments. You'll
                                            receive your credits once the
                                            payment is confirmed.
                                        </p>
                                    </div>
                                </div>
                            )}

                            {status === 'failed' && (
                                <div className="flex items-start gap-3 rounded-lg bg-muted p-4">
                                    <AlertCircle className="mt-0.5 h-5 w-5 text-destructive" />
                                    <div className="text-sm">
                                        <p className="font-medium">
                                            What happened?
                                        </p>
                                        <p className="text-muted-foreground">
                                            Your payment could not be completed.
                                            This might be due to insufficient
                                            funds, a cancelled payment, or a
                                            technical issue. Please try again or
                                            contact support.
                                        </p>
                                    </div>
                                </div>
                            )}

                            <div className="flex gap-3">
                                <Button
                                    onClick={() => router.visit('/credits')}
                                    className="flex-1"
                                >
                                    Back to Credits
                                </Button>
                                {status === 'failed' && (
                                    <Button
                                        variant="outline"
                                        onClick={() =>
                                            router.visit(
                                                `/payment/${purchase.credit_package.id}`,
                                            )
                                        }
                                        className="flex-1"
                                    >
                                        Try Again
                                    </Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
