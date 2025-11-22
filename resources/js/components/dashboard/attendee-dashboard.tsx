import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import bookings from '@/routes/bookings';
import credits from '@/routes/credits';
import lessons from '@/routes/lessons';
import { Link } from '@inertiajs/react';
import { Calendar, CreditCard, History, User } from 'lucide-react';

interface AttendeeDashboardProps {
    creditBalance?: number;
    upcomingBookings?: any[];
    expiringCredits?: any[];
}

export default function AttendeeDashboard({ 
    creditBalance = 0, 
    upcomingBookings = [],
    expiringCredits = []
}: AttendeeDashboardProps) {
    return (
        <div className="space-y-6">
            {/* Quick Stats */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Credit Balance</CardTitle>
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{creditBalance}</div>
                        <p className="text-xs text-muted-foreground">
                            Available credits
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Upcoming Classes</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{upcomingBookings.length}</div>
                        <p className="text-xs text-muted-foreground">
                            Booked lessons
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
                        <History className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{expiringCredits.length}</div>
                        <p className="text-xs text-muted-foreground">
                            Credits expiring
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions */}
            <Card>
                <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>Get started with common tasks</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Button asChild className="h-auto flex-col gap-2 py-4">
                        <Link href={lessons.index().url}>
                            <Calendar className="h-6 w-6" />
                            <span>Browse Lessons</span>
                        </Link>
                    </Button>
                    <Button asChild variant="outline" className="h-auto flex-col gap-2 py-4">
                        <Link href={bookings.index().url}>
                            <History className="h-6 w-6" />
                            <span>My Bookings</span>
                        </Link>
                    </Button>
                    <Button asChild variant="outline" className="h-auto flex-col gap-2 py-4">
                        <Link href={credits.index().url}>
                            <CreditCard className="h-6 w-6" />
                            <span>Buy Credits</span>
                        </Link>
                    </Button>
                    <Button asChild variant="outline" className="h-auto flex-col gap-2 py-4">
                        <Link href="/my-profile">
                            <User className="h-6 w-6" />
                            <span>My Profile</span>
                        </Link>
                    </Button>
                </CardContent>
            </Card>

            {/* Low Credit Warning */}
            {creditBalance < 3 && (
                <Card className="border-orange-200 bg-orange-50 dark:border-orange-900 dark:bg-orange-950">
                    <CardHeader>
                        <CardTitle className="text-orange-900 dark:text-orange-100">Low Credit Balance</CardTitle>
                        <CardDescription className="text-orange-700 dark:text-orange-300">
                            You have {creditBalance} credit{creditBalance !== 1 ? 's' : ''} remaining. Consider purchasing more to book upcoming classes.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button asChild>
                            <Link href={credits.index().url}>Purchase Credits</Link>
                        </Button>
                    </CardContent>
                </Card>
            )}

            {/* Upcoming Bookings */}
            {upcomingBookings.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Your Upcoming Classes</CardTitle>
                        <CardDescription>Classes you're booked for</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {upcomingBookings.slice(0, 5).map((booking: any) => (
                                <div key={booking.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                                    <div>
                                        <p className="font-medium">{booking.lesson?.title}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {booking.lesson?.start_datetime}
                                        </p>
                                    </div>
                                    <Button asChild variant="outline" size="sm">
                                        <Link href={`/lessons/${booking.lesson?.id}`}>View</Link>
                                    </Button>
                                </div>
                            ))}
                        </div>
                        {upcomingBookings.length > 5 && (
                            <Button asChild variant="link" className="mt-4 w-full">
                                <Link href={bookings.index().url}>View All Bookings</Link>
                            </Button>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
