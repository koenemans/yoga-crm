import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import admin from '@/routes/admin';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { ArrowLeft, CreditCard, Edit, History, User as UserIcon } from 'lucide-react';
import { useState } from 'react';

interface UserData {
    id: number;
    name: string;
    first_name: string;
    last_name: string;
    email: string;
    role: string;
    phone: string;
    date_of_birth: string;
    address: string;
    emergency_contact: string;
    emergency_contact_phone: string;
    preferred_language: string;
    is_active: boolean;
    internal_notes: string;
    created_at: string;
}

interface ExpiringCredit {
    date: string;
    credits: number;
}

interface Props {
    user: UserData;
    credit_balance: number | null;
    expiring_credits: ExpiringCredit[];
    can_view_notes: boolean;
}

const roleColors = {
    admin: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100',
    teacher: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
    pupil: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
    accountant: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100',
};

export default function UserShow({ user, credit_balance, expiring_credits, can_view_notes }: Props) {
    const [showCreditAdjustment, setShowCreditAdjustment] = useState(false);
    
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Admin', href: admin.dashboard().url },
        { title: 'Users', href: admin.users.index().url },
        { title: user.name, href: `/admin/users/${user.id}` },
    ];

    const { data, setData, post, processing, reset } = useForm({
        credits: '',
        description: '',
    });

    const handleCreditAdjustment = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/admin/users/${user.id}/credits`, {
            onSuccess: () => {
                reset();
                setShowCreditAdjustment(false);
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={user.name} />
            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                        <Button asChild variant="outline" size="icon">
                            <Link href={admin.users.index().url}>
                                <ArrowLeft className="h-4 w-4" />
                            </Link>
                        </Button>
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-3xl font-bold">{user.name}</h1>
                                <Badge className={roleColors[user.role as keyof typeof roleColors]}>
                                    {user.role}
                                </Badge>
                                <Badge variant={user.is_active ? 'default' : 'secondary'}>
                                    {user.is_active ? 'Active' : 'Inactive'}
                                </Badge>
                            </div>
                            <p className="text-muted-foreground mt-1">{user.email}</p>
                        </div>
                    </div>
                    <Button asChild>
                        <Link href={`/admin/users/${user.id}/edit`}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit User
                        </Link>
                    </Button>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Personal Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Personal Information</CardTitle>
                            </CardHeader>
                            <CardContent className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <p className="text-sm text-muted-foreground">First Name</p>
                                    <p className="font-medium">{user.first_name || '-'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Last Name</p>
                                    <p className="font-medium">{user.last_name || '-'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Email</p>
                                    <p className="font-medium">{user.email}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Phone</p>
                                    <p className="font-medium">{user.phone || '-'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Date of Birth</p>
                                    <p className="font-medium">
                                        {user.date_of_birth ? new Date(user.date_of_birth).toLocaleDateString() : '-'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Language</p>
                                    <p className="font-medium">{user.preferred_language === 'nl' ? 'Dutch' : 'English'}</p>
                                </div>
                                <div className="md:col-span-2">
                                    <p className="text-sm text-muted-foreground">Address</p>
                                    <p className="font-medium">{user.address || '-'}</p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Emergency Contact */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Emergency Contact</CardTitle>
                            </CardHeader>
                            <CardContent className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <p className="text-sm text-muted-foreground">Contact Name</p>
                                    <p className="font-medium">{user.emergency_contact || '-'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Contact Phone</p>
                                    <p className="font-medium">{user.emergency_contact_phone || '-'}</p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Internal Notes */}
                        {can_view_notes && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Internal Notes</CardTitle>
                                    <CardDescription>Private notes visible only to admin and teachers</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="whitespace-pre-wrap text-sm">
                                        {user.internal_notes || 'No notes added yet.'}
                                    </p>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Credit Balance (for pupils) */}
                        {user.role === 'pupil' && credit_balance !== null && (
                            <>
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <CreditCard className="h-5 w-5" />
                                            Credit Balance
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-4xl font-bold mb-4">{credit_balance}</div>
                                        <Button 
                                            onClick={() => setShowCreditAdjustment(!showCreditAdjustment)}
                                            variant="outline"
                                            className="w-full"
                                        >
                                            Adjust Credits
                                        </Button>
                                    </CardContent>
                                </Card>

                                {/* Credit Adjustment Form */}
                                {showCreditAdjustment && (
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Adjust Credits</CardTitle>
                                            <CardDescription>Add or remove credits manually</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <form onSubmit={handleCreditAdjustment} className="space-y-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="credits">Credits</Label>
                                                    <Input
                                                        id="credits"
                                                        type="number"
                                                        placeholder="e.g., 5 or -3"
                                                        value={data.credits}
                                                        onChange={(e) => setData('credits', e.target.value)}
                                                        required
                                                    />
                                                    <p className="text-xs text-muted-foreground">
                                                        Use positive numbers to add, negative to remove
                                                    </p>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="description">Reason</Label>
                                                    <Textarea
                                                        id="description"
                                                        placeholder="e.g., Compensation for cancelled class"
                                                        value={data.description}
                                                        onChange={(e) => setData('description', e.target.value)}
                                                        required
                                                        rows={3}
                                                    />
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button type="submit" disabled={processing}>
                                                        {processing ? 'Adjusting...' : 'Adjust'}
                                                    </Button>
                                                    <Button 
                                                        type="button" 
                                                        variant="outline"
                                                        onClick={() => {
                                                            setShowCreditAdjustment(false);
                                                            reset();
                                                        }}
                                                    >
                                                        Cancel
                                                    </Button>
                                                </div>
                                            </form>
                                        </CardContent>
                                    </Card>
                                )}

                                {/* Expiring Credits */}
                                {expiring_credits.length > 0 && (
                                    <Card className="border-orange-200 bg-orange-50 dark:border-orange-900 dark:bg-orange-950">
                                        <CardHeader>
                                            <CardTitle className="text-orange-900 dark:text-orange-100">
                                                Credits Expiring Soon
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-2">
                                                {expiring_credits.map((item, index) => (
                                                    <div key={index} className="flex justify-between text-sm">
                                                        <span>{item.credits} credits</span>
                                                        <span>{new Date(item.date).toLocaleDateString()}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}
                            </>
                        )}

                        {/* Account Info */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Account Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div>
                                    <p className="text-sm text-muted-foreground">User ID</p>
                                    <p className="font-medium">#{user.id}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Member Since</p>
                                    <p className="font-medium">
                                        {new Date(user.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Status</p>
                                    <Badge variant={user.is_active ? 'default' : 'secondary'}>
                                        {user.is_active ? 'Active' : 'Inactive'}
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
