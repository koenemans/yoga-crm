import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
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

interface Props {
    teachers: Teacher[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Lessons',
        href: lessons.index().url,
    },
    {
        title: 'Create',
        href: lessons.create().url,
    },
];

export default function CreateLesson({ teachers }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        description: '',
        teacher_id: '',
        location: '',
        start_datetime: '',
        end_datetime: '',
        capacity: '15',
        credits_required: '1',
        waitlist_enabled: true,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(lessons.store().url);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Lesson" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Button asChild variant="outline" size="icon">
                        <Link href={lessons.index().url}>
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold">
                            Create New Lesson
                        </h1>
                        <p className="text-muted-foreground">
                            Schedule a new yoga class
                        </p>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    <Card className="max-w-2xl">
                        <CardHeader>
                            <CardTitle>Lesson Details</CardTitle>
                            <CardDescription>
                                Fill in the information for the new lesson
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Title */}
                            <div className="space-y-2">
                                <Label htmlFor="title">Title *</Label>
                                <Input
                                    id="title"
                                    value={data.title}
                                    onChange={(e) =>
                                        setData('title', e.target.value)
                                    }
                                    placeholder="e.g., Morning Vinyasa Flow"
                                    required
                                />
                                {errors.title && (
                                    <p className="text-sm text-destructive">
                                        {errors.title}
                                    </p>
                                )}
                            </div>

                            {/* Description */}
                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) =>
                                        setData('description', e.target.value)
                                    }
                                    placeholder="Describe the lesson..."
                                    rows={3}
                                />
                                {errors.description && (
                                    <p className="text-sm text-destructive">
                                        {errors.description}
                                    </p>
                                )}
                            </div>

                            {/* Teacher */}
                            <div className="space-y-2">
                                <Label htmlFor="teacher_id">Teacher *</Label>
                                <Select
                                    value={data.teacher_id}
                                    onValueChange={(value) =>
                                        setData('teacher_id', value)
                                    }
                                    required
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a teacher" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {teachers.map((teacher) => (
                                            <SelectItem
                                                key={teacher.id}
                                                value={teacher.id.toString()}
                                            >
                                                {teacher.first_name}{' '}
                                                {teacher.last_name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.teacher_id && (
                                    <p className="text-sm text-destructive">
                                        {errors.teacher_id}
                                    </p>
                                )}
                            </div>

                            {/* Location */}
                            <div className="space-y-2">
                                <Label htmlFor="location">Location *</Label>
                                <Input
                                    id="location"
                                    value={data.location}
                                    onChange={(e) =>
                                        setData('location', e.target.value)
                                    }
                                    placeholder="e.g., Studio A"
                                    required
                                />
                                {errors.location && (
                                    <p className="text-sm text-destructive">
                                        {errors.location}
                                    </p>
                                )}
                            </div>

                            {/* Date & Time */}
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="start_datetime">
                                        Start Date & Time *
                                    </Label>
                                    <Input
                                        id="start_datetime"
                                        type="datetime-local"
                                        value={data.start_datetime}
                                        onChange={(e) =>
                                            setData(
                                                'start_datetime',
                                                e.target.value,
                                            )
                                        }
                                        required
                                    />
                                    {errors.start_datetime && (
                                        <p className="text-sm text-destructive">
                                            {errors.start_datetime}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="end_datetime">
                                        End Date & Time *
                                    </Label>
                                    <Input
                                        id="end_datetime"
                                        type="datetime-local"
                                        value={data.end_datetime}
                                        onChange={(e) =>
                                            setData(
                                                'end_datetime',
                                                e.target.value,
                                            )
                                        }
                                        required
                                    />
                                    {errors.end_datetime && (
                                        <p className="text-sm text-destructive">
                                            {errors.end_datetime}
                                        </p>
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
                                        onChange={(e) =>
                                            setData('capacity', e.target.value)
                                        }
                                        required
                                    />
                                    {errors.capacity && (
                                        <p className="text-sm text-destructive">
                                            {errors.capacity}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="credits_required">
                                        Credits Required *
                                    </Label>
                                    <Input
                                        id="credits_required"
                                        type="number"
                                        min="1"
                                        value={data.credits_required}
                                        onChange={(e) =>
                                            setData(
                                                'credits_required',
                                                e.target.value,
                                            )
                                        }
                                        required
                                    />
                                    {errors.credits_required && (
                                        <p className="text-sm text-destructive">
                                            {errors.credits_required}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Waitlist */}
                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="waitlist_enabled"
                                    checked={data.waitlist_enabled}
                                    onChange={(
                                        e: React.ChangeEvent<HTMLInputElement>,
                                    ) =>
                                        setData(
                                            'waitlist_enabled',
                                            e.target.checked,
                                        )
                                    }
                                    className="h-4 w-4 rounded border-gray-300"
                                />
                                <Label
                                    htmlFor="waitlist_enabled"
                                    className="cursor-pointer"
                                >
                                    Enable waitlist when class is full
                                </Label>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-4 pt-4">
                                <Button type="submit" disabled={processing}>
                                    {processing
                                        ? 'Creating...'
                                        : 'Create Lesson'}
                                </Button>
                                <Button asChild variant="outline" type="button">
                                    <Link href={lessons.index().url}>
                                        Cancel
                                    </Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </form>
            </div>
        </AppLayout>
    );
}
