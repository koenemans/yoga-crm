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
import { type BreadcrumbItem, type PaginatedData } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Calendar, Eye } from 'lucide-react';

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
}

interface Props {
    lessons: PaginatedData<Lesson>;
    user_credit_balance: number;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'All Lessons',
        href: lessons.all().url,
    },
];

export default function AllLessons({ lessons: lessonsData }: Props) {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('nl-NL', {
            weekday: 'short',
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="All Lessons" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">All Lessons</h1>
                        <p className="text-muted-foreground">
                            View all upcoming lessons (read-only)
                        </p>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Upcoming Lessons</CardTitle>
                        <CardDescription>
                            Showing {lessonsData.data.length} of{' '}
                            {lessonsData.total} lessons
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {lessonsData.data.map((lesson) => (
                                <div
                                    key={lesson.id}
                                    className="flex items-start justify-between border-b pb-4 last:border-0"
                                >
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4 text-muted-foreground" />
                                            <h3 className="font-semibold">
                                                {lesson.title}
                                            </h3>
                                        </div>
                                        <p className="mt-1 text-sm text-muted-foreground">
                                            {lesson.description}
                                        </p>
                                        <div className="mt-2 flex flex-wrap gap-4 text-sm">
                                            <span className="text-muted-foreground">
                                                <strong>Teacher:</strong>{' '}
                                                {lesson.teacher.name}
                                            </span>
                                            <span className="text-muted-foreground">
                                                <strong>Location:</strong>{' '}
                                                {lesson.location}
                                            </span>
                                            <span className="text-muted-foreground">
                                                <strong>Time:</strong>{' '}
                                                {formatDate(
                                                    lesson.start_datetime,
                                                )}
                                            </span>
                                            <span className="text-muted-foreground">
                                                <strong>Capacity:</strong>{' '}
                                                {lesson.bookings_count} /{' '}
                                                {lesson.capacity}
                                            </span>
                                            <span className="text-muted-foreground">
                                                <strong>Credits:</strong>{' '}
                                                {lesson.credits_required}
                                            </span>
                                        </div>
                                    </div>
                                    <Button asChild variant="outline" size="sm">
                                        <Link href={`/lessons/${lesson.id}`}>
                                            <Eye className="mr-2 h-4 w-4" />
                                            View
                                        </Link>
                                    </Button>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {lessonsData.links.length > 3 && (
                            <div className="mt-6 flex items-center justify-center gap-2">
                                {lessonsData.links.map((link, index) => (
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
