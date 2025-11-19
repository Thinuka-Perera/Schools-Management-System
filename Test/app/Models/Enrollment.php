<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Enrollment extends Model
{
    use HasFactory;

    public $timestamps = false;
    protected $primaryKey = 'enrollment_id';

    // Add student_id here and remove course_name if not stored in this table
    protected $fillable = [
        'tenant_id',
        'student_id',
        'course_id',
        'enrollment_date',
    ];
}
