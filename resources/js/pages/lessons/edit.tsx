import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import lessons from '@/routes/lessons';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

interface Teacher {
    id: number;
    first_name: string;
    last_name: string;
    name: string;
}

interface LessonData {
    id: number;
    title: string;
    description: string;
    teacher_id: number;
    location: string;
    start_datetime: string;
    end_datetime: string;
    capacity: number;
    credits_required: number;
    waitlist_enabled: boolean;
}

interface Props {
    lesson: LessonData;
    teachers: Teacher[];
}

export default function EditLesson({ lesson, teachers }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Lessons',
            href: lessons.index().url,
        },
        {
            title: lesson.title,
            href: `/lessons/${lesson.id}`,
        },
        {
            title: 'Edit',
            href: `/lessons/${lesson.id}/edit`,
        },
    ];

    const { data, setData, put, processing, errors } = useForm({
        title: lesson.title,
        description: lesson.description || '',
        teacher_id: lesson.teacher_id.toString(),
        location: lesson.location,
        start_datetime: lesson.start_datetime.slice(0, 16),
        end_datetime: lesson.end_datetime.slice(0, 16),
        capacity: lesson.capacity.toString(),
        credits_required: lesson.credits_required.toString(),
        waitlist_enabled: lesson.waitlist_enabled,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/lessons/${lesson.id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${lesson.title}`} />
            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Button asChild variant="outline" size="icon">
                        <Link href={`/lessons/${lesson.id}`}>
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold">Edit Lesson</h1>
                        <p className="text-muted-foreground">
                            Update lesson details
                        </p>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    <Card className="max-w-2xl">
                        <CardHeader>
                            <CardTitle>Lesson Details</CardTitle>
                            <CardDescription>
                                Modify the lesson information
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Title */}
                            <div className="space-y-2">
                                <Label htmlFor="title">Title *</Label>
                                <Input
                                    id="title"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    required
                                />
                                {errors.title && (
                                    <p className="text-sm text-destructive">{errors.title}</p>
                                )}
                            </div>

                            {/* Description */}
                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    rows={3}
                                />
                                {errors.description && (
                                    <p className="text-sm text-destructive">{errors.description}</p>
                                )}
                            </div>

                            {/* Teacher */}
                            <div className="space-y-2">
                                <Label htmlFor="teacher_id">Teacher *</Label>
                                <Select
                                    value={data.teacher_id}
                                    onValueChange={(value) => setData('teacher_id', value)}
                                    required
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {teachers.map((teacher) => (
                                            <SelectItem key={teacher.id} value={teacher.id.toString()}>
                                                {teacher.first_name} {teacher.last_name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.teacher_id && (
                                    <p className="text-sm text-destructive">{errors.teacher_id}</p>
                                )}
                            </div>

                            {/* Location */}
                            <div className="space-y-2">
                                <Label htmlFor="location">Location *</Label>
                                <Input
                                    id="location"
                                    value={data.location}
                                    onChange={(e) => setData('location', e.target.value)}
                                    required
                                />
                                {errors.location && (
                                    <p className="text-sm text-destructive">{errors.location}</p>
                                )}
                            </div>

                            {/* Date & Time */}
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="start_datetime">Start Date & Time *</Label>
                                    <Input
                                        id="start_datetime"
                                        type="datetime-local"
                                        value={data.start_datetime}
                                        onChange={(e) => setData('start_datetime', e.target.value)}
                                        required
                                    />
                                    {errors.start_datetime && (
                                        <p className="text-sm text-destructive">{errors.start_datetime}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="end_datetime">End Date & Time *</Label>
                                    <Input
                                        id="end_datetime"
                                        type="datetime-local"
                                        value={data.end_datetime}
                                        onChange={(e) => setData('end_datetime', e.target.value)}
                                        required
                                    />
                                    {errors.end_datetime && (
                                        <p className="text-sm text-destructive">{errors.end_datetime}</p>
                                    )}
                                </div>
                            </div>

                            {/* Capacity & Credits */}
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="capacity">Capacity *</Label>
                                    <Input
                                        id="capacity"
                                        type="number"
                                        min="1"
                                        value={data.capacity}
                                        onChange={(e) => setData('capacity', e.target.value)}
                                        required
                                    />
                                    {errors.capacity && (
                                        <p className="text-sm text-destructive">{errors.capacity}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="credits_required">Credits Required *</Label>
                                    <Input
                                        id="credits_required"
                                        type="number"
                                        min="1"
                                        value={data.credits_required}
                                        onChange={(e) => setData('credits_required', e.target.value)}
                                        required
                                    />
                                    {errors.credits_required && (
                                        <p className="text-sm text-destructive">{errors.credits_required}</p>
                                    )}
                                </div>
                            </div>

                            {/* Waitlist */}
                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="waitlist_enabled"
                                    checked={data.waitlist_enabled}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('waitlist_enabled', e.target.checked)}
                                    className="h-4 w-4 rounded border-gray-300"
                                />
                                <Label htmlFor="waitlist_enabled" className="cursor-pointer">
                                    Enable waitlist when class is full
                                </Label>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-4 pt-4">
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Saving...' : 'Save Changes'}
                                </Button>
                                <Button asChild variant="outline" type="button">
                                    <Link href={`/lessons/${lesson.id}`}>Cancel</Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </form>
            </div>
        </AppLayout>
    );
}
