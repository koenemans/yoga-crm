import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import admin from '@/routes/admin';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { CheckCircle, CreditCard } from 'lucide-react';
import { useState } from 'react';

interface Purchase {
    id: number;
    user: {
        id: number;
        name: string;
    };
    package: string | null;
    credits: number;
    price: string | number;
    status: string;
    payment_reference: string;
    payment_method: string | null;
    created_at: string;
    paid_at: string | null;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginationMeta {
    current_page: number;
    from: number;
    last_page: number;
    per_page: number;
    to: number;
    total: number;
}

interface Props {
    purchases: {
        data: Purchase[];
        links: PaginationLink[];
        meta: PaginationMeta;
    };
    filters: {
        status?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin', href: admin.lessons.index().url },
    { title: 'Purchases', href: admin.purchases.index().url },
];

const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100',
    paid: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
    cancelled: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100',
};

export default function PurchasesIndex({ purchases, filters }: Props) {
    const [status, setStatus] = useState(filters.status || 'all');
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<{[key: number]: string}>({});

    const handleFilter = () => {
        const params = new URLSearchParams();
        if (status && status !== 'all') params.set('status', status);
        
        router.get(admin.purchases.index().url + (params.toString() ? `?${params.toString()}` : ''), {}, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleConfirmPayment = (purchaseId: number) => {
        const paymentMethod = selectedPaymentMethod[purchaseId] || 'manual';
        
        if (confirm('Confirm this payment? Credits will be added to the user\'s account.')) {
            router.post(`/admin/purchases/${purchaseId}/confirm`, {
                payment_method: paymentMethod,
            }, {
                preserveScroll: true,
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Credit Purchases" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold">Credit Purchases</h1>
                    <p className="text-muted-foreground">
                        Manage and confirm credit purchases
                    </p>
                </div>

                {/* Filters */}
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex gap-4">
                            <Select value={status} onValueChange={setStatus}>
                                <SelectTrigger className="w-[200px]">
                                    <SelectValue placeholder="All Statuses" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Statuses</SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="paid">Paid</SelectItem>
                                    <SelectItem value="cancelled">Cancelled</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button onClick={handleFilter}>Filter</Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Purchases Table */}
                <Card>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="border-b bg-muted/50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-sm font-medium">User</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium">Package</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium">Credits</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium">Price</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium">Reference</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium">Date</th>
                                        <th className="px-4 py-3 text-right text-sm font-medium">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {purchases.data.map((purchase) => (
                                        <tr key={purchase.id} className="hover:bg-muted/50">
                                            <td className="px-4 py-3">
                                                <Link 
                                                    href={`/admin/users/${purchase.user.id}`}
                                                    className="font-medium hover:underline"
                                                >
                                                    {purchase.user.name}
                                                </Link>
                                            </td>
                                            <td className="px-4 py-3 text-sm">
                                                {purchase.package || '-'}
                                            </td>
                                            <td className="px-4 py-3 text-sm font-medium">
                                                {purchase.credits}
                                            </td>
                                            <td className="px-4 py-3 text-sm font-medium">
                                                €{Number(purchase.price).toFixed(2)}
                                            </td>
                                            <td className="px-4 py-3 text-sm font-mono text-muted-foreground">
                                                {purchase.payment_reference}
                                            </td>
                                            <td className="px-4 py-3">
                                                <Badge className={statusColors[purchase.status as keyof typeof statusColors]}>
                                                    {purchase.status}
                                                </Badge>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-muted-foreground">
                                                {new Date(purchase.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="px-4 py-3">
                                                {purchase.status === 'pending' ? (
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Select
                                                            value={selectedPaymentMethod[purchase.id] || 'manual'}
                                                            onValueChange={(value) => 
                                                                setSelectedPaymentMethod(prev => ({
                                                                    ...prev,
                                                                    [purchase.id]: value
                                                                }))
                                                            }
                                                        >
                                                            <SelectTrigger className="w-[140px] h-8">
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="manual">Manual</SelectItem>
                                                                <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                                                                <SelectItem value="ideal">iDEAL</SelectItem>
                                                                <SelectItem value="other">Other</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                        <Button
                                                            size="sm"
                                                            onClick={() => handleConfirmPayment(purchase.id)}
                                                        >
                                                            <CheckCircle className="mr-1 h-3 w-3" />
                                                            Confirm
                                                        </Button>
                                                    </div>
                                                ) : purchase.status === 'paid' ? (
                                                    <div className="flex justify-end">
                                                        <Badge variant="outline" className="text-xs">
                                                            {purchase.payment_method || 'manual'}
                                                        </Badge>
                                                    </div>
                                                ) : (
                                                    <span className="text-sm text-muted-foreground">-</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>

                {/* Empty State */}
                {purchases.data.length === 0 && (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <CreditCard className="h-12 w-12 text-muted-foreground mb-4" />
                            <h3 className="text-lg font-semibold mb-2">No Purchases Found</h3>
                            <p className="text-muted-foreground text-center">
                                {status === 'pending' 
                                    ? 'No pending purchases to confirm.' 
                                    : 'No purchases match your filters.'}
                            </p>
                        </CardContent>
                    </Card>
                )}

                {/* Pagination */}
                {purchases.links && purchases.links.length > 3 && (
                    <div className="flex justify-center gap-2">
                        {purchases.links.map((link, index) => (
                            <Button
                                key={index}
                                variant={link.active ? 'default' : 'outline'}
                                size="sm"
                                disabled={!link.url}
                                asChild={!!link.url}
                            >
                                {link.url ? (
                                    <Link href={link.url} dangerouslySetInnerHTML={{ __html: link.label }} />
                                ) : (
                                    <span dangerouslySetInnerHTML={{ __html: link.label }} />
                                )}
                            </Button>
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
