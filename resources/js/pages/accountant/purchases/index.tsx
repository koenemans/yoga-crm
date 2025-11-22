import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import accountant from '@/routes/accountant';
import purchases from '@/routes/accountant/purchases';
import reportsExport from '@/routes/accountant/reports/export';
import { type BreadcrumbItem, type PaginatedData } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Download, Eye, Search } from 'lucide-react';
import { type FormEvent, useState } from 'react';

interface Purchase {
    id: number;
    user: {
        id: number;
        name: string;
        email: string;
    };
    package: string | null;
    credits: number;
    price: number;
    status: string;
    payment_reference: string;
    payment_method: string | null;
    confirmed_by: string | null;
    created_at: string;
    paid_at: string | null;
}

interface Filters {
    status?: string;
    payment_method?: string;
    date_from?: string;
    date_to?: string;
    search?: string;
}

interface Summary {
    total_revenue: number;
    total_pending: number;
}

interface Props {
    purchases: PaginatedData<Purchase>;
    filters: Filters;
    summary: Summary;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Accountant',
        href: accountant.dashboard().url,
    },
    {
        title: 'Purchases',
        href: purchases.index().url,
    },
];

export default function PurchasesIndex({ purchases: purchasesData, filters, summary }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '');
    const [paymentMethod, setPaymentMethod] = useState(filters.payment_method || '');
    const [dateFrom, setDateFrom] = useState(filters.date_from || '');
    const [dateTo, setDateTo] = useState(filters.date_to || '');

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('nl-NL', {
            style: 'currency',
            currency: 'EUR',
        }).format(amount);
    };

    const handleFilter = (e: FormEvent) => {
        e.preventDefault();
        router.get(
            purchases.index().url,
            {
                search,
                status,
                payment_method: paymentMethod,
                date_from: dateFrom,
                date_to: dateTo,
            },
            { preserveState: true }
        );
    };

    const handleExport = () => {
        const params = new URLSearchParams({
            date_from: dateFrom || new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0],
            date_to: dateTo || new Date().toISOString().split('T')[0],
            ...(status && { status }),
        });
        window.location.href = `${reportsExport.purchases().url}?${params}`;
    };

    const getStatusBadge = (status: string) => {
        const styles = {
            paid: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
            pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100',
            cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
        };
        return styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100';
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Purchases" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                {/* Page Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Credit Purchases</h1>
                        <p className="text-muted-foreground">View and export purchase history</p>
                    </div>
                    <Button onClick={handleExport} variant="outline">
                        <Download className="mr-2 h-4 w-4" />
                        Export CSV
                    </Button>
                </div>

                {/* Summary Stats */}
                <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatCurrency(summary.total_revenue)}</div>
                            <p className="text-xs text-muted-foreground">Filtered period</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatCurrency(summary.total_pending)}</div>
                            <p className="text-xs text-muted-foreground">Awaiting confirmation</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters */}
                <Card>
                    <CardHeader>
                        <CardTitle>Filters</CardTitle>
                        <CardDescription>Filter purchases by various criteria</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleFilter} className="grid gap-4 md:grid-cols-5">
                            <div className="space-y-2">
                                <Label htmlFor="search">Search</Label>
                                <div className="relative">
                                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="search"
                                        placeholder="Name or email..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="pl-8"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="status">Status</Label>
                                <Select value={status} onValueChange={setStatus}>
                                    <SelectTrigger id="status">
                                        <SelectValue placeholder="All statuses" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="">All statuses</SelectItem>
                                        <SelectItem value="pending">Pending</SelectItem>
                                        <SelectItem value="paid">Paid</SelectItem>
                                        <SelectItem value="cancelled">Cancelled</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="payment_method">Payment Method</Label>
                                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                                    <SelectTrigger id="payment_method">
                                        <SelectValue placeholder="All methods" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="">All methods</SelectItem>
                                        <SelectItem value="ideal">iDEAL</SelectItem>
                                        <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                                        <SelectItem value="manual">Manual</SelectItem>
                                        <SelectItem value="other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="date_from">From Date</Label>
                                <Input
                                    id="date_from"
                                    type="date"
                                    value={dateFrom}
                                    onChange={(e) => setDateFrom(e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="date_to">To Date</Label>
                                <Input
                                    id="date_to"
                                    type="date"
                                    value={dateTo}
                                    onChange={(e) => setDateTo(e.target.value)}
                                />
                            </div>

                            <div className="flex items-end md:col-span-5">
                                <Button type="submit" className="w-full md:w-auto">
                                    Apply Filters
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* Purchases Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Purchase History</CardTitle>
                        <CardDescription>
                            Showing {purchasesData.data.length} of {purchasesData.total} purchases
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b">
                                        <th className="pb-3 text-left text-sm font-medium">Date</th>
                                        <th className="pb-3 text-left text-sm font-medium">User</th>
                                        <th className="pb-3 text-left text-sm font-medium">Package</th>
                                        <th className="pb-3 text-right text-sm font-medium">Credits</th>
                                        <th className="pb-3 text-right text-sm font-medium">Amount</th>
                                        <th className="pb-3 text-left text-sm font-medium">Status</th>
                                        <th className="pb-3 text-left text-sm font-medium">Method</th>
                                        <th className="pb-3 text-right text-sm font-medium">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {purchasesData.data.map((purchase: Purchase) => (
                                        <tr key={purchase.id} className="border-b last:border-0">
                                            <td className="py-3 text-sm">{purchase.created_at}</td>
                                            <td className="py-3">
                                                <div>
                                                    <p className="text-sm font-medium">{purchase.user.name}</p>
                                                    <p className="text-xs text-muted-foreground">{purchase.user.email}</p>
                                                </div>
                                            </td>
                                            <td className="py-3 text-sm">{purchase.package || 'Manual'}</td>
                                            <td className="py-3 text-right text-sm">{purchase.credits}</td>
                                            <td className="py-3 text-right text-sm font-medium">
                                                {formatCurrency(purchase.price)}
                                            </td>
                                            <td className="py-3">
                                                <span className={`rounded-full px-2 py-1 text-xs ${getStatusBadge(purchase.status)}`}>
                                                    {purchase.status}
                                                </span>
                                            </td>
                                            <td className="py-3 text-sm capitalize">{purchase.payment_method || '-'}</td>
                                            <td className="py-3 text-right">
                                                <Button asChild variant="ghost" size="sm">
                                                    <Link href={purchases.show(purchase.id).url}>
                                                        <Eye className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {purchasesData.last_page > 1 && (
                            <div className="mt-4 flex items-center justify-between">
                                <div className="text-sm text-muted-foreground">
                                    Page {purchasesData.current_page} of {purchasesData.last_page}
                                </div>
                                <div className="flex gap-2">
                                    {purchasesData.links.map((link: { url: string | null; label: string; active: boolean }, index: number) => (
                                        <Button
                                            key={index}
                                            variant={link.active ? 'default' : 'outline'}
                                            size="sm"
                                            disabled={!link.url}
                                            onClick={() => link.url && router.get(link.url)}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
