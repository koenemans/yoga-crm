import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import admin from '@/routes/admin';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, CheckCircle, Trash2 } from 'lucide-react';

interface Purchase {
    id: number;
    user: {
        id: number;
        name: string;
        email: string;
    };
    package: {
        id: number;
        name: string;
        description: string;
    } | null;
    credits: number;
    price: number;
    status: string;
    payment_reference: string;
    payment_method: string | null;
    confirmed_by: string | null;
    created_at: string;
    paid_at: string | null;
    transactions: Array<{
        id: number;
        credits: number;
        type: string;
        description: string;
        created_at: string;
    }>;
}

interface Props {
    purchase: Purchase;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Finance',
        href: admin.finance.dashboard().url,
    },
    {
        title: 'Purchases',
        href: admin.finance.purchases.index().url,
    },
    {
        title: 'Purchase Details',
        href: '#',
    },
];

export default function PurchaseShow({ purchase }: Props) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('nl-NL', {
            style: 'currency',
            currency: 'EUR',
        }).format(amount);
    };

    const getStatusBadge = (status: string) => {
        const styles = {
            paid: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
            pending:
                'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100',
            cancelled:
                'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
        };
        return (
            styles[status as keyof typeof styles] ||
            'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100'
        );
    };

    const handleConfirmPayment = () => {
        if (
            confirm(
                "Are you sure you want to confirm this payment? This will credit the user's account.",
            )
        ) {
            router.post(
                admin.finance.purchases.confirm(purchase.id).url,
                {},
                {
                    onSuccess: () => {
                        router.visit(admin.finance.purchases.index().url);
                    },
                },
            );
        }
    };

    const handleDeletePurchase = () => {
        if (
            confirm(
                'Are you sure you want to delete this purchase? This action cannot be undone.',
            )
        ) {
            router.delete(admin.finance.purchases.destroy(purchase.id).url, {
                onSuccess: () => {
                    router.visit(admin.finance.purchases.index().url);
                },
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Purchase #${purchase.id}`} />
            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                {/* Page Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">
                            Purchase #{purchase.id}
                        </h1>
                        <p className="text-muted-foreground">
                            Purchase details and transaction history
                        </p>
                    </div>
                    <div className="flex gap-2">
                        {purchase.status === 'pending' && (
                            <Button
                                onClick={handleConfirmPayment}
                                variant="default"
                            >
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Confirm Payment
                            </Button>
                        )}
                        <Button
                            onClick={handleDeletePurchase}
                            variant="destructive"
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                        </Button>
                        <Button asChild variant="outline">
                            <Link href={admin.finance.purchases.index().url}>
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Purchases
                            </Link>
                        </Button>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    {/* Purchase Details */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Purchase Information</CardTitle>
                            <CardDescription>
                                Details about this credit purchase
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Status
                                </p>
                                <span
                                    className={`mt-1 inline-block rounded-full px-3 py-1 text-sm ${getStatusBadge(purchase.status)}`}
                                >
                                    {purchase.status}
                                </span>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Package
                                </p>
                                <p className="text-lg font-medium">
                                    {purchase.package?.name ||
                                        'Manual Purchase'}
                                </p>
                                {purchase.package?.description && (
                                    <p className="text-sm text-muted-foreground">
                                        {purchase.package.description}
                                    </p>
                                )}
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Credits
                                    </p>
                                    <p className="text-lg font-bold">
                                        {purchase.credits}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Amount
                                    </p>
                                    <p className="text-lg font-bold">
                                        {formatCurrency(purchase.price)}
                                    </p>
                                </div>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Payment Reference
                                </p>
                                <p className="font-mono text-sm">
                                    {purchase.payment_reference}
                                </p>
                            </div>
                            {purchase.payment_method && (
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Payment Method
                                    </p>
                                    <p className="capitalize">
                                        {purchase.payment_method}
                                    </p>
                                </div>
                            )}
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Created At
                                </p>
                                <p>{purchase.created_at}</p>
                            </div>
                            {purchase.paid_at && (
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Paid At
                                    </p>
                                    <p>{purchase.paid_at}</p>
                                </div>
                            )}
                            {purchase.confirmed_by && (
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Confirmed By
                                    </p>
                                    <p>{purchase.confirmed_by}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Customer Details */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Customer Information</CardTitle>
                            <CardDescription>
                                Details about the customer
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Name
                                </p>
                                <p className="text-lg font-medium">
                                    {purchase.user.name}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Email
                                </p>
                                <p>{purchase.user.email}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Related Transactions */}
                {purchase.transactions.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Related Transactions</CardTitle>
                            <CardDescription>
                                Credit transactions associated with this
                                purchase
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {purchase.transactions.map((transaction) => (
                                    <div
                                        key={transaction.id}
                                        className="flex items-center justify-between border-b pb-4 last:border-0"
                                    >
                                        <div className="flex-1">
                                            <p className="font-medium">
                                                {transaction.description}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                Type: {transaction.type}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {transaction.created_at}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <span
                                                className={`text-lg font-bold ${
                                                    transaction.credits > 0
                                                        ? 'text-green-600 dark:text-green-400'
                                                        : 'text-red-600 dark:text-red-400'
                                                }`}
                                            >
                                                {transaction.credits > 0
                                                    ? '+'
                                                    : ''}
                                                {transaction.credits}
                                            </span>
                                            <p className="text-xs text-muted-foreground">
                                                credits
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
