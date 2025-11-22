import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import bookings from '@/routes/bookings';
import credits from '@/routes/credits';
import lessons from '@/routes/lessons';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Calendar, Clock, CreditCard, History, ShoppingCart, TrendingUp } from 'lucide-react';

interface NextBooking {
    id: number;
    lesson: {
        id: number;
        title: string;
        teacher: string;
        start_datetime: string;
        location: string;
    };
}

interface RecentBooking {
    id: number;
    lesson: {
        id: number;
        title: string;
        teacher: string;
        start_datetime: string;
        location: string;
    };
    status: string;
    credits_charged: number;
    booked_at: string;
}

interface WaitlistEntry {
    id: number;
    lesson: {
        id: number;
        title: string;
        teacher: string;
        start_datetime: string;
        location: string;
    };
    position: number;
    joined_at: string;
}

interface Stats {
    total_bookings: number;
    attended_classes: number;
    upcoming_bookings: number;
    waitlist_count: number;
}

interface Props {
    credit_balance: number;
    next_booking: NextBooking | null;
    recent_bookings: RecentBooking[];
    waitlist_entries: WaitlistEntry[];
    stats: Stats;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/attendee/dashboard',
    },
];

export default function AttendeeDashboard({ credit_balance, next_booking, recent_bookings, waitlist_entries, stats }: Props) {
    const getStatusBadge = (status: string) => {
        const styles = {
            booked: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
            attended: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
            cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
            no_show: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100',
        };
        return styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100';
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                {/* Page Header */}
                <div>
                    <h1 className="text-3xl font-bold">Welcome Back!</h1>
                    <p className="text-muted-foreground">Your yoga journey overview</p>
                </div>

                {/* Credit Balance - Prominent */}
                <Card className="border-2 border-primary">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CreditCard className="h-5 w-5" />
                            Credit Balance
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-4xl font-bold">{credit_balance}</p>
                                <p className="text-sm text-muted-foreground">Available credits</p>
                            </div>
                            <Button asChild size="lg">
                                <Link href={credits.index().url}>
                                    <ShoppingCart className="mr-2 h-4 w-4" />
                                    Buy Credits
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_bookings}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Attended Classes</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.attended_classes}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
                            <History className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.upcoming_bookings}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">On Waitlist</CardTitle>
                            <Clock className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.waitlist_count}</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Next Upcoming Booking */}
                {next_booking && (
                    <Card className="border-l-4 border-l-primary">
                        <CardHeader>
                            <CardTitle>Next Class</CardTitle>
                            <CardDescription>Your upcoming yoga session</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-start justify-between">
                                <div className="space-y-2">
                                    <h3 className="text-xl font-semibold">{next_booking.lesson.title}</h3>
                                    <p className="text-muted-foreground">
                                        <strong>Teacher:</strong> {next_booking.lesson.teacher}
                                    </p>
                                    <p className="text-muted-foreground">
                                        <strong>When:</strong> {next_booking.lesson.start_datetime}
                                    </p>
                                    <p className="text-muted-foreground">
                                        <strong>Where:</strong> {next_booking.lesson.location}
                                    </p>
                                </div>
                                <Button asChild variant="outline">
                                    <Link href={`/lessons/${next_booking.lesson.id}`}>View Details</Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Quick Actions */}
                <Card>
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                        <CardDescription>What would you like to do?</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4 md:grid-cols-2">
                        <Button asChild className="h-auto flex-col gap-2 py-6">
                            <Link href={lessons.index().url}>
                                <Calendar className="h-8 w-8" />
                                <span className="text-lg">Browse Lessons</span>
                            </Link>
                        </Button>
                        <Button asChild variant="outline" className="h-auto flex-col gap-2 py-6">
                            <Link href={bookings.index().url}>
                                <History className="h-8 w-8" />
                                <span className="text-lg">My Bookings</span>
                            </Link>
                        </Button>
                    </CardContent>
                </Card>

                {/* Waitlist */}
                {waitlist_entries.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>My Waitlist</CardTitle>
                            <CardDescription>Classes you're waiting to join</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {waitlist_entries.map((entry) => (
                                    <div key={entry.id} className="flex items-start justify-between border-b pb-4 last:border-0">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <Clock className="h-4 w-4 text-muted-foreground" />
                                                <p className="font-medium">{entry.lesson.title}</p>
                                            </div>
                                            <p className="text-sm text-muted-foreground">
                                                {entry.lesson.teacher} • {entry.lesson.location}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {entry.lesson.start_datetime}
                                            </p>
                                            <p className="mt-1 text-xs font-medium text-primary">
                                                Position #{entry.position} • Joined {entry.joined_at}
                                            </p>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button asChild variant="outline" size="sm">
                                                <Link href={`/lessons/${entry.lesson.id}`}>View</Link>
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Recent Bookings */}
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Bookings</CardTitle>
                        <CardDescription>Your latest class bookings</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recent_bookings.length > 0 ? (
                                recent_bookings.map((booking) => (
                                    <div key={booking.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                                        <div className="flex-1">
                                            <p className="font-medium">{booking.lesson.title}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {booking.lesson.teacher} • {booking.lesson.location}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {booking.lesson.start_datetime} • {booking.credits_charged} credits
                                            </p>
                                        </div>
                                        <span className={`rounded-full px-2 py-1 text-xs ${getStatusBadge(booking.status)}`}>
                                            {booking.status}
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center text-muted-foreground">No bookings yet. Start by browsing lessons!</p>
                            )}
                        </div>
                        {recent_bookings.length > 0 && (
                            <Button asChild variant="link" className="mt-4 w-full">
                                <Link href={bookings.index().url}>View All Bookings</Link>
                            </Button>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
