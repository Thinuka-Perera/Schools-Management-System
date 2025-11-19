import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { router, usePage } from '@inertiajs/react';
import React, { useState } from 'react';

interface Course {
    course_id: number;
    tenant_id: number;
    course_name: string;
    teacher_id: number;
}

interface Teacher {
    teacher_id: number;
    tenant_id: number;
    first_name: string;
    last_name: string;
}

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Courses', href: '/courses' }];

const emptyForm = { course_name: '', teacher_id: '' };
type FormState = typeof emptyForm & { id?: number };

export default function CourseIndex() {
    const { courses, teachers } = usePage<{
        courses?: Course[];
        teachers?: Teacher[];
    }>().props;

    const courseList = courses ?? [];
    const teacherList = teachers ?? [];

    const [open, setOpen] = useState(false);
    const [form, setForm] = useState<FormState>(emptyForm);
    const [isEdit, setIsEdit] = useState(false);

    const handleOpenAdd = () => {
        setForm(emptyForm);
        setIsEdit(false);
        setOpen(true);
    };

    const handleOpenEdit = (course: Course) => {
        setForm({
            id: course.course_id,
            course_name: course.course_name,
            teacher_id: String(course.teacher_id),
        });
        setIsEdit(true);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setForm(emptyForm);
        setIsEdit(false);
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    ) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const payload = {
            course_name: form.course_name,
            teacher_id: Number(form.teacher_id),
        };

        if (isEdit && form.id) {
            router.put(`/courses/${form.id}`, payload, {
                onSuccess: handleClose,
            });
        } else {
            router.post('/courses', payload, {
                onSuccess: handleClose,
            });
        }
    };

    const handleDelete = (id: number) => {
        if (window.confirm('Are you sure you want to delete this course?')) {
            router.delete(`/courses/${id}`);
        }
    };

    const teacherName = (teacher_id: number) => {
        const t = teacherList.find((x) => x.teacher_id === teacher_id);
        return t ? `${t.first_name} ${t.last_name}` : '—';
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Card className="mt-6 p-6">
                <div className="mb-4 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Courses</h1>
                    <Button onClick={handleOpenAdd}>Add Course</Button>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full rounded-lg border text-sm">
                        <thead className="bg-gray-100 dark:bg-neutral-800">
                            <tr>
                                <th className="px-4 py-2 text-left font-semibold">
                                    ID
                                </th>
                                <th className="px-4 py-2 text-left font-semibold">
                                    Course Name
                                </th>
                                <th className="px-4 py-2 text-left font-semibold">
                                    Teacher
                                </th>
                                <th className="px-4 py-2 text-left font-semibold">
                                    Actions
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {courseList.map((course) => (
                                <tr
                                    key={course.course_id}
                                    className="border-b last:border-0 hover:bg-gray-50 dark:hover:bg-neutral-700"
                                >
                                    <td className="px-4 py-2">
                                        {course.course_id}
                                    </td>
                                    <td className="px-4 py-2">
                                        {course.course_name}
                                    </td>
                                    <td className="px-4 py-2">
                                        {teacherName(course.teacher_id)}
                                    </td>
                                    <td className="flex gap-2 px-4 py-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() =>
                                                handleOpenEdit(course)
                                            }
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="destructive"
                                            onClick={() =>
                                                handleDelete(course.course_id)
                                            }
                                        >
                                            Delete
                                        </Button>
                                    </td>
                                </tr>
                            ))}

                            {courseList.length === 0 && (
                                <tr>
                                    <td
                                        className="px-4 py-4 text-center"
                                        colSpan={4}
                                    >
                                        No courses found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Dialog Form */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {isEdit ? 'Update Course' : 'Add Course'}
                        </DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                        <div>
                            <Label htmlFor="course_name">Course Name</Label>
                            <Input
                                id="course_name"
                                name="course_name"
                                value={form.course_name}
                                onChange={handleChange}
                                required
                                placeholder="Enter course name"
                            />
                        </div>

                        <div>
                            <Label htmlFor="teacher_id">Teacher</Label>
                            <select
                                id="teacher_id"
                                name="teacher_id"
                                value={form.teacher_id}
                                onChange={handleChange}
                                className="block w-full rounded-md border px-3 py-2"
                                required
                            >
                                <option value="">Select a teacher</option>
                                {teacherList.map((t) => (
                                    <option
                                        key={t.teacher_id}
                                        value={String(t.teacher_id)}
                                    >
                                        {t.first_name} {t.last_name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex justify-end gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleClose}
                            >
                                Cancel
                            </Button>
                            <Button type="submit">
                                {isEdit ? 'Update' : 'Add'}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
