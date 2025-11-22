import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import lessons from '@/routes/lessons';
import { Link } from '@inertiajs/react';
import { Calendar, CheckCircle, PlusCircle, Users } from 'lucide-react';

interface TeacherDashboardProps {
    upcomingLessons?: any[];
    totalStudents?: number;
    todayClasses?: number;
}

export default function TeacherDashboard({ 
    upcomingLessons = [],
    totalStudents = 0,
    todayClasses = 0
}: TeacherDashboardProps) {
    return (
        <div className="space-y-6">
            {/* Quick Stats */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Today's Classes</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{todayClasses}</div>
                        <p className="text-xs text-muted-foreground">
                            Classes scheduled today
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Upcoming Lessons</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{upcomingLessons.length}</div>
                        <p className="text-xs text-muted-foreground">
                            In the next 7 days
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalStudents}</div>
                        <p className="text-xs text-muted-foreground">
                            Active students
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions */}
            <Card>
                <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>Manage your classes and students</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Button asChild className="h-auto flex-col gap-2 py-4">
                        <Link href={lessons.create().url}>
                            <PlusCircle className="h-6 w-6" />
                            <span>Create Lesson</span>
                        </Link>
                    </Button>
                    <Button asChild variant="outline" className="h-auto flex-col gap-2 py-4">
                        <Link href={lessons.index().url}>
                            <Calendar className="h-6 w-6" />
                            <span>My Lessons</span>
                        </Link>
                    </Button>
                    <Button asChild variant="outline" className="h-auto flex-col gap-2 py-4">
                        <Link href={lessons.index().url + '?all=true'}>
                            <Calendar className="h-6 w-6" />
                            <span>All Lessons</span>
                        </Link>
                    </Button>
                    <Button asChild variant="outline" className="h-auto flex-col gap-2 py-4">
                        <Link href="/my-profile">
                            <Users className="h-6 w-6" />
                            <span>My Profile</span>
                        </Link>
                    </Button>
                </CardContent>
            </Card>

            {/* Upcoming Lessons */}
            {upcomingLessons.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Your Upcoming Lessons</CardTitle>
                        <CardDescription>Classes you're teaching</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {upcomingLessons.slice(0, 5).map((lesson: any) => (
                                <div key={lesson.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                                    <div className="flex-1">
                                        <p className="font-medium">{lesson.title}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {lesson.start_datetime} • {lesson.location}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {lesson.bookings_count || 0} / {lesson.capacity} students
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button asChild variant="outline" size="sm">
                                            <Link href={`/lessons/${lesson.id}`}>View</Link>
                                        </Button>
                                        <Button asChild variant="outline" size="sm">
                                            <Link href={`/lessons/${lesson.id}/edit`}>Edit</Link>
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {upcomingLessons.length > 5 && (
                            <Button asChild variant="link" className="mt-4 w-full">
                                <Link href={lessons.index().url}>View All Lessons</Link>
                            </Button>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Empty State */}
            {upcomingLessons.length === 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>No Upcoming Lessons</CardTitle>
                        <CardDescription>Get started by creating your first lesson</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button asChild>
                            <Link href={lessons.create().url}>
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Create Your First Lesson
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
