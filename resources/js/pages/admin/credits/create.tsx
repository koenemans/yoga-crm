import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import admin from '@/routes/admin';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin', href: admin.lessons.index().url },
    { title: 'Credits', href: admin.credits.index().url },
    { title: 'Create', href: admin.credits.create().url },
];

export default function CreateCreditPackage() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        description: '',
        credits: '',
        price: '',
        expiry_days: '',
        sort_order: '0',
        is_active: true,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(admin.credits.store().url);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Credit" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                <div className="flex items-center gap-4">
                    <Button asChild variant="outline" size="icon">
                        <Link href={admin.credits.index().url}>
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold">Create Credit</h1>
                        <p className="text-muted-foreground">Add a new credit package for purchase</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <Card className="max-w-2xl">
                        <CardHeader>
                            <CardTitle>Package Details</CardTitle>
                            <CardDescription>Configure the credit package information</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="name">Package Name *</Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="e.g., 5 Class Package"
                                    required
                                />
                                {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="Describe the package..."
                                    rows={3}
                                />
                                {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="credits">Number of Credits *</Label>
                                    <Input
                                        id="credits"
                                        type="number"
                                        min="1"
                                        value={data.credits}
                                        onChange={(e) => setData('credits', e.target.value)}
                                        required
                                    />
                                    {errors.credits && <p className="text-sm text-destructive">{errors.credits}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="price">Price (€) *</Label>
                                    <Input
                                        id="price"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={data.price}
                                        onChange={(e) => setData('price', e.target.value)}
                                        required
                                    />
                                    {errors.price && <p className="text-sm text-destructive">{errors.price}</p>}
                                </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="expiry_days">Expiry (days)</Label>
                                    <Input
                                        id="expiry_days"
                                        type="number"
                                        min="1"
                                        value={data.expiry_days}
                                        onChange={(e) => setData('expiry_days', e.target.value)}
                                        placeholder="Leave empty for no expiry"
                                    />
                                    {errors.expiry_days && <p className="text-sm text-destructive">{errors.expiry_days}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="sort_order">Sort Order</Label>
                                    <Input
                                        id="sort_order"
                                        type="number"
                                        value={data.sort_order}
                                        onChange={(e) => setData('sort_order', e.target.value)}
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Lower numbers appear first
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="is_active"
                                    checked={data.is_active}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('is_active', e.target.checked)}
                                    className="h-4 w-4 rounded border-gray-300"
                                />
                                <Label htmlFor="is_active" className="cursor-pointer">
                                    Package is active and available for purchase
                                </Label>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Creating...' : 'Create Package'}
                                </Button>
                                <Button asChild variant="outline" type="button">
                                    <Link href={admin.credits.index().url}>Cancel</Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </form>
            </div>
        </AppLayout>
    );
}
