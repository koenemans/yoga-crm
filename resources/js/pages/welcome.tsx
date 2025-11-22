import { dashboard, login, register } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Welcome({
    canRegister = true,
}: {
    canRegister?: boolean;
}) {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Welcome" />
            <header className="border-b border-sidebar-border/80">
                <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
                    <div className="flex items-center">
                        <span className="text-xl font-semibold text-neutral-900 dark:text-white">
                            Yoga CRM
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        {auth.user ? (
                            <Link
                                href={dashboard()}
                                className="inline-flex h-9 items-center justify-center gap-2 whitespace-nowrap rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-xs transition-[color,box-shadow] hover:bg-primary/90"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={login()}
                                    className="inline-flex h-9 items-center justify-center rounded-md px-3 text-sm font-medium text-neutral-700 transition-colors hover:bg-accent hover:text-accent-foreground dark:text-neutral-300"
                                >
                                    Log in
                                </Link>
                                {canRegister && (
                                    <Link
                                        href={register()}
                                        className="inline-flex h-9 items-center justify-center gap-2 whitespace-nowrap rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-xs transition-[color,box-shadow] hover:bg-primary/90"
                                    >
                                        Register
                                    </Link>
                                )}
                            </>
                        )}
                    </div>
                </nav>
            </header>
        </>
    );
}
