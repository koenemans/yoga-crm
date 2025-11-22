import AccountantDashboard from '@/components/dashboard/accountant-dashboard';
import AttendeeDashboard from '@/components/dashboard/attendee-dashboard';
import TeacherDashboard from '@/components/dashboard/teacher-dashboard';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem, type User } from '@/types';
import { Head, usePage } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

interface Props {
    role: 'attendee' | 'teacher';
    creditBalance?: number;
    upcomingBookings?: any[];
    expiringCredits?: any[];
    upcomingLessons?: any[];
    totalStudents?: number;
    todayClasses?: number;
    totalRevenue?: number;
    pendingPurchases?: number;
    activeStudents?: number;
    recentTransactions?: any[];
}

export default function Dashboard(props: Props) {
    const { auth } = usePage<{ auth: { user: User } }>().props;
    const user = auth.user;

    const renderDashboard = () => {
        switch (props.role) {
            case 'attendee':
                return (
                    <AttendeeDashboard
                        creditBalance={props.creditBalance}
                        upcomingBookings={props.upcomingBookings}
                        expiringCredits={props.expiringCredits}
                    />
                );
            case 'teacher':
                return (
                    <TeacherDashboard
                        upcomingLessons={props.upcomingLessons}
                        totalStudents={props.totalStudents}
                        todayClasses={props.todayClasses}
                    />
                );
            default:
                return <div>Unknown role</div>;
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="mb-4">
                    <h1 className="text-3xl font-bold">
                        Welcome back, {user.first_name || user.name}!
                    </h1>
                    <p className="text-muted-foreground">
                        {props.role === 'attendee' && 'Book classes and manage your credits'}
                        {props.role === 'teacher' && 'Manage your lessons and students'}
                    </p>
                </div>
                {renderDashboard()}
            </div>
        </AppLayout>
    );
}
