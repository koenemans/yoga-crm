import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import admin from '@/routes/admin';
import { type BreadcrumbItem, type PaginatedData } from '@/types';
import { Head } from '@inertiajs/react';

interface Transaction {
    id: number;
    user: {
        id: number;
        name: string;
        email: string;
    };
    credits: number;
    type: string;
    description: string;
    transactionable_type: string;
    expires_at: string | null;
    is_expired: boolean;
    created_by: string | null;
    created_at: string;
}

interface Summary {
    total_credits_issued: number;
    total_credits_used: number;
    expired_credits: number;
}

interface Props {
    transactions: PaginatedData<Transaction>;
    filters: Record<string, string>;
    summary: Summary;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Finance',
        href: admin.finance.dashboard().url,
    },
    {
        title: 'Transactions',
        href: '#',
    },
];

export default function TransactionsIndex({ transactions, summary }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Credit Transactions" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                <div>
                    <h1 className="text-3xl font-bold">Credit Transactions</h1>
                    <p className="text-muted-foreground">View all credit transactions</p>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader>
                            <CardTitle>Credits Issued</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{summary.total_credits_issued}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Credits Used</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{summary.total_credits_used}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Expired Credits</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{summary.expired_credits}</div>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Transaction History</CardTitle>
                        <CardDescription>Showing {transactions.data.length} of {transactions.total} transactions</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {transactions.data.map((transaction) => (
                                <div key={transaction.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                                    <div className="flex-1">
                                        <p className="font-medium">{transaction.user.name}</p>
                                        <p className="text-sm text-muted-foreground">{transaction.description}</p>
                                        <p className="text-xs text-muted-foreground">{transaction.created_at}</p>
                                    </div>
                                    <div className="text-right">
                                        <span className={`text-lg font-bold ${
                                            transaction.credits > 0 ? 'text-green-600' : 'text-red-600'
                                        }`}>
                                            {transaction.credits > 0 ? '+' : ''}{transaction.credits}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
