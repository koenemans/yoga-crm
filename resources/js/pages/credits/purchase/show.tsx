import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';
import credits from '@/routes/credits';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, CheckCircle, Clock, CreditCard } from 'lucide-react';

interface Purchase {
    id: number;
    credits: number;
    price: string | number;
    status: string;
    payment_reference: string;
    payment_method: string | null;
    created_at: string;
    paid_at: string | null;
    package: {
        name: string;
        description: string;
    } | null;
}

interface Props {
    purchase: Purchase;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Credits',
        href: credits.index().url,
    },
    {
        title: 'Purchase Confirmation',
        href: `/credits/purchase/${0}`,
    },
];

const statusConfig = {
    pending: {
        color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100',
        icon: Clock,
        title: 'Payment Pending',
        description: 'Waiting for payment confirmation',
    },
    paid: {
        color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
        icon: CheckCircle,
        title: 'Payment Confirmed',
        description: 'Credits have been added to your account',
    },
    cancelled: {
        color: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100',
        icon: CreditCard,
        title: 'Payment Cancelled',
        description: 'This purchase was cancelled',
    },
};

export default function PurchaseShow({ purchase }: Props) {
    const config = statusConfig[purchase.status as keyof typeof statusConfig];
    const StatusIcon = config.icon;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Purchase Confirmation" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Button asChild variant="outline" size="icon">
                        <Link href={credits.index().url}>
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold">Purchase Confirmation</h1>
                        <p className="text-muted-foreground">
                            Order #{purchase.payment_reference}
                        </p>
                    </div>
                </div>

                <div className="max-w-2xl mx-auto w-full space-y-6">
                    {/* Status Card */}
                    <Card className={`border-2 ${
                        purchase.status === 'paid' ? 'border-green-200 dark:border-green-900' :
                        purchase.status === 'pending' ? 'border-yellow-200 dark:border-yellow-900' :
                        'border-gray-200 dark:border-gray-900'
                    }`}>
                        <CardContent className="pt-6">
                            <div className="flex flex-col items-center text-center space-y-4">
                                <div className={`rounded-full p-4 ${
                                    purchase.status === 'paid' ? 'bg-green-100 dark:bg-green-900' :
                                    purchase.status === 'pending' ? 'bg-yellow-100 dark:bg-yellow-900' :
                                    'bg-gray-100 dark:bg-gray-900'
                                }`}>
                                    <StatusIcon className="h-12 w-12" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold mb-2">{config.title}</h2>
                                    <p className="text-muted-foreground">{config.description}</p>
                                </div>
                                <Badge className={config.color}>
                                    {purchase.status.toUpperCase()}
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Purchase Details */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Purchase Details</CardTitle>
                            <CardDescription>Summary of your credit purchase</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {purchase.package && (
                                <div className="pb-4 border-b">
                                    <p className="text-sm text-muted-foreground mb-1">Package</p>
                                    <p className="font-semibold text-lg">{purchase.package.name}</p>
                                    {purchase.package.description && (
                                        <p className="text-sm text-muted-foreground">{purchase.package.description}</p>
                                    )}
                                </div>
                            )}

                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <p className="text-sm text-muted-foreground">Credits</p>
                                    <p className="text-2xl font-bold">{purchase.credits}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Amount</p>
                                    <p className="text-2xl font-bold">€{Number(purchase.price).toFixed(2)}</p>
                                </div>
                            </div>

                            <div className="pt-4 border-t space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">Payment Reference</span>
                                    <span className="font-mono text-sm">{purchase.payment_reference}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">Order Date</span>
                                    <span className="text-sm">{new Date(purchase.created_at).toLocaleString()}</span>
                                </div>
                                {purchase.paid_at && (
                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">Paid Date</span>
                                        <span className="text-sm">{new Date(purchase.paid_at).toLocaleString()}</span>
                                    </div>
                                )}
                                {purchase.payment_method && (
                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">Payment Method</span>
                                        <span className="text-sm capitalize">{purchase.payment_method.replace('_', ' ')}</span>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Payment Instructions (for pending) */}
                    {purchase.status === 'pending' && (
                        <Card className="border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950">
                            <CardHeader>
                                <CardTitle className="text-blue-900 dark:text-blue-100">
                                    Payment Instructions
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="text-blue-900 dark:text-blue-100 space-y-3">
                                <p className="font-medium">Please complete your payment using one of these methods:</p>
                                <div className="space-y-2 text-sm">
                                    <p><strong>Bank Transfer:</strong></p>
                                    <p>Account: NL00 BANK 0123 4567 89</p>
                                    <p>Reference: <span className="font-mono">{purchase.payment_reference}</span></p>
                                    <p className="text-xs text-blue-700 dark:text-blue-300 mt-2">
                                        ⚠️ Please include the payment reference in your transfer
                                    </p>
                                </div>
                                <p className="text-sm">
                                    Once we receive your payment, your credits will be added automatically.
                                </p>
                            </CardContent>
                        </Card>
                    )}

                    {/* Actions */}
                    <div className="flex gap-4">
                        <Button asChild className="flex-1">
                            <Link href={credits.index().url}>
                                View Credits
                            </Link>
                        </Button>
                        {purchase.status === 'paid' && (
                            <Button asChild variant="outline" className="flex-1">
                                <Link href="/lessons">
                                    Browse Lessons
                                </Link>
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
