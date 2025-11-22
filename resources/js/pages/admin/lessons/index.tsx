import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import admin from '@/routes/admin';
import lessons from '@/routes/lessons';
import { type BreadcrumbItem, type PaginatedData } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Calendar, PlusCircle, TrendingUp, Users } from 'lucide-react';

interface DashboardStats {
    total_attendees: number;
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

interface AllLesson {
    id: number;
    title: string;
    teacher: string;
    start_datetime: string;
    location: string;
    status: string;
    bookings_count: number;
    capacity: number;
    available_spots: number;
}

interface Props {
    stats: DashboardStats;
    upcoming_lessons: UpcomingLesson[];
    recent_bookings: RecentBooking[];
    all_lessons: PaginatedData<AllLesson>;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admin',
        href: admin.lessons.index().url,
    },
    {
        title: 'Lessons',
        href: admin.lessons.index().url,
    },
];

export default function AdminDashboard({
    stats,
    upcoming_lessons,
    recent_bookings,
    all_lessons,
}: Props) {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('nl-NL', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getStatusBadge = (status: string) => {
        const styles = {
            active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
            cancelled:
                'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
            completed:
                'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
        };
        return (
            styles[status as keyof typeof styles] ||
            'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100'
        );
    };
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Lessons Management" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                {/* Page Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">
                            Lessons Management
                        </h1>
                        <p className="text-muted-foreground">
                            Manage your yoga school
                        </p>
                    </div>
                    <Button asChild size="lg">
                        <Link href={lessons.create().url}>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Create Lesson
                        </Link>
                    </Button>
                </div>

                {/* Quick Stats */}
                <div className="grid gap-4 md:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Attendees
                            </CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {stats.total_attendees}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Active students
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Teachers
                            </CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {stats.total_teachers}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Active teachers
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Upcoming Lessons
                            </CardTitle>
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {stats.upcoming_lessons}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Next 7 days
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Bookings This Month
                            </CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {stats.total_bookings_this_month}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Total bookings
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    {/* Upcoming Lessons */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Upcoming Lessons</CardTitle>
                            <CardDescription>
                                Next classes scheduled
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {upcoming_lessons.slice(0, 5).map((lesson) => (
                                    <div
                                        key={lesson.id}
                                        className="flex items-start justify-between border-b pb-4 last:border-0"
                                    >
                                        <div className="flex-1">
                                            <p className="font-medium">
                                                {lesson.title}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {lesson.teacher} •{' '}
                                                {lesson.location}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {lesson.start_datetime}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {lesson.bookings_count} /{' '}
                                                {lesson.capacity} booked
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
                                ))}
                            </div>
                            {upcoming_lessons.length > 5 && (
                                <Button
                                    asChild
                                    variant="link"
                                    className="mt-4 w-full"
                                >
                                    <Link href={lessons.index().url}>
                                        View All Lessons
                                    </Link>
                                </Button>
                            )}
                        </CardContent>
                    </Card>

                    {/* Recent Bookings */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Bookings</CardTitle>
                            <CardDescription>
                                Latest student bookings
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {recent_bookings.slice(0, 5).map((booking) => (
                                    <div
                                        key={booking.id}
                                        className="flex items-center justify-between border-b pb-4 last:border-0"
                                    >
                                        <div>
                                            <p className="font-medium">
                                                {booking.user}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {booking.lesson}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {booking.created_at}
                                            </p>
                                        </div>
                                        <span
                                            className={`rounded-full px-2 py-1 text-xs ${
                                                booking.status === 'booked'
                                                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
                                                    : booking.status ===
                                                        'attended'
                                                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100'
                                                      : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100'
                                            }`}
                                        >
                                            {booking.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* All Lessons Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>All Lessons</CardTitle>
                        <CardDescription>
                            Complete overview of all lessons
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b text-left text-sm font-medium text-muted-foreground">
                                        <th className="pb-3">Title</th>
                                        <th className="pb-3">Teacher</th>
                                        <th className="pb-3">Date & Time</th>
                                        <th className="pb-3">Location</th>
                                        <th className="pb-3">Bookings</th>
                                        <th className="pb-3">Status</th>
                                        <th className="pb-3 text-right">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {all_lessons.data.map((lesson) => (
                                        <tr
                                            key={lesson.id}
                                            className="border-b last:border-0"
                                        >
                                            <td className="py-3 font-medium">
                                                {lesson.title}
                                            </td>
                                            <td className="py-3 text-sm">
                                                {lesson.teacher}
                                            </td>
                                            <td className="py-3 text-sm">
                                                {formatDate(
                                                    lesson.start_datetime,
                                                )}
                                            </td>
                                            <td className="py-3 text-sm">
                                                {lesson.location}
                                            </td>
                                            <td className="py-3 text-sm">
                                                {lesson.bookings_count} /{' '}
                                                {lesson.capacity}
                                                <span className="ml-2 text-xs text-muted-foreground">
                                                    ({lesson.available_spots}{' '}
                                                    left)
                                                </span>
                                            </td>
                                            <td className="py-3">
                                                <span
                                                    className={`rounded-full px-2 py-1 text-xs ${getStatusBadge(lesson.status)}`}
                                                >
                                                    {lesson.status}
                                                </span>
                                            </td>
                                            <td className="py-3 text-right">
                                                <Button
                                                    asChild
                                                    variant="ghost"
                                                    size="sm"
                                                >
                                                    <Link
                                                        href={`/lessons/${lesson.id}`}
                                                    >
                                                        View
                                                    </Link>
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {all_lessons.links.length > 3 && (
                            <div className="mt-4 flex items-center justify-center gap-2">
                                {all_lessons.links.map((link, index) => (
                                    <Button
                                        key={index}
                                        asChild={!!link.url}
                                        variant={
                                            link.active ? 'default' : 'outline'
                                        }
                                        size="sm"
                                        disabled={!link.url}
                                    >
                                        {link.url ? (
                                            <Link
                                                href={link.url}
                                                dangerouslySetInnerHTML={{
                                                    __html: link.label,
                                                }}
                                            />
                                        ) : (
                                            <span
                                                dangerouslySetInnerHTML={{
                                                    __html: link.label,
                                                }}
                                            />
                                        )}
                                    </Button>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
