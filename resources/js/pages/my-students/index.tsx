import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Search, Users } from 'lucide-react';
import { useState } from 'react';

interface Student {
    id: number;
    name: string;
    email: string;
    phone: string;
    total_bookings: number;
    attended_count: number;
    no_show_count: number;
    last_attended: string | null;
    attendance_rate: number;
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
    students: {
        data: Student[];
        links: PaginationLink[];
        meta: PaginationMeta;
    };
    filters: {
        search?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'My Students',
        href: '/my-students',
    },
];

export default function MyStudentsIndex({ students, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = () => {
        const params = new URLSearchParams();
        if (search) params.set('search', search);
        
        router.get('/my-students' + (params.toString() ? `?${params.toString()}` : ''), {}, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="My Students" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold">My Students</h1>
                    <p className="text-muted-foreground">
                        Students who have attended your classes
                    </p>
                </div>

                {/* Search */}
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        placeholder="Search by name or email..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                        className="pl-10"
                                    />
                                </div>
                            </div>
                            <Button onClick={handleSearch}>Search</Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Students Table */}
                <Card>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="border-b bg-muted/50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-sm font-medium">Name</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium">Email</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium">Phone</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium">Total Classes</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium">Attended</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium">No-Shows</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium">Attendance Rate</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium">Last Attended</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {students.data.map((student) => (
                                        <tr key={student.id} className="hover:bg-muted/50">
                                            <td className="px-4 py-3">
                                                <p className="font-medium">{student.name}</p>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-muted-foreground">
                                                {student.email}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-muted-foreground">
                                                {student.phone || '-'}
                                            </td>
                                            <td className="px-4 py-3 text-sm font-medium">
                                                {student.total_bookings}
                                            </td>
                                            <td className="px-4 py-3 text-sm">
                                                <Badge variant="secondary">{student.attended_count}</Badge>
                                            </td>
                                            <td className="px-4 py-3 text-sm">
                                                {student.no_show_count > 0 ? (
                                                    <Badge variant="outline">{student.no_show_count}</Badge>
                                                ) : (
                                                    <span className="text-muted-foreground">-</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 text-sm">
                                                <div className="flex items-center gap-2">
                                                    <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                                                        <div 
                                                            className={`h-full ${
                                                                student.attendance_rate >= 80 ? 'bg-green-500' :
                                                                student.attendance_rate >= 60 ? 'bg-yellow-500' :
                                                                'bg-red-500'
                                                            }`}
                                                            style={{ width: `${student.attendance_rate}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-xs font-medium w-10 text-right">
                                                        {student.attendance_rate}%
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-muted-foreground">
                                                {student.last_attended 
                                                    ? new Date(student.last_attended).toLocaleDateString()
                                                    : 'Never'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>

                {/* Empty State */}
                {students.data.length === 0 && (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <Users className="h-12 w-12 text-muted-foreground mb-4" />
                            <h3 className="text-lg font-semibold mb-2">No Students Yet</h3>
                            <p className="text-muted-foreground text-center">
                                Students will appear here once they book your classes.
                            </p>
                        </CardContent>
                    </Card>
                )}

                {/* Pagination */}
                {students.links && students.links.length > 3 && (
                    <div className="flex justify-center gap-2">
                        {students.links.map((link, index) => (
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
