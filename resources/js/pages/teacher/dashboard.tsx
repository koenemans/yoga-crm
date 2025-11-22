import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import lessons from '@/routes/lessons';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Calendar, PlusCircle, TrendingUp, Users } from 'lucide-react';

interface Stats {
    total_lessons: number;
    upcoming_lessons: number;
    total_students: number;
    total_bookings: number;
    attendance_rate: number;
}

interface UpcomingLesson {
    id: number;
    title: string;
    start_datetime: string;
    location: string;
    bookings_count: number;
    capacity: number;
    available_spots: number;
}

interface RecentBooking {
    id: number;
    user: {
        id: number;
        name: string;
    };
    lesson: {
        id: number;
        title: string;
        start_datetime: string;
    };
    status: string;
    booked_at: string;
}

interface Props {
    stats: Stats;
    upcoming_lessons: UpcomingLesson[];
    recent_bookings: RecentBooking[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/teacher/dashboard',
    },
];

export default function TeacherDashboard({
    stats,
    upcoming_lessons,
    recent_bookings,
}: Props) {
    const getStatusBadge = (status: string) => {
        const styles = {
            booked: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
            attended:
                'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
            cancelled:
                'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
            no_show:
                'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100',
        };
        return (
            styles[status as keyof typeof styles] ||
            'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100'
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Teacher Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                {/* Page Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">
                            Teacher Dashboard
                        </h1>
                        <p className="text-muted-foreground">
                            Your teaching overview and statistics
                        </p>
                    </div>
                    <Button asChild size="lg">
                        <Link href={lessons.create().url}>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Create Lesson
                        </Link>
                    </Button>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-5">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Lessons
                            </CardTitle>
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {stats.total_lessons}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Upcoming
                            </CardTitle>
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {stats.upcoming_lessons}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Students
                            </CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {stats.total_students}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Bookings
                            </CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {stats.total_bookings}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Attendance Rate
                            </CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {stats.attendance_rate}%
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Upcoming Lessons */}
                <Card>
                    <CardHeader>
                        <CardTitle>Next 3 Upcoming Lessons</CardTitle>
                        <CardDescription>
                            Your scheduled classes
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {upcoming_lessons.length > 0 ? (
                                upcoming_lessons.map((lesson) => (
                                    <div
                                        key={lesson.id}
                                        className="flex items-start justify-between border-b pb-4 last:border-0"
                                    >
                                        <div className="flex-1">
                                            <h3 className="font-semibold">
                                                {lesson.title}
                                            </h3>
                                            <p className="text-sm text-muted-foreground">
                                                {lesson.start_datetime}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {lesson.location}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {lesson.bookings_count} /{' '}
                                                {lesson.capacity} booked (
                                                {lesson.available_spots} spots
                                                left)
                                            </p>
                                        </div>
                                        <Button
                                            asChild
                                            variant="outline"
                                            size="sm"
                                        >
                                            <Link
                                                href={`/lessons/${lesson.id}`}
                                            >
                                                View
                                            </Link>
                                        </Button>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center text-muted-foreground">
                                    No upcoming lessons scheduled
                                </p>
                            )}
                        </div>
                        <Button asChild variant="link" className="mt-4 w-full">
                            <Link href={lessons.index().url}>
                                View All My Lessons
                            </Link>
                        </Button>
                    </CardContent>
                </Card>

                {/* Recent Bookings */}
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Bookings</CardTitle>
                        <CardDescription>
                            Latest student bookings across your lessons
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recent_bookings.length > 0 ? (
                                recent_bookings.map((booking) => (
                                    <div
                                        key={booking.id}
                                        className="flex items-center justify-between border-b pb-4 last:border-0"
                                    >
                                        <div className="flex-1">
                                            <p className="font-medium">
                                                {booking.user.name}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {booking.lesson.title}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {booking.lesson.start_datetime}{' '}
                                                • Booked on {booking.booked_at}
                                            </p>
                                        </div>
                                        <span
                                            className={`rounded-full px-2 py-1 text-xs ${getStatusBadge(booking.status)}`}
                                        >
                                            {booking.status}
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center text-muted-foreground">
                                    No bookings yet
                                </p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
