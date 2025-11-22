import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import bookings from '@/routes/bookings';
import lessons from '@/routes/lessons';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Calendar, Clock, MapPin, X } from 'lucide-react';

interface Booking {
    id: number;
    lesson: {
        id: number;
        title: string;
        teacher: string;
        location: string;
        start_datetime: string;
        end_datetime: string;
    };
    status: string;
    credits_charged: number;
    booked_at: string;
    cancelled_at: string | null;
    can_cancel: boolean;
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
    bookings: {
        data: Booking[];
        links: PaginationLink[];
        meta: PaginationMeta;
    };
    credit_balance: number;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'My Bookings',
        href: bookings.index().url,
    },
];

const statusColors = {
    booked: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
    attended: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
    no_show: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
    cancelled_by_pupil: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100',
    cancelled_by_admin: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100',
};

export default function BookingsIndex({ bookings: bookingsData, credit_balance }: Props) {
    const handleCancel = (bookingId: number) => {
        if (confirm('Are you sure you want to cancel this booking?')) {
            router.delete(`/bookings/${bookingId}`, {
                preserveScroll: true,
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="My Bookings" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">My Bookings</h1>
                        <p className="text-muted-foreground">
                            View and manage your class bookings
                        </p>
                    </div>
                    <Button asChild>
                        <Link href={lessons.index().url}>
                            Browse Lessons
                        </Link>
                    </Button>
                </div>

                {/* Credit Balance */}
                <Card className="border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-blue-900 dark:text-blue-100">
                            Current Credit Balance: {credit_balance}
                        </CardTitle>
                        <CardDescription className="text-blue-700 dark:text-blue-300">
                            Credits available for booking classes
                        </CardDescription>
                    </CardHeader>
                </Card>

                {/* Bookings List */}
                <div className="space-y-4">
                    {bookingsData.data.map((booking) => (
                        <Card key={booking.id}>
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <CardTitle className="text-xl">{booking.lesson.title}</CardTitle>
                                        <CardDescription className="mt-1">
                                            {booking.lesson.teacher}
                                        </CardDescription>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                                            statusColors[booking.status as keyof typeof statusColors]
                                        }`}>
                                            {booking.status.replace(/_/g, ' ')}
                                        </span>
                                        {booking.can_cancel && (
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleCancel(booking.id)}
                                                title="Cancel booking"
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-3 md:grid-cols-3">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Calendar className="h-4 w-4" />
                                        <span>
                                            {new Date(booking.lesson.start_datetime).toLocaleDateString('en-US', {
                                                weekday: 'short',
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric',
                                            })}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Clock className="h-4 w-4" />
                                        <span>
                                            {new Date(booking.lesson.start_datetime).toLocaleTimeString('en-US', {
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })} - {new Date(booking.lesson.end_datetime).toLocaleTimeString('en-US', {
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <MapPin className="h-4 w-4" />
                                        <span>{booking.lesson.location}</span>
                                    </div>
                                </div>
                                <div className="mt-3 flex items-center justify-between border-t pt-3">
                                    <span className="text-sm text-muted-foreground">
                                        Credits charged: <span className="font-medium text-foreground">{booking.credits_charged}</span>
                                    </span>
                                    <span className="text-sm text-muted-foreground">
                                        Booked: {new Date(booking.booked_at).toLocaleDateString()}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Empty State */}
                {bookingsData.data.length === 0 && (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                            <h3 className="text-lg font-semibold mb-2">No Bookings Yet</h3>
                            <p className="text-muted-foreground text-center mb-4">
                                You haven't booked any classes yet. Browse available lessons to get started.
                            </p>
                            <Button asChild>
                                <Link href={lessons.index().url}>
                                    Browse Lessons
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                )}

                {/* Pagination */}
                {bookingsData.links && bookingsData.links.length > 3 && (
                    <div className="flex justify-center gap-2">
                        {bookingsData.links.map((link, index) => (
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
