<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Models\Teacher;
use Illuminate\Support\Facades\Redirect;

class TeacherController extends Controller
{
    public function index()
    {
        $tenantId = Auth::user()->tenant_id;
        $teachers = Teacher::where('tenant_id', $tenantId)->get();

        return Inertia::render('teacher/index', [
            'tenant_id' => $tenantId,
            'teachers' => $teachers,
        ]);
    }

    public function store(Request $request)
    {
        // Validate the incoming request
        $validated = $request->validate([
            'first_name' => 'required|string|max:50',
            'last_name' => 'required|string|max:50',
            'subject' => 'required|string|max:50',
        ]);

        // Add the tenant_id of the logged-in user
        $validated['tenant_id'] = Auth::user()->tenant_id;

        // Create a new teacher record
        Teacher::create($validated);

        // Redirect to the teachers index page
        return Redirect::route('teachers.index');
    }

    public function update(Request $request, $id)
    {
        // Validate the incoming request
        $validated = $request->validate([
            'first_name' => 'required|string|max:50',
            'last_name' => 'required|string|max:50',
            'subject' => 'required|string|max:50',
        ]);

        // Find the teacher that belongs to the logged-in user's tenant
        $teacher = Teacher::where('tenant_id', Auth::user()->tenant_id)->findOrFail($id);

        // Update the teacher with validated data
        $teacher->update($validated);

        // Redirect back to the teachers index page
        return Redirect::route('teachers.index');
    }


    public function destroy($id)
    {
        // Find the teacher that belongs to the logged-in user's tenant
        $teacher = Teacher::where('tenant_id', Auth::user()->tenant_id)->findOrFail($id);

        // Delete the teacher
        $teacher->delete();

        // Redirect back to the teachers index page
        return Redirect::route('teachers.index');
    }

}