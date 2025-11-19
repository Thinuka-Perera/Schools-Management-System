import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { 
    Users, 
    Book, 
    GraduationCap, 
    BookOpen, 
    ListChecks,
    TrendingUp,
    Calendar,
    Award,
    Activity
} from 'lucide-react';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from '@/components/ui/card';
import { useState, useEffect } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

const stats = [
    {
        label: 'Students',
        icon: Users,
        key: 'totalStudents',
        description: 'Total students enrolled',
        color: 'text-blue-500',
        bgGradient: 'from-blue-500 to-cyan-500',
    },
    {
        label: 'Courses',
        icon: Book,
        key: 'totalCourses',
        description: 'Active courses',
        color: 'text-green-500',
        bgGradient: 'from-green-500 to-emerald-500',
       
    },
    {
        label: 'Teachers',
        icon: GraduationCap,
        key: 'totalTeachers',
        description: 'Teaching staff',
        color: 'text-yellow-500',
        bgGradient: 'from-yellow-500 to-orange-500',
        
    },
    {
        label: 'Subjects',
        icon: BookOpen,
        key: 'totalSubjects',
        description: 'Available subjects',
        color: 'text-purple-500',
        bgGradient: 'from-purple-500 to-pink-500',
        
    },
    {
        label: 'Enrollments',
        icon: ListChecks,
        key: 'totalEnrollments',
        description: 'Total enrollments',
        color: 'text-rose-500',
        bgGradient: 'from-rose-500 to-red-500',
       
    },
];

const quickActions = [
    { 
        title: 'Add Student', 
        icon: Users, 
        href: '/students',
        color: 'bg-blue-500 hover:bg-blue-600',
    },
    { 
        title: 'Create Course', 
        icon: Book, 
        href: '/courses',
        color: 'bg-green-500 hover:bg-green-600',
    },
    { 
        title: 'Add Teacher', 
        icon: GraduationCap, 
        href: '/teachers',
        color: 'bg-yellow-500 hover:bg-yellow-600',
    },
    { 
        title: 'New Enrollment', 
        icon: ListChecks, 
        href: '/enrollments',
        color: 'bg-purple-500 hover:bg-purple-600',
    },
];

const recentActivity = [
    { action: 'New student enrolled', time: '2 mins ago', icon: Users },
    { action: 'Course updated', time: '15 mins ago', icon: Book },
    { action: 'Teacher added', time: '1 hour ago', icon: GraduationCap },
    { action: 'Subject created', time: '2 hours ago', icon: BookOpen },
];

export default function Dashboard() {
    const pageProps = usePage().props as any;
    const [animatedStats, setAnimatedStats] = useState<Record<string, number>>({});
    const [currentTime, setCurrentTime] = useState(new Date());

    // Animate numbers on mount
    useEffect(() => {
        stats.forEach(({ key }) => {
            const target = pageProps[key] ?? 0;
            let current = 0;
            const increment = target / 50;
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                setAnimatedStats(prev => ({ ...prev, [key]: Math.floor(current) }));
            }, 20);
        });
    }, []);

    // Update time every minute
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true 
        });
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-US', { 
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-neutral-950 dark:via-slate-900 dark:to-slate-950">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    
                    {/* Header Section */}
                    <div className="mb-10">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div>
                                <h1 className="text-4xl md:text-5xl font-black mb-3 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient">
                                    Welcome Back! 👋
                                </h1>
                                <div className="flex items-center gap-3 text-lg text-slate-600 dark:text-slate-300">
                                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-slate-800 shadow-md border border-slate-200 dark:border-slate-700 font-semibold">
                                        <Award className="w-4 h-4 text-yellow-500" />
                                        {pageProps.schoolName || 'School Management'}
                                    </span>
                                </div>
                            </div>
                            
                            <div className="flex flex-col items-end gap-2">
                                <div className="flex items-center gap-2 text-3xl font-bold text-slate-700 dark:text-slate-200">
                                    <Calendar className="w-6 h-6 text-blue-500" />
                                    {formatTime(currentTime)}
                                </div>
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    {formatDate(currentTime)}
                                </p>
                            </div>
                        </div>
                        
                        <div className="mt-6 h-1.5 w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full shadow-lg"></div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
                        {stats.map(({ label, icon: Icon, key, description, color, bgGradient}, index) => (
                            <Card 
                                key={label} 
                                className="relative overflow-hidden group hover:shadow-2xl hover:scale-105 transition-all duration-300 border-0 bg-white dark:bg-slate-800"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                {/* Gradient Background */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${bgGradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                                
                                {/* Icon Background Circle */}
                                <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full bg-gradient-to-br ${bgGradient} opacity-10`}></div>
                                
                                <CardHeader className="pb-3 relative z-10">
                                    <div className="flex items-start justify-between">
                                        <div className={`p-3 rounded-xl bg-gradient-to-br ${bgGradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                            <Icon className="w-6 h-6 text-white" />
                                        </div>
                                       
                                    </div>
                                    <CardTitle className={`mt-4 text-lg font-bold ${color}`}>
                                        {label}
                                    </CardTitle>
                                    <CardDescription className="text-xs">
                                        {description}
                                    </CardDescription>
                                </CardHeader>
                                
                                <CardContent className="relative z-10">
                                    <p className="text-4xl font-black bg-gradient-to-br from-slate-700 to-slate-900 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                                        {animatedStats[key] ?? 0}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Quick Actions */}
                        <Card className="lg:col-span-2 border-0 shadow-xl bg-white dark:bg-slate-800">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-2xl">
                                    <Activity className="w-6 h-6 text-purple-500" />
                                    Quick Actions
                                </CardTitle>
                                <CardDescription>
                                    Access frequently used features
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {quickActions.map(({ title, icon: Icon, href, color }) => (
                                        <a
                                            key={title}
                                            href={href}
                                            className={`${color} text-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex flex-col items-center justify-center gap-3 group`}
                                        >
                                            <Icon className="w-8 h-8 group-hover:rotate-12 transition-transform duration-300" />
                                            <span className="text-sm font-semibold text-center">
                                                {title}
                                            </span>
                                        </a>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Recent Activity */}
                        <Card className="border-0 shadow-xl bg-white dark:bg-slate-800">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-2xl">
                                    <Activity className="w-6 h-6 text-blue-500" />
                                    Recent Activity
                                </CardTitle>
                                <CardDescription>
                                    Latest updates
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {recentActivity.map((activity, index) => (
                                        <div 
                                            key={index}
                                            className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors duration-200 group cursor-pointer"
                                        >
                                            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 group-hover:scale-110 transition-transform duration-300">
                                                <activity.icon className="w-4 h-4 text-white" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">
                                                    {activity.action}
                                                </p>
                                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                                    {activity.time}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes gradient {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                }
                .animate-gradient {
                    background-size: 200% auto;
                    animation: gradient 3s ease infinite;
                }
            `}</style>
        </AppLayout>
    );
}