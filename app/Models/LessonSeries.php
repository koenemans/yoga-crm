<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class LessonSeries extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'teacher_id',
        'location',
        'default_capacity',
        'default_credits_required',
        'weekday',
        'start_time',
        'end_time',
        'series_start_date',
        'series_end_date',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'series_start_date' => 'date',
            'series_end_date' => 'date',
            'is_active' => 'boolean',
        ];
    }

    /**
     * Get the teacher for this series.
     */
    public function teacher(): BelongsTo
    {
        return $this->belongsTo(User::class, 'teacher_id');
    }

    /**
     * Get lessons in this series.
     */
    public function lessons(): HasMany
    {
        return $this->hasMany(Lesson::class);
    }
}
