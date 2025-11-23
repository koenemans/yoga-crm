import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import credits from '@/routes/credits';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { CreditCard, TrendingUp } from 'lucide-react';

interface CreditPackage {
    id: number;
    name: string;
    description: string;
    credits: number;
    price: string | number;
    expiry_days: number | null;
    is_active: boolean;
}

interface Transaction {
    id: number;
    credits: number;
    type: string;
    description: string;
    created_at: string;
}

interface ExpiringCredit {
    date: string;
    credits: number;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface Props {
    packages: CreditPackage[];
    balance: number;
    transactions: {
        data: Transaction[];
        links: PaginationLink[];
    };
    expiring_credits: ExpiringCredit[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Credits',
        href: credits.index().url,
    },
];

export default function CreditsIndex({
    packages,
    balance,
    transactions,
    expiring_credits,
}: Props) {
    const handlePurchase = (packageId: number) => {
        router.visit(`/payment/${packageId}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Credits" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold">Credits</h1>
                    <p className="text-muted-foreground">
                        Purchase credits to book yoga classes
                    </p>
                </div>

                {/* Current Balance */}
                <Card className="border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950">
                    <CardHeader>
                        <CardTitle className="text-3xl text-blue-900 dark:text-blue-100">
                            {balance} Credits
                        </CardTitle>
                        <CardDescription className="text-blue-700 dark:text-blue-300">
                            Your current credit balance
                        </CardDescription>
                    </CardHeader>
                </Card>

                {/* Expiring Credits Warning */}
                {expiring_credits.length > 0 && (
                    <Card className="border-orange-200 bg-orange-50 dark:border-orange-900 dark:bg-orange-950">
                        <CardHeader>
                            <CardTitle className="text-orange-900 dark:text-orange-100">
                                Credits Expiring Soon
                            </CardTitle>
                            <CardDescription className="text-orange-700 dark:text-orange-300">
                                Use these credits before they expire
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {expiring_credits.map((item, index) => (
                                    <div
                                        key={index}
                                        className="flex justify-between text-sm"
                                    >
                                        <span>{item.credits} credits</span>
                                        <span>
                                            Expires:{' '}
                                            {new Date(
                                                item.date,
                                            ).toLocaleDateString()}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Credit Packages */}
                <div>
                    <h2 className="mb-4 text-2xl font-bold">
                        Purchase Credits
                    </h2>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        {packages.map((pkg) => (
                            <Card key={pkg.id} className="flex flex-col">
                                <CardHeader>
                                    <CardTitle className="text-2xl">
                                        {pkg.name}
                                    </CardTitle>
                                    <CardDescription>
                                        {pkg.description}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="flex flex-1 flex-col gap-4">
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-4xl font-bold">
                                            €{Number(pkg.price).toFixed(2)}
                                        </span>
                                    </div>
                                    <div className="space-y-2 text-sm text-muted-foreground">
                                        <div className="flex items-center gap-2">
                                            <CreditCard className="h-4 w-4" />
                                            <span>{pkg.credits} credits</span>
                                        </div>
                                        {pkg.expiry_days && (
                                            <div className="flex items-center gap-2">
                                                <TrendingUp className="h-4 w-4" />
                                                <span>
                                                    Valid for {pkg.expiry_days}{' '}
                                                    days
                                                </span>
                                            </div>
                                        )}
                                        <div className="text-xs">
                                            €
                                            {(
                                                Number(pkg.price) / pkg.credits
                                            ).toFixed(2)}{' '}
                                            per credit
                                        </div>
                                    </div>
                                    <Button
                                        onClick={() => handlePurchase(pkg.id)}
                                        className="mt-auto"
                                    >
                                        Buy Now
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Transaction History */}
                <div>
                    <h2 className="mb-4 text-2xl font-bold">
                        Transaction History
                    </h2>
                    <Card>
                        <CardContent className="p-0">
                            <div className="divide-y">
                                {transactions.data.map((transaction) => (
                                    <div
                                        key={transaction.id}
                                        className="flex items-center justify-between p-4"
                                    >
                                        <div className="flex-1">
                                            <p className="font-medium">
                                                {transaction.description}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {new Date(
                                                    transaction.created_at,
                                                ).toLocaleString()}
                                            </p>
                                        </div>
                                        <div
                                            className={`text-lg font-bold ${
                                                transaction.credits > 0
                                                    ? 'text-green-600'
                                                    : 'text-red-600'
                                            }`}
                                        >
                                            {transaction.credits > 0 ? '+' : ''}
                                            {transaction.credits}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
