import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import credits from '@/routes/credits';
import { Link } from '@inertiajs/react';
import { CreditCard, DollarSign, TrendingUp, Users } from 'lucide-react';

interface AccountantDashboardProps {
    totalRevenue?: number;
    pendingPurchases?: number;
    activeStudents?: number;
    recentTransactions?: any[];
}

export default function AccountantDashboard({ 
    totalRevenue = 0,
    pendingPurchases = 0,
    activeStudents = 0,
    recentTransactions = []
}: AccountantDashboardProps) {
    return (
        <div className="space-y-6">
            {/* Quick Stats */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">€{totalRevenue.toFixed(2)}</div>
                        <p className="text-xs text-muted-foreground">
                            This month
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Purchases</CardTitle>
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{pendingPurchases}</div>
                        <p className="text-xs text-muted-foreground">
                            Awaiting confirmation
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Students</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{activeStudents}</div>
                        <p className="text-xs text-muted-foreground">
                            With active credits
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Growth</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">+12%</div>
                        <p className="text-xs text-muted-foreground">
                            vs last month
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions */}
            <Card>
                <CardHeader>
                    <CardTitle>Financial Overview</CardTitle>
                    <CardDescription>View financial reports and transactions</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-3">
                    <Button asChild className="h-auto flex-col gap-2 py-4">
                        <Link href="/admin/purchases">
                            <CreditCard className="h-6 w-6" />
                            <span>View Purchases</span>
                        </Link>
                    </Button>
                    <Button asChild variant="outline" className="h-auto flex-col gap-2 py-4">
                        <Link href={credits.index().url}>
                            <DollarSign className="h-6 w-6" />
                            <span>Credit Packages</span>
                        </Link>
                    </Button>
                    <Button asChild variant="outline" className="h-auto flex-col gap-2 py-4">
                        <Link href="/admin/users?role=attendee">
                            <Users className="h-6 w-6" />
                            <span>Student List</span>
                        </Link>
                    </Button>
                </CardContent>
            </Card>

            {/* Recent Transactions */}
            {recentTransactions.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Transactions</CardTitle>
                        <CardDescription>Latest credit purchases and transactions</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentTransactions.slice(0, 10).map((transaction: any) => (
                                <div key={transaction.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                                    <div>
                                        <p className="font-medium">{transaction.user?.name}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {transaction.description}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-medium">
                                            {transaction.credits > 0 ? '+' : ''}{transaction.credits} credits
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {transaction.created_at}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Info Card */}
            <Card className="border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950">
                <CardHeader>
                    <CardTitle className="text-blue-900 dark:text-blue-100">Read-Only Access</CardTitle>
                    <CardDescription className="text-blue-700 dark:text-blue-300">
                        As an accountant, you have read-only access to financial data and reports. Contact an administrator to make changes.
                    </CardDescription>
                </CardHeader>
            </Card>
        </div>
    );
}
