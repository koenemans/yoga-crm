<?php

declare(strict_types=1);

namespace App\Notifications;

use App\Models\Lesson;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class LessonCancelled extends Notification
{
    use Queueable;

    public function __construct(
        public Lesson $lesson
    ) {}

    /**
     * Get the notification's delivery channels.
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Lesson Cancelled')
            ->greeting("Hello {$notifiable->full_name}!")
            ->line("We regret to inform you that the following lesson has been cancelled:")
            ->line("Lesson: {$this->lesson->title}")
            ->line("Date: {$this->lesson->start_datetime->format('l, F j, Y')}")
            ->line("Time: {$this->lesson->start_datetime->format('H:i')} - {$this->lesson->end_datetime->format('H:i')}")
            ->line("Your credits have been refunded to your account.")
            ->action('View Schedule', url('/lessons'))
            ->line('We apologize for any inconvenience.');
    }
}
