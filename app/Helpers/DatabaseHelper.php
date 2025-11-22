<?php

declare(strict_types=1);

namespace App\Helpers;

class DatabaseHelper
{
    /**
     * Get database-agnostic date format expression.
     * 
     * @param string $column The column name to format
     * @param string $format The format type: 'day', 'week', 'month', 'year'
     * @return string The SQL expression for date formatting
     */
    public static function dateFormat(string $column, string $format): string
    {
        $driver = config('database.default');
        
        if ($driver === 'sqlite') {
            return match($format) {
                'day' => "strftime('%Y-%m-%d', {$column})",
                'week' => "strftime('%Y-%W', {$column})",
                'month' => "strftime('%Y-%m', {$column})",
                'year' => "strftime('%Y', {$column})",
                default => "strftime('%Y-%m-%d', {$column})",
            };
        }
        
        // MySQL/PostgreSQL
        return match($format) {
            'day' => "DATE_FORMAT({$column}, '%Y-%m-%d')",
            'week' => "DATE_FORMAT({$column}, '%Y-%u')",
            'month' => "DATE_FORMAT({$column}, '%Y-%m')",
            'year' => "DATE_FORMAT({$column}, '%Y')",
            default => "DATE_FORMAT({$column}, '%Y-%m-%d')",
        };
    }
}
