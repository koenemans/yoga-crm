import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import admin from '@/routes/admin';
import lessons from '@/routes/lessons';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Calendar, CreditCard, PlusCircle, TrendingUp, Users } from 'lucide-react';

interface DashboardStats {
    total_pupils: number;
    total_teachers: number;
    upcoming_lessons: number;
    total_bookings_this_month: number;
}

interface UpcomingLesson {
    id: number;
    title: string;
    teacher: string;
    start_datetime: string;
    location: string;
    bookings_count: number;
    capacity: number;
    available_spots: number;
}

interface RecentBooking {
    id: number;
    user: string;
    lesson: string;
    status: string;
    created_at: string;
}

interface Props {
    stats: DashboardStats;
    upcoming_lessons: UpcomingLesson[];
    recent_bookings: RecentBooking[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admin Dashboard',
        href: admin.dashboard().url,
    },
];

export default function AdminDashboard({ stats, upcoming_lessons, recent_bookings }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Admin Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                {/* Page Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                        <p className="text-muted-foreground">Manage your yoga school</p>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="grid gap-4 md:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Pupils</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_pupils}</div>
                            <p className="text-xs text-muted-foreground">Active students</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Teachers</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_teachers}</div>
                            <p className="text-xs text-muted-foreground">Active teachers</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Upcoming Lessons</CardTitle>
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.upcoming_lessons}</div>
                            <p className="text-xs text-muted-foreground">Next 7 days</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Bookings This Month</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_bookings_this_month}</div>
                            <p className="text-xs text-muted-foreground">Total bookings</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Actions */}
                <Card>
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                        <CardDescription>Common administrative tasks</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                        <Button asChild className="h-auto flex-col gap-2 py-4">
                            <Link href={admin.users.create().url}>
                                <PlusCircle className="h-6 w-6" />
                                <span>Add User</span>
                            </Link>
                        </Button>
                        <Button asChild variant="outline" className="h-auto flex-col gap-2 py-4">
                            <Link href={lessons.create().url}>
                                <PlusCircle className="h-6 w-6" />
                                <span>Create Lesson</span>
                            </Link>
                        </Button>
                        <Button asChild variant="outline" className="h-auto flex-col gap-2 py-4">
                            <Link href={admin.users.index().url}>
                                <Users className="h-6 w-6" />
                                <span>Manage Users</span>
                            </Link>
                        </Button>
                        <Button asChild variant="outline" className="h-auto flex-col gap-2 py-4">
                            <Link href={admin.creditPackages.index().url}>
                                <CreditCard className="h-6 w-6" />
                                <span>Credit Packages</span>
                            </Link>
                        </Button>
                        <Button asChild variant="outline" className="h-auto flex-col gap-2 py-4">
                            <Link href={admin.purchases.index().url}>
                                <CreditCard className="h-6 w-6" />
                                <span>Purchases</span>
                            </Link>
                        </Button>
                    </CardContent>
                </Card>

                <div className="grid gap-6 md:grid-cols-2">
                    {/* Upcoming Lessons */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Upcoming Lessons</CardTitle>
                            <CardDescription>Next classes scheduled</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {upcoming_lessons.slice(0, 5).map((lesson) => (
                                    <div key={lesson.id} className="flex items-start justify-between border-b pb-4 last:border-0">
                                        <div className="flex-1">
                                            <p className="font-medium">{lesson.title}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {lesson.teacher} • {lesson.location}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {lesson.start_datetime}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {lesson.bookings_count} / {lesson.capacity} booked
                                            </p>
                                        </div>
                                        <Button asChild variant="outline" size="sm">
                                            <Link href={`/lessons/${lesson.id}`}>View</Link>
                                        </Button>
                                    </div>
                                ))}
                            </div>
                            {upcoming_lessons.length > 5 && (
                                <Button asChild variant="link" className="mt-4 w-full">
                                    <Link href={lessons.index().url}>View All Lessons</Link>
                                </Button>
                            )}
                        </CardContent>
                    </Card>

                    {/* Recent Bookings */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Bookings</CardTitle>
                            <CardDescription>Latest student bookings</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {recent_bookings.slice(0, 5).map((booking) => (
                                    <div key={booking.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                                        <div>
                                            <p className="font-medium">{booking.user}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {booking.lesson}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {booking.created_at}
                                            </p>
                                        </div>
                                        <span className={`rounded-full px-2 py-1 text-xs ${
                                            booking.status === 'booked' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' :
                                            booking.status === 'attended' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100' :
                                            'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100'
                                        }`}>
                                            {booking.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
