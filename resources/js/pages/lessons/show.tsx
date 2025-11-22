import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';
import bookings from '@/routes/bookings';
import lessons from '@/routes/lessons';
import waitlist from '@/routes/waitlist';
import { type BreadcrumbItem, type User } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { ArrowLeft, Calendar, Clock, CreditCard, Edit, MapPin, Trash2, Users, X } from 'lucide-react';

interface LessonData {
    id: number;
    title: string;
    description: string;
    teacher: {
        id: number;
        name: string;
    };
    location: string;
    start_datetime: string;
    end_datetime: string;
    capacity: number;
    credits_required: number;
    status: string;
    waitlist_enabled: boolean;
    available_spots: number;
    is_full: boolean;
    bookings: Array<{
        id: number;
        user: {
            id: number;
            name: string;
        };
        status: string;
        booked_at: string;
    }>;
    waitlist: Array<{
        id: number;
        user: {
            id: number;
            name: string;
        };
        position: number;
    }>;
}

interface Props {
    lesson: LessonData;
    user_credit_balance: number;
    user_booked: boolean;
    user_on_waitlist: boolean;
    can_manage: boolean;
}

export default function LessonShow({ lesson, user_credit_balance, user_booked, user_on_waitlist, can_manage }: Props) {
    const { auth } = usePage<{ auth: { user: User } }>().props;
    const user = auth.user;

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Lessons',
            href: lessons.index().url,
        },
        {
            title: lesson.title,
            href: `/lessons/${lesson.id}`,
        },
    ];

    const handleBook = () => {
        router.post(bookings.store().url, { lesson_id: lesson.id }, {
            preserveScroll: true,
        });
    };

    const handleJoinWaitlist = () => {
        router.post(waitlist.store().url, { lesson_id: lesson.id }, {
            preserveScroll: true,
        });
    };

    const handleCancel = () => {
        if (confirm('Are you sure you want to cancel this lesson? All bookings will be refunded.')) {
            router.post(`/lessons/${lesson.id}/cancel`);
        }
    };

    const canBook = (user.role === 'pupil' || user.role === 'admin') && !user_booked;
    const hasEnoughCredits = user_credit_balance >= lesson.credits_required;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={lesson.title} />
            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                        <Button asChild variant="outline" size="icon">
                            <Link href={lessons.index().url}>
                                <ArrowLeft className="h-4 w-4" />
                            </Link>
                        </Button>
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-3xl font-bold">{lesson.title}</h1>
                                <Badge variant={lesson.status === 'active' ? 'default' : 'secondary'}>
                                    {lesson.status}
                                </Badge>
                            </div>
                            <p className="text-muted-foreground mt-1">
                                Taught by {lesson.teacher.name}
                            </p>
                        </div>
                    </div>
                    {can_manage && (
                        <div className="flex gap-2">
                            <Button asChild variant="outline">
                                <Link href={`/lessons/${lesson.id}/edit`}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit
                                </Link>
                            </Button>
                            <Button variant="destructive" onClick={handleCancel}>
                                <Trash2 className="mr-2 h-4 w-4" />
                                Cancel Lesson
                            </Button>
                        </div>
                    )}
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Description */}
                        {lesson.description && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>About This Class</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground whitespace-pre-wrap">
                                        {lesson.description}
                                    </p>
                                </CardContent>
                            </Card>
                        )}

                        {/* Participants */}
                        {can_manage && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Participants ({lesson.bookings.length} / {lesson.capacity})</CardTitle>
                                    <CardDescription>Students booked for this class</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {lesson.bookings.length > 0 ? (
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                {lesson.bookings.map((booking) => (
                                                    <div key={booking.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                                                        <div className="flex-1">
                                                            <p className="font-medium">{booking.user.name}</p>
                                                            <p className="text-sm text-muted-foreground">
                                                                Booked: {new Date(booking.booked_at).toLocaleDateString()}
                                                            </p>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Badge variant={
                                                                booking.status === 'booked' ? 'default' :
                                                                booking.status === 'attended' ? 'secondary' :
                                                                'outline'
                                                            }>
                                                                {booking.status}
                                                            </Badge>
                                                            {booking.status === 'booked' && (
                                                                <div className="flex gap-1">
                                                                    <Button
                                                                        size="sm"
                                                                        variant="outline"
                                                                        onClick={() => {
                                                                            router.post(`/bookings/${booking.id}/attendance`, {
                                                                                status: 'attended'
                                                                            }, {
                                                                                preserveScroll: true,
                                                                            });
                                                                        }}
                                                                    >
                                                                        ✓ Attended
                                                                    </Button>
                                                                    <Button
                                                                        size="sm"
                                                                        variant="outline"
                                                                        onClick={() => {
                                                                            router.post(`/bookings/${booking.id}/attendance`, {
                                                                                status: 'no_show'
                                                                            }, {
                                                                                preserveScroll: true,
                                                                            });
                                                                        }}
                                                                    >
                                                                        ✗ No-Show
                                                                    </Button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            {lesson.bookings.some(b => b.status === 'booked') && (
                                                <div className="flex gap-2 pt-2 border-t">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => {
                                                            if (confirm('Mark all booked students as attended?')) {
                                                                lesson.bookings
                                                                    .filter(b => b.status === 'booked')
                                                                    .forEach(booking => {
                                                                        router.post(`/bookings/${booking.id}/attendance`, {
                                                                            status: 'attended'
                                                                        }, {
                                                                            preserveScroll: true,
                                                                            preserveState: true,
                                                                        });
                                                                    });
                                                            }
                                                        }}
                                                    >
                                                        Mark All Attended
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <p className="text-muted-foreground text-center py-4">
                                            No bookings yet
                                        </p>
                                    )}
                                </CardContent>
                            </Card>
                        )}

                        {/* Waitlist */}
                        {can_manage && lesson.waitlist.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Waitlist ({lesson.waitlist.length})</CardTitle>
                                    <CardDescription>Students waiting for a spot</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        {lesson.waitlist.map((entry) => (
                                            <div key={entry.id} className="flex items-center justify-between border-b pb-2 last:border-0">
                                                <div>
                                                    <p className="font-medium">{entry.user.name}</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        Position: #{entry.position}
                                                    </p>
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
                        {/* Details Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Class Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                                    <div>
                                        <p className="font-medium">Date</p>
                                        <p className="text-sm text-muted-foreground">
                                            {new Date(lesson.start_datetime).toLocaleDateString('en-US', {
                                                weekday: 'long',
                                                month: 'long',
                                                day: 'numeric',
                                                year: 'numeric',
                                            })}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                                    <div>
                                        <p className="font-medium">Time</p>
                                        <p className="text-sm text-muted-foreground">
                                            {new Date(lesson.start_datetime).toLocaleTimeString('en-US', {
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })} - {new Date(lesson.end_datetime).toLocaleTimeString('en-US', {
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                                    <div>
                                        <p className="font-medium">Location</p>
                                        <p className="text-sm text-muted-foreground">{lesson.location}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
                                    <div>
                                        <p className="font-medium">Capacity</p>
                                        <p className="text-sm text-muted-foreground">
                                            {lesson.bookings.length} / {lesson.capacity} booked
                                            {lesson.available_spots > 0 && ` (${lesson.available_spots} spots left)`}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <CreditCard className="h-5 w-5 text-muted-foreground mt-0.5" />
                                    <div>
                                        <p className="font-medium">Credits Required</p>
                                        <p className="text-sm text-muted-foreground">
                                            {lesson.credits_required} {lesson.credits_required === 1 ? 'credit' : 'credits'}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Booking Card */}
                        {(user.role === 'pupil' || user.role === 'admin') && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Book This Class</CardTitle>
                                    <CardDescription>
                                        Your balance: {user_credit_balance} credits
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {user_booked ? (
                                        <div className="text-center py-4">
                                            <Badge className="mb-2">Already Booked</Badge>
                                            <p className="text-sm text-muted-foreground">
                                                You're registered for this class
                                            </p>
                                        </div>
                                    ) : lesson.is_full ? (
                                        lesson.waitlist_enabled && !user_on_waitlist ? (
                                            <>
                                                <p className="text-sm text-muted-foreground">
                                                    This class is full. Join the waitlist to be notified if a spot opens up.
                                                </p>
                                                <Button onClick={handleJoinWaitlist} className="w-full">
                                                    Join Waitlist
                                                </Button>
                                            </>
                                        ) : user_on_waitlist ? (
                                            <div className="text-center py-4">
                                                <Badge variant="secondary" className="mb-2">On Waitlist</Badge>
                                                <p className="text-sm text-muted-foreground">
                                                    You'll be notified if a spot opens up
                                                </p>
                                            </div>
                                        ) : (
                                            <p className="text-sm text-muted-foreground text-center py-4">
                                                This class is full
                                            </p>
                                        )
                                    ) : (
                                        <>
                                            {!hasEnoughCredits && (
                                                <div className="rounded-lg bg-orange-50 p-3 dark:bg-orange-950">
                                                    <p className="text-sm text-orange-900 dark:text-orange-100">
                                                        You need {lesson.credits_required - user_credit_balance} more credits to book this class.
                                                    </p>
                                                </div>
                                            )}
                                            <Button 
                                                onClick={handleBook}
                                                disabled={!hasEnoughCredits}
                                                className="w-full"
                                            >
                                                Book Now ({lesson.credits_required} credits)
                                            </Button>
                                            {!hasEnoughCredits && (
                                                <Button asChild variant="outline" className="w-full">
                                                    <Link href="/credits">Purchase Credits</Link>
                                                </Button>
                                            )}
                                        </>
                                    )}
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
