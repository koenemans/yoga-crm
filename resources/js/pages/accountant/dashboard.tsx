import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import accountant from '@/routes/accountant';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { 
    ArrowDownIcon, 
    ArrowUpIcon, 
    CreditCard, 
    DollarSign, 
    FileText, 
    TrendingUp, 
    Users 
} from 'lucide-react';

interface Stats {
    current_month_revenue: number;
    previous_month_revenue: number;
    ytd_revenue: number;
    pending_purchases: number;
    pending_amount: number;
    active_students: number;
    monthly_bookings: number;
}

interface Transaction {
    id: number;
    user: {
        id: number;
        name: string;
    };
    credits: number;
    description: string;
    created_at: string;
}

interface Props {
    stats: Stats;
    revenue_by_method: Record<string, number>;
    revenue_by_package: Record<string, number>;
    recent_transactions: Transaction[];
    monthly_revenue: Record<string, number>;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Accountant Dashboard',
        href: accountant.dashboard().url,
    },
];

export default function AccountantDashboard({ 
    stats, 
    revenue_by_method, 
    revenue_by_package, 
    recent_transactions,
    monthly_revenue 
}: Props) {
    const revenueChange = stats.previous_month_revenue > 0
        ? ((stats.current_month_revenue - stats.previous_month_revenue) / stats.previous_month_revenue) * 100
        : 0;

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('nl-NL', {
            style: 'currency',
            currency: 'EUR',
        }).format(amount);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Accountant Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                {/* Page Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Financial Dashboard</h1>
                        <p className="text-muted-foreground">Revenue and transaction overview</p>
                    </div>
                    <div className="flex gap-2">
                        <Button asChild variant="outline">
                            <Link href={accountant.reports.index().url}>
                                <FileText className="mr-2 h-4 w-4" />
                                Reports
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Revenue Stats */}
                <div className="grid gap-4 md:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">This Month</CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatCurrency(stats.current_month_revenue)}</div>
                            <div className="flex items-center text-xs text-muted-foreground">
                                {revenueChange >= 0 ? (
                                    <ArrowUpIcon className="mr-1 h-3 w-3 text-green-500" />
                                ) : (
                                    <ArrowDownIcon className="mr-1 h-3 w-3 text-red-500" />
                                )}
                                <span className={revenueChange >= 0 ? 'text-green-500' : 'text-red-500'}>
                                    {Math.abs(revenueChange).toFixed(1)}%
                                </span>
                                <span className="ml-1">from last month</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Year to Date</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatCurrency(stats.ytd_revenue)}</div>
                            <p className="text-xs text-muted-foreground">Total revenue this year</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
                            <CreditCard className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.pending_purchases}</div>
                            <p className="text-xs text-muted-foreground">
                                {formatCurrency(stats.pending_amount)} awaiting
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Students</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.active_students}</div>
                            <p className="text-xs text-muted-foreground">
                                {stats.monthly_bookings} bookings this month
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Actions */}
                <Card>
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                        <CardDescription>Financial management tools</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4 md:grid-cols-3">
                        <Button asChild className="h-auto flex-col gap-2 py-4">
                            <Link href={accountant.purchases.index().url}>
                                <CreditCard className="h-6 w-6" />
                                <span>View Purchases</span>
                            </Link>
                        </Button>
                        <Button asChild variant="outline" className="h-auto flex-col gap-2 py-4">
                            <Link href={accountant.transactions.index().url}>
                                <FileText className="h-6 w-6" />
                                <span>View Transactions</span>
                            </Link>
                        </Button>
                        <Button asChild variant="outline" className="h-auto flex-col gap-2 py-4">
                            <Link href={accountant.reports.index().url}>
                                <TrendingUp className="h-6 w-6" />
                                <span>Generate Reports</span>
                            </Link>
                        </Button>
                    </CardContent>
                </Card>

                <div className="grid gap-6 md:grid-cols-2">
                    {/* Revenue by Payment Method */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Revenue by Payment Method</CardTitle>
                            <CardDescription>Current month breakdown</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {Object.entries(revenue_by_method).length > 0 ? (
                                    Object.entries(revenue_by_method).map(([method, amount]) => (
                                        <div key={method} className="flex items-center justify-between border-b pb-3 last:border-0">
                                            <div className="flex-1">
                                                <p className="font-medium capitalize">{method || 'Unknown'}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold">{formatCurrency(amount)}</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-muted-foreground">No revenue data for this month</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Revenue by Package */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Revenue by Package</CardTitle>
                            <CardDescription>Current month breakdown</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {Object.entries(revenue_by_package).length > 0 ? (
                                    Object.entries(revenue_by_package).map(([packageName, amount]) => (
                                        <div key={packageName} className="flex items-center justify-between border-b pb-3 last:border-0">
                                            <div className="flex-1">
                                                <p className="font-medium">{packageName}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold">{formatCurrency(amount)}</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-muted-foreground">No revenue data for this month</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Transactions */}
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Transactions</CardTitle>
                        <CardDescription>Latest credit transactions</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recent_transactions.map((transaction) => (
                                <div key={transaction.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                                    <div className="flex-1">
                                        <p className="font-medium">{transaction.user.name}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {transaction.description}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {transaction.created_at}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <span className={`text-lg font-bold ${
                                            transaction.credits > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                                        }`}>
                                            {transaction.credits > 0 ? '+' : ''}{transaction.credits}
                                        </span>
                                        <p className="text-xs text-muted-foreground">credits</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <Button asChild variant="link" className="mt-4 w-full">
                            <Link href={accountant.transactions.index().url}>View All Transactions</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
