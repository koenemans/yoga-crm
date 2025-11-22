import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import admin from '@/routes/admin';
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

interface Props {
    stats: Stats;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Finance Dashboard',
        href: admin.finance.dashboard().url,
    },
];

export default function FinanceDashboard({ stats }: Props) {
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
            <Head title="Finance Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                {/* Page Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Financial Dashboard</h1>
                        <p className="text-muted-foreground">Revenue and transaction overview</p>
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
                            <Link href={admin.finance.purchases.index().url}>
                                <CreditCard className="h-6 w-6" />
                                <span>View Purchases</span>
                            </Link>
                        </Button>
                        <Button asChild variant="outline" className="h-auto flex-col gap-2 py-4">
                            <Link href={admin.finance.transactions.index().url}>
                                <FileText className="h-6 w-6" />
                                <span>View Transactions</span>
                            </Link>
                        </Button>
                        <Button asChild variant="outline" className="h-auto flex-col gap-2 py-4">
                            <Link href={admin.finance.reports.index().url}>
                                <TrendingUp className="h-6 w-6" />
                                <span>Generate Reports</span>
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
