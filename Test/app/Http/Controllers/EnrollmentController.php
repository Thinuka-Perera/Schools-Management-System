<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Models\Enrollment;
use App\Models\Student;
use App\Models\Course;
use Illuminate\Support\Facades\Redirect;

class EnrollmentController extends Controller
{
    // Display all enrollments
    public function index()
    {
        $tenantId = Auth::user()->tenant_id;

        $enrollments = Enrollment::where('tenant_id', $tenantId)->get();

        $students = Student::where('tenant_id', $tenantId)
            ->get(['student_id', 'first_name', 'last_name']);

        $courses = Course::where('tenant_id', $tenantId)
            ->get(['course_id', 'course_name']);

        return Inertia::render('enrollment/index', [
            'tenant_id'   => $tenantId,
            'enrollments' => $enrollments,
            'students'    => $students,
            'courses'     => $courses,
        ]);
    }

    // Store a new enrollment
    public function store(Request $request)
    {
        $validated = $request->validate([
            'student_id'      => 'required|integer',
            'course_id'       => 'required|integer',
            'enrollment_date' => 'required|date',
        ]);

        $validated['tenant_id'] = Auth::user()->tenant_id;

        Enrollment::create($validated);

        return Redirect::route('enrollments.index');
    }

    // Update an existing enrollment
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'student_id'      => 'required|integer',
            'course_id'       => 'required|integer',
            'enrollment_date' => 'required|date',
        ]);

        $enrollment = Enrollment::where('tenant_id', Auth::user()->tenant_id)
            ->where('enrollment_id', $id)
            ->firstOrFail();

        $enrollment->update($validated);

        return Redirect::route('enrollments.index');
    }

    // Delete an enrollment
    public function destroy($id)
    {
        $enrollment = Enrollment::where('tenant_id', Auth::user()->tenant_id)
            ->where('enrollment_id', $id)
            ->firstOrFail();

        $enrollment->delete();

        return Redirect::route('enrollments.index');
    }
}
