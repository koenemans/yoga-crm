import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import bookings from '@/routes/bookings';
import lessons from '@/routes/lessons';
import waitlist from '@/routes/waitlist';
import { type BreadcrumbItem, type User } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Calendar, Clock, MapPin, PlusCircle, Users } from 'lucide-react';
import { useState } from 'react';

interface Lesson {
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
    available_spots: number;
    is_full: boolean;
    waitlist_enabled: boolean;
    bookings_count: number;
    user_booked: boolean;
    user_on_waitlist: boolean;
}

interface Props {
    lessons: {
        data: Lesson[];
        links: any[];
        meta: any;
    };
    user_credit_balance: number;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Lessons',
        href: lessons.index().url,
    },
];

export default function LessonsIndex({ lessons: lessonsData, user_credit_balance }: Props) {
    const { auth } = usePage<{ auth: { user: User } }>().props;
    const user = auth.user;
    const [search, setSearch] = useState('');

    const handleBook = (lessonId: number) => {
        router.post(bookings.store().url, { lesson_id: lessonId }, {
            preserveScroll: true,
        });
    };

    const handleJoinWaitlist = (lessonId: number) => {
        router.post(waitlist.store().url, { lesson_id: lessonId }, {
            preserveScroll: true,
        });
    };

    const canBook = user.role === 'pupil' || user.role === 'admin';
    const canCreate = user.role === 'admin' || user.role === 'teacher';

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Lessons" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Lessons</h1>
                        <p className="text-muted-foreground">
                            Browse and book available yoga classes
                        </p>
                    </div>
                    {canCreate && (
                        <Button asChild>
                            <Link href={lessons.create().url}>
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Create Lesson
                            </Link>
                        </Button>
                    )}
                </div>

                {/* Credit Balance for Pupils */}
                {user.role === 'pupil' && (
                    <Card className="border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-blue-900 dark:text-blue-100">
                                Your Credit Balance: {user_credit_balance}
                            </CardTitle>
                            <CardDescription className="text-blue-700 dark:text-blue-300">
                                {user_credit_balance < 3 && 'Running low on credits. '}
                                Each lesson requires credits to book.
                            </CardDescription>
                        </CardHeader>
                    </Card>
                )}

                {/* Lessons Grid */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {lessonsData.data.map((lesson) => (
                        <Card key={lesson.id} className="flex flex-col">
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <CardTitle className="text-xl">{lesson.title}</CardTitle>
                                        <CardDescription className="mt-1">
                                            {lesson.teacher.name}
                                        </CardDescription>
                                    </div>
                                    <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                                        {lesson.credits_required} {lesson.credits_required === 1 ? 'credit' : 'credits'}
                                    </span>
                                </div>
                            </CardHeader>
                            <CardContent className="flex flex-1 flex-col gap-4">
                                {lesson.description && (
                                    <p className="text-sm text-muted-foreground line-clamp-2">
                                        {lesson.description}
                                    </p>
                                )}

                                <div className="space-y-2 text-sm">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Calendar className="h-4 w-4" />
                                        <span>{new Date(lesson.start_datetime).toLocaleDateString('en-US', { 
                                            weekday: 'short', 
                                            month: 'short', 
                                            day: 'numeric',
                                            year: 'numeric'
                                        })}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Clock className="h-4 w-4" />
                                        <span>
                                            {new Date(lesson.start_datetime).toLocaleTimeString('en-US', { 
                                                hour: '2-digit', 
                                                minute: '2-digit' 
                                            })} - {new Date(lesson.end_datetime).toLocaleTimeString('en-US', { 
                                                hour: '2-digit', 
                                                minute: '2-digit' 
                                            })}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <MapPin className="h-4 w-4" />
                                        <span>{lesson.location}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Users className="h-4 w-4" />
                                        <span>
                                            {lesson.bookings_count} / {lesson.capacity} booked
                                            {lesson.available_spots > 0 && ` (${lesson.available_spots} spots left)`}
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-auto flex gap-2">
                                    <Button asChild variant="outline" className="flex-1" size="sm">
                                        <Link href={`/lessons/${lesson.id}`}>View Details</Link>
                                    </Button>
                                    
                                    {canBook && !lesson.user_booked && !lesson.is_full && (
                                        <Button 
                                            onClick={() => handleBook(lesson.id)}
                                            disabled={user_credit_balance < lesson.credits_required}
                                            className="flex-1"
                                            size="sm"
                                        >
                                            Book Now
                                        </Button>
                                    )}

                                    {canBook && !lesson.user_booked && lesson.is_full && lesson.waitlist_enabled && !lesson.user_on_waitlist && (
                                        <Button 
                                            onClick={() => handleJoinWaitlist(lesson.id)}
                                            variant="secondary"
                                            className="flex-1"
                                            size="sm"
                                        >
                                            Join Waitlist
                                        </Button>
                                    )}

                                    {lesson.user_booked && (
                                        <Button disabled className="flex-1" size="sm">
                                            Booked ✓
                                        </Button>
                                    )}

                                    {lesson.user_on_waitlist && (
                                        <Button disabled variant="secondary" className="flex-1" size="sm">
                                            On Waitlist
                                        </Button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Empty State */}
                {lessonsData.data.length === 0 && (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                            <h3 className="text-lg font-semibold mb-2">No Lessons Available</h3>
                            <p className="text-muted-foreground text-center mb-4">
                                There are no upcoming lessons scheduled at the moment.
                            </p>
                            {canCreate && (
                                <Button asChild>
                                    <Link href={lessons.create().url}>
                                        <PlusCircle className="mr-2 h-4 w-4" />
                                        Create First Lesson
                                    </Link>
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                )}

                {/* Pagination */}
                {lessonsData.links && lessonsData.links.length > 3 && (
                    <div className="flex justify-center gap-2">
                        {lessonsData.links.map((link: any, index: number) => (
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
