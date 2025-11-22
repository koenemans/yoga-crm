import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import admin from '@/routes/admin';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { CreditCard, PlusCircle } from 'lucide-react';

interface CreditPackage {
    id: number;
    name: string;
    description: string;
    credits: number;
    price: string | number;
    expiry_days: number | null;
    sort_order: number;
    is_active: boolean;
}

interface Props {
    packages: CreditPackage[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin', href: admin.lessons.index().url },
    { title: 'Credits', href: admin.credits.index().url },
];

export default function CreditPackagesIndex({ packages }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Credits" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Credits</h1>
                        <p className="text-muted-foreground">
                            Manage credit packages available for purchase
                        </p>
                    </div>
                    <Button asChild>
                        <Link href={admin.credits.create().url}>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Add Package
                        </Link>
                    </Button>
                </div>

                {/* Packages Table */}
                <Card>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="border-b bg-muted/50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-sm font-medium">
                                            Name
                                        </th>
                                        <th className="px-4 py-3 text-left text-sm font-medium">
                                            Description
                                        </th>
                                        <th className="px-4 py-3 text-left text-sm font-medium">
                                            Credits
                                        </th>
                                        <th className="px-4 py-3 text-left text-sm font-medium">
                                            Price
                                        </th>
                                        <th className="px-4 py-3 text-left text-sm font-medium">
                                            Expiry
                                        </th>
                                        <th className="px-4 py-3 text-left text-sm font-medium">
                                            Status
                                        </th>
                                        <th className="px-4 py-3 text-right text-sm font-medium">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {packages.map((pkg) => (
                                        <tr
                                            key={pkg.id}
                                            className="hover:bg-muted/50"
                                        >
                                            <td className="px-4 py-3">
                                                <p className="font-medium">
                                                    {pkg.name}
                                                </p>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-muted-foreground">
                                                {pkg.description}
                                            </td>
                                            <td className="px-4 py-3 text-sm font-medium">
                                                {pkg.credits}
                                            </td>
                                            <td className="px-4 py-3 text-sm font-medium">
                                                €{Number(pkg.price).toFixed(2)}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-muted-foreground">
                                                {pkg.expiry_days
                                                    ? `${pkg.expiry_days} days`
                                                    : 'No expiry'}
                                            </td>
                                            <td className="px-4 py-3">
                                                <Badge
                                                    variant={
                                                        pkg.is_active
                                                            ? 'default'
                                                            : 'secondary'
                                                    }
                                                >
                                                    {pkg.is_active
                                                        ? 'Active'
                                                        : 'Inactive'}
                                                </Badge>
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        asChild
                                                        variant="ghost"
                                                        size="sm"
                                                    >
                                                        <Link
                                                            href={`/admin/credit-packages/${pkg.id}/edit`}
                                                        >
                                                            Edit
                                                        </Link>
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>

                {/* Empty State */}
                {packages.length === 0 && (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <CreditCard className="mb-4 h-12 w-12 text-muted-foreground" />
                            <h3 className="mb-2 text-lg font-semibold">
                                No Credits
                            </h3>
                            <p className="mb-4 text-center text-muted-foreground">
                                Create your first credit package to get started.
                            </p>
                            <Button asChild>
                                <Link href={admin.credits.create().url}>
                                    <PlusCircle className="mr-2 h-4 w-4" />
                                    Create Package
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
