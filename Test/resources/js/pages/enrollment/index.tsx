import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { router, usePage } from '@inertiajs/react';
import { useState } from 'react';

interface Enrollment {
    enrollment_id: number;
    tenant_id: number;
    student_id: number;
    course_id: number;
    enrollment_date: string;
}

interface Student {
    student_id: number;
    tenant_id: number;
    first_name: string;
    last_name: string;
}

interface Course {
    course_id: number;
    tenant_id: number;
    course_name: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Enrollments', href: '/enrollments' },
];

const emptyForm = { student_id: '', course_id: '', enrollment_date: '' };
type FormState = typeof emptyForm & { id?: number };

export default function EnrollmentIndex() {
    const { enrollments, students, courses } = usePage<{
        enrollments?: Enrollment[];
        students?: Student[];
        courses?: Course[];
    }>().props;

    const enrollmentList: Enrollment[] = enrollments ?? [];
    const studentList: Student[] = students ?? [];
    const courseList: Course[] = courses ?? [];

    const [open, setOpen] = useState(false);
    const [form, setForm] = useState<FormState>(emptyForm);
    const [isEdit, setIsEdit] = useState(false);
    const [errors, setErrors] = useState<string | null>(null);

    const handleOpenAdd = () => {
        setForm(emptyForm);
        setIsEdit(false);
        setErrors(null);
        setOpen(true);
    };

    const handleOpenEdit = (enrollment: Enrollment) => {
        setForm({
            id: enrollment.enrollment_id,
            student_id: String(enrollment.student_id),
            course_id: String(enrollment.course_id),
            enrollment_date: enrollment.enrollment_date,
        });
        setIsEdit(true);
        setErrors(null);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setForm(emptyForm);
        setIsEdit(false);
        setErrors(null);
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
            student_id: Number(form.student_id),
            course_id: Number(form.course_id),
            enrollment_date: form.enrollment_date,
        };

        setErrors(null);

        if (isEdit && form.id) {
            router.put(`/enrollments/${form.id}`, payload, {
                onSuccess: handleClose,
                onError: (err) =>
                    setErrors(
                        'Failed to update enrollment. Please check your input.',
                    ),
            });
        } else {
            router.post('/enrollments', payload, {
                onSuccess: handleClose,
                onError: (err) =>
                    setErrors(
                        'Failed to add enrollment. Please check your input.',
                    ),
            });
        }
    };

    const handleDelete = (id: number) => {
        if (
            window.confirm('Are you sure you want to delete this enrollment?')
        ) {
            router.delete(`/enrollments/${id}`, {
                onError: () =>
                    setErrors('Failed to delete enrollment. Please try again.'),
            });
        }
    };

    // Helper functions
    const getStudentName = (id: number) => {
        const student = studentList.find((s) => s.student_id === id);
        return student ? `${student.first_name} ${student.last_name}` : '—';
    };

    const getCourseName = (id: number) => {
        const course = courseList.find((c) => c.course_id === id);
        return course ? course.course_name : '—';
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Card className="mt-6 p-6">
                <div className="mb-4 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Enrollments</h1>
                    <Button onClick={handleOpenAdd}>Add Enrollment</Button>
                </div>

                {errors && (
                    <div className="mb-4 font-medium text-red-600">
                        {errors}
                    </div>
                )}

                <div className="overflow-x-auto">
                    <table className="min-w-full rounded-lg border text-sm">
                        <thead className="bg-gray-100 dark:bg-neutral-800">
                            <tr>
                                <th className="px-4 py-2 text-left font-semibold">
                                    ID
                                </th>
                                <th className="px-4 py-2 text-left font-semibold">
                                    Student
                                </th>
                                <th className="px-4 py-2 text-left font-semibold">
                                    Course
                                </th>
                                <th className="px-4 py-2 text-left font-semibold">
                                    Enrollment Date
                                </th>
                                <th className="px-4 py-2 text-left font-semibold">
                                    Actions
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {enrollmentList.map((enrollment) => (
                                <tr
                                    key={enrollment.enrollment_id}
                                    className="border-b last:border-0 hover:bg-gray-50 dark:hover:bg-neutral-700"
                                >
                                    <td className="px-4 py-2">
                                        {enrollment.enrollment_id}
                                    </td>
                                    <td className="px-4 py-2">
                                        {getStudentName(enrollment.student_id)}
                                    </td>
                                    <td className="px-4 py-2">
                                        {getCourseName(enrollment.course_id)}
                                    </td>
                                    <td className="px-4 py-2">
                                        {enrollment.enrollment_date}
                                    </td>
                                    <td className="flex gap-2 px-4 py-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() =>
                                                handleOpenEdit(enrollment)
                                            }
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="destructive"
                                            onClick={() =>
                                                handleDelete(
                                                    enrollment.enrollment_id,
                                                )
                                            }
                                        >
                                            Delete
                                        </Button>
                                    </td>
                                </tr>
                            ))}

                            {enrollmentList.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="px-4 py-4 text-center"
                                    >
                                        No enrollments found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {isEdit ? 'Update Enrollment' : 'Add Enrollment'}
                        </DialogTitle>
                        <DialogDescription>
                            {isEdit
                                ? 'Update the selected enrollment details.'
                                : 'Fill out the form to add a new enrollment.'}
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                        <div>
                            <Label htmlFor="student_id">Student</Label>
                            <select
                                id="student_id"
                                name="student_id"
                                value={form.student_id}
                                onChange={handleChange}
                                className="block w-full rounded-md border px-3 py-2"
                                required
                            >
                                <option value="">Select a student</option>
                                {studentList.map((s) => (
                                    <option
                                        key={s.student_id}
                                        value={String(s.student_id)}
                                    >
                                        {s.first_name} {s.last_name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <Label htmlFor="course_id">Course</Label>
                            <select
                                id="course_id"
                                name="course_id"
                                value={form.course_id}
                                onChange={handleChange}
                                className="block w-full rounded-md border px-3 py-2"
                                required
                            >
                                <option value="">Select a course</option>
                                {courseList.map((c) => (
                                    <option
                                        key={c.course_id}
                                        value={String(c.course_id)}
                                    >
                                        {c.course_name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <Label htmlFor="enrollment_date">
                                Enrollment Date
                            </Label>
                            <Input
                                type="date"
                                id="enrollment_date"
                                name="enrollment_date"
                                value={form.enrollment_date}
                                onChange={handleChange}
                                required
                            />
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
