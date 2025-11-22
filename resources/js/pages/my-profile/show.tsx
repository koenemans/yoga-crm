import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type User } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { CreditCard, Edit, History } from 'lucide-react';

interface Props {
    credit_balance: number;
    total_bookings: number;
    upcoming_bookings: number;
    recent_transactions: Array<{
        id: number;
        credits: number;
        description: string;
        created_at: string;
    }>;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'My Profile',
        href: '/my-profile',
    },
];

export default function MyProfileShow({ credit_balance, total_bookings, upcoming_bookings, recent_transactions }: Props) {
    const { auth } = usePage<{ auth: { user: User } }>().props;
    const user = auth.user;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="My Profile" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">My Profile</h1>
                        <p className="text-muted-foreground mt-1">
                            Manage your personal information
                        </p>
                    </div>
                    <Button asChild>
                        <Link href="/my-profile/edit">
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Profile
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
                                    <p className="text-sm text-muted-foreground">Language</p>
                                    <p className="font-medium">
                                        {user.preferred_language === 'nl' ? 'Dutch' : 'English'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Status</p>
                                    <Badge variant={user.is_active ? 'default' : 'secondary'}>
                                        {user.is_active ? 'Active' : 'Inactive'}
                                    </Badge>
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
                                <CardDescription>
                                    Contact person in case of emergency
                                </CardDescription>
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

                        {/* Recent Transactions */}
                        {recent_transactions.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <CardTitle>Recent Transactions</CardTitle>
                                            <CardDescription>Your latest credit activity</CardDescription>
                                        </div>
                                        <Button asChild variant="outline" size="sm">
                                            <Link href="/credits">View All</Link>
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {recent_transactions.map((transaction) => (
                                            <div key={transaction.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium">{transaction.description}</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {new Date(transaction.created_at).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                <div className={`text-sm font-bold ${
                                                    transaction.credits > 0 ? 'text-green-600' : 'text-red-600'
                                                }`}>
                                                    {transaction.credits > 0 ? '+' : ''}{transaction.credits}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Credit Balance */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <CreditCard className="h-5 w-5" />
                                    Credit Balance
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-4xl font-bold mb-4">{credit_balance}</div>
                                <Button asChild className="w-full">
                                    <Link href="/credits">Purchase Credits</Link>
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Booking Stats */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <History className="h-5 w-5" />
                                    Booking Statistics
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">Total Bookings</p>
                                    <p className="text-2xl font-bold">{total_bookings}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Upcoming Classes</p>
                                    <p className="text-2xl font-bold">{upcoming_bookings}</p>
                                </div>
                                <Button asChild variant="outline" className="w-full">
                                    <Link href="/bookings">View Bookings</Link>
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Account Info */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Account Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div>
                                    <p className="text-sm text-muted-foreground">Member Since</p>
                                    <p className="font-medium">
                                        {new Date(user.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Account Type</p>
                                    <Badge>{user.role}</Badge>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
