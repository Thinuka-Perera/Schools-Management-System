<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Models\Student;
use Illuminate\Support\Facades\Redirect;

class StudentController extends Controller
{
    public function index()
    {
        // Get the tenant_id of the currently authenticated user
        $tenantId = Auth::user()->tenant_id;

        // Fetch all students belonging to that tenant
        $students = Student::where('tenant_id', $tenantId)->get();

        // Pass the data to the Inertia view
        return Inertia::render('student/index', [
            'tenant_id' => $tenantId,
            'students' => $students,
        ]);
    }



    public function store(Request $request)
    {
        // Validate incoming request
        $validated = $request->validate([
            'first_name' => 'required|string|max:50',
            'last_name' => 'required|string|max:50',
            'grade' => 'required|integer',
        ]);

        // Add tenant_id of the logged-in user
        $validated['tenant_id'] = Auth::user()->tenant_id;

        // Create new student record
        Student::create($validated);

        // Redirect to the students index page
        return Redirect::route('students.index');
    }


    public function update(Request $request, $id)
    {
        // Validate incoming request
        $validated = $request->validate([
            'first_name' => 'required|string|max:50',
            'last_name' => 'required|string|max:50',
            'grade' => 'required|integer',
        ]);

        // Find the student belonging to the logged-in user's tenant
        $student = Student::where('tenant_id', Auth::user()->tenant_id)->findOrFail($id);

        // Update the student record
        $student->update($validated);

        // Redirect back to the students index page
        return Redirect::route('students.index');
    }


    public function destroy($id)
    {
        // Find the student that belongs to the logged-in user's tenant
        $student = Student::where('tenant_id', Auth::user()->tenant_id)->findOrFail($id);

        // Delete the student
        $student->delete();

        // Redirect back to the students index page
        return Redirect::route('students.index');
    }


}
