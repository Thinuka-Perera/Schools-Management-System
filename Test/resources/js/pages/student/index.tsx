import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { usePage, router } from '@inertiajs/react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';

interface Student {
    student_id: number;
    tenant_id: number;
    first_name: string;
    last_name: string;
    grade: number;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Students',
        href: '/students',
    },
];

const emptyForm = { first_name: '', last_name: '', grade: 0 };
type FormState = typeof emptyForm & { id?: number };

export default function StudentIndex() {
    const { students } = usePage<{ students?: Student[] }>().props;
    const studentList = students ?? [];

    const [open, setOpen] = useState(false);
    const [form, setForm] = useState<FormState>(emptyForm);
    const [isEdit, setIsEdit] = useState(false);

    const handleOpenAdd = () => {
        setForm(emptyForm);
        setIsEdit(false);
        setOpen(true);
    };

    const handleOpenEdit = (student: Student) => {
        setForm({
            id: student.student_id,
            first_name: student.first_name,
            last_name: student.last_name,
            grade: student.grade,
        });
        setIsEdit(true);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setForm(emptyForm);
        setIsEdit(false);
    };



    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEdit && form.id) {
            router.put(`/students/${form.id}`, { ...form, grade: Number(form.grade) }, { onSuccess: handleClose });
        } else {
            router.post('/students', { ...form, grade: Number(form.grade) }, { onSuccess: handleClose });
        }
    };


    const handleDelete = (id: number) => {
        if (window.confirm('Are you sure you want to delete this student?')) {
            router.delete(`/students/${id}`);
        }
    };



    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Card className="p-6 mt-6">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-2xl font-bold">Students</h1>
                    <Button onClick={handleOpenAdd}>Add Student</Button>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full border text-sm rounded-lg">
                        <thead className="bg-gray-100 dark:bg-neutral-800">
                            <tr>
                                <th className="px-4 py-2 text-left font-semibold">ID</th>
                                <th className="px-4 py-2 text-left font-semibold">First Name</th>
                                <th className="px-4 py-2 text-left font-semibold">Last Name</th>
                                <th className="px-4 py-2 text-left font-semibold">Grade</th>
                                <th className="px-4 py-2 text-left font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {studentList.map((student) => (
                                <tr key={student.student_id} className="border-b last:border-0 hover:bg-gray-50 dark:hover:bg-neutral-700">
                                    <td className="px-4 py-2">{student.student_id}</td>
                                    <td className="px-4 py-2">{student.first_name}</td>
                                    <td className="px-4 py-2">{student.last_name}</td>
                                    <td className="px-4 py-2">{student.grade}</td>
                                    <td className="px-4 py-2 flex gap-2">
                                        <Button size="sm" variant="outline" onClick={() => handleOpenEdit(student)}>Edit</Button>
                                        <Button size="sm" variant="destructive" onClick={() => handleDelete(student.student_id)}>Delete</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{isEdit ? 'Update Student' : 'Add Student'}</DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                        <div>
                            <Label htmlFor="first_name">First Name</Label>
                            <Input id="first_name" name="first_name" value={form.first_name} onChange={handleChange} required />
                        </div>
                        <div>
                            <Label htmlFor="last_name">Last Name</Label>
                            <Input id="last_name" name="last_name" value={form.last_name} onChange={handleChange} required />
                        </div>
                        <div>
                            <Label htmlFor="grade">Grade</Label>
                            <Input id="grade" name="grade" type="number" value={form.grade} onChange={handleChange} required />
                        </div>

                        <div className="flex justify-end gap-2">
                            <Button type="button" variant="outline" onClick={handleClose}>Cancel</Button>
                            <Button type="submit">{isEdit ? 'Update' : 'Add'}</Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );



}
