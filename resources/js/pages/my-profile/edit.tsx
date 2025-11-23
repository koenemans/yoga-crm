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
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type User } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'My Profile',
        href: '/my-profile',
    },
    {
        title: 'Edit',
        href: '/my-profile/edit',
    },
];

export default function MyProfileEdit() {
    const { auth } = usePage<{ auth: { user: User } }>().props;
    const user = auth.user;

    const { data, setData, put, processing, errors } = useForm({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email,
        phone: user.phone || '',
        address: user.address || '',
        emergency_contact: user.emergency_contact || '',
        emergency_contact_phone: user.emergency_contact_phone || '',
        preferred_language: user.preferred_language,
    });

    const {
        data: passwordData,
        setData: setPasswordData,
        put: putPassword,
        processing: processingPassword,
        errors: passwordErrors,
        reset: resetPassword,
    } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put('/my-profile');
    };

    const handlePasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        putPassword('/my-profile/password', {
            onSuccess: () => resetPassword(),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Profile" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                <div className="flex items-center gap-4">
                    <Button asChild variant="outline" size="icon">
                        <Link href="/my-profile">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold">Edit Profile</h1>
                        <p className="text-muted-foreground">
                            Update your personal information
                        </p>
                    </div>
                </div>

                <div className="max-w-2xl space-y-6">
                    {/* Personal Information */}
                    <form onSubmit={handleSubmit}>
                        <Card>
                            <CardHeader>
                                <CardTitle>Personal Information</CardTitle>
                                <CardDescription>
                                    Update your personal details
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="first_name">
                                            First Name *
                                        </Label>
                                        <Input
                                            id="first_name"
                                            value={data.first_name}
                                            onChange={(e) =>
                                                setData(
                                                    'first_name',
                                                    e.target.value,
                                                )
                                            }
                                            required
                                        />
                                        {errors.first_name && (
                                            <p className="text-sm text-destructive">
                                                {errors.first_name}
                                            </p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="last_name">
                                            Last Name *
                                        </Label>
                                        <Input
                                            id="last_name"
                                            value={data.last_name}
                                            onChange={(e) =>
                                                setData(
                                                    'last_name',
                                                    e.target.value,
                                                )
                                            }
                                            required
                                        />
                                        {errors.last_name && (
                                            <p className="text-sm text-destructive">
                                                {errors.last_name}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">Email *</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) =>
                                            setData('email', e.target.value)
                                        }
                                        required
                                    />
                                    {errors.email && (
                                        <p className="text-sm text-destructive">
                                            {errors.email}
                                        </p>
                                    )}
                                </div>

                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Phone</Label>
                                        <Input
                                            id="phone"
                                            value={data.phone}
                                            onChange={(e) =>
                                                setData('phone', e.target.value)
                                            }
                                        />
                                        {errors.phone && (
                                            <p className="text-sm text-destructive">
                                                {errors.phone}
                                            </p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="preferred_language">
                                            Language *
                                        </Label>
                                        <Select
                                            value={data.preferred_language}
                                            onValueChange={(value) =>
                                                setData(
                                                    'preferred_language',
                                                    value,
                                                )
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="nl">
                                                    Dutch
                                                </SelectItem>
                                                <SelectItem value="en">
                                                    English
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="address">Address</Label>
                                    <Input
                                        id="address"
                                        value={data.address}
                                        onChange={(e) =>
                                            setData('address', e.target.value)
                                        }
                                    />
                                    {errors.address && (
                                        <p className="text-sm text-destructive">
                                            {errors.address}
                                        </p>
                                    )}
                                </div>

                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="emergency_contact">
                                            Emergency Contact
                                        </Label>
                                        <Input
                                            id="emergency_contact"
                                            value={data.emergency_contact}
                                            onChange={(e) =>
                                                setData(
                                                    'emergency_contact',
                                                    e.target.value,
                                                )
                                            }
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="emergency_contact_phone">
                                            Emergency Phone
                                        </Label>
                                        <Input
                                            id="emergency_contact_phone"
                                            value={data.emergency_contact_phone}
                                            onChange={(e) =>
                                                setData(
                                                    'emergency_contact_phone',
                                                    e.target.value,
                                                )
                                            }
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <Button type="submit" disabled={processing}>
                                        {processing
                                            ? 'Saving...'
                                            : 'Save Changes'}
                                    </Button>
                                    <Button
                                        asChild
                                        variant="outline"
                                        type="button"
                                    >
                                        <Link href="/my-profile">Cancel</Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </form>

                    {/* Change Password */}
                    <form onSubmit={handlePasswordSubmit}>
                        <Card>
                            <CardHeader>
                                <CardTitle>Change Password</CardTitle>
                                <CardDescription>
                                    Update your account password
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="current_password">
                                        Current Password *
                                    </Label>
                                    <Input
                                        id="current_password"
                                        type="password"
                                        value={passwordData.current_password}
                                        onChange={(e) =>
                                            setPasswordData(
                                                'current_password',
                                                e.target.value,
                                            )
                                        }
                                    />
                                    {passwordErrors.current_password && (
                                        <p className="text-sm text-destructive">
                                            {passwordErrors.current_password}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="password">
                                        New Password *
                                    </Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        value={passwordData.password}
                                        onChange={(e) =>
                                            setPasswordData(
                                                'password',
                                                e.target.value,
                                            )
                                        }
                                    />
                                    {passwordErrors.password && (
                                        <p className="text-sm text-destructive">
                                            {passwordErrors.password}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="password_confirmation">
                                        Confirm New Password *
                                    </Label>
                                    <Input
                                        id="password_confirmation"
                                        type="password"
                                        value={
                                            passwordData.password_confirmation
                                        }
                                        onChange={(e) =>
                                            setPasswordData(
                                                'password_confirmation',
                                                e.target.value,
                                            )
                                        }
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    disabled={processingPassword}
                                >
                                    {processingPassword
                                        ? 'Changing...'
                                        : 'Change Password'}
                                </Button>
                            </CardContent>
                        </Card>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
