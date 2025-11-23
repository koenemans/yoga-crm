import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import admin from '@/routes/admin';
import bookings from '@/routes/bookings';
import credits from '@/routes/credits';
import lessons from '@/routes/lessons';
import { type NavItem, type User } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import {
    BarChart3,
    Calendar,
    CreditCard,
    DollarSign,
    History,
    LayoutGrid,
    PlusCircle,
    Users,
} from 'lucide-react';
import AppLogo from './app-logo';

const getNavItemsForRole = (role: string): NavItem[] => {
    // Attendee navigation
    if (role === 'attendee') {
        return [
            {
                title: 'Dashboard',
                href: '/attendee/dashboard',
                icon: LayoutGrid,
            },
            {
                title: 'Browse Lessons',
                href: lessons.index(),
                icon: Calendar,
            },
            {
                title: 'My Bookings',
                href: bookings.index(),
                icon: History,
            },
            {
                title: 'Credits',
                href: credits.index(),
                icon: CreditCard,
            },
        ];
    }

    // Teacher navigation
    if (role === 'teacher') {
        return [
            {
                title: 'Dashboard',
                href: '/teacher/dashboard',
                icon: LayoutGrid,
            },
            {
                title: 'My Lessons',
                href: lessons.index(),
                icon: Calendar,
            },
            {
                title: 'Create Lesson',
                href: lessons.create(),
                icon: PlusCircle,
            },
            {
                title: 'My Students',
                href: '/my-students',
                icon: Users,
            },
            {
                title: 'All Lessons',
                href: lessons.all(),
                icon: Calendar,
            },
        ];
    }

    // Admin navigation - data management focused
    if (role === 'admin') {
        return [
            {
                title: 'Finance',
                href: admin.finance.dashboard(),
                icon: BarChart3,
            },
            {
                title: 'Users',
                href: admin.users.index(),
                icon: Users,
            },
            {
                title: 'Lessons',
                href: admin.lessons.index(),
                icon: Calendar,
            },
            {
                title: 'Credits',
                href: admin.credits.index(),
                icon: DollarSign,
            },
        ];
    }

    return [];
};

export function AppSidebar() {
    const { auth } = usePage<{ auth: { user: User } }>().props;
    const user = auth.user;
    const mainNavItems = getNavItemsForRole(user.role);

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
