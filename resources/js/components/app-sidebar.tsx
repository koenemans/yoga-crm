import { NavFooter } from '@/components/nav-footer';
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
import admin from '@/routes/admin';
import bookings from '@/routes/bookings';
import credits from '@/routes/credits';
import { dashboard } from '@/routes';
import lessons from '@/routes/lessons';
import { type NavItem, type User } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Calendar, CreditCard, History, LayoutGrid, PlusCircle, Settings, Users } from 'lucide-react';
import AppLogo from './app-logo';

const getNavItemsForRole = (role: string): NavItem[] => {
    const baseItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: dashboard(),
            icon: LayoutGrid,
        },
    ];

    if (role === 'pupil') {
        return [
            ...baseItems,
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
            {
                title: 'My Profile',
                href: '/my-profile',
                icon: Users,
            },
        ];
    }

    if (role === 'teacher') {
        return [
            ...baseItems,
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
                href: lessons.index().url + '?all=true',
                icon: Calendar,
            },
        ];
    }

    if (role === 'admin') {
        return [
            ...baseItems,
            {
                title: 'Users',
                href: admin.users.index(),
                icon: Users,
            },
            {
                title: 'Lessons',
                href: lessons.index(),
                icon: Calendar,
            },
            {
                title: 'Credit Packages',
                href: admin.creditPackages.index(),
                icon: CreditCard,
            },
            {
                title: 'Purchases',
                href: admin.purchases.index(),
                icon: CreditCard,
            },
        ];
    }

    if (role === 'accountant') {
        return [
            ...baseItems,
            {
                title: 'Purchases',
                href: admin.purchases.index(),
                icon: CreditCard,
            },
            {
                title: 'Users',
                href: admin.users.index(),
                icon: Users,
            },
        ];
    }

    return baseItems;
};

const footerNavItems: NavItem[] = [
    {
        title: 'Settings',
        href: '/settings/profile',
        icon: Settings,
    },
];

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
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
