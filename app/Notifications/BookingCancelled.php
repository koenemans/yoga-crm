<?php

declare(strict_types=1);

namespace App\Notifications;

use App\Models\Booking;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class BookingCancelled extends Notification
{
    use Queueable;

    public function __construct(
        public Booking $booking,
        public bool $refunded
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
        $lesson = $this->booking->lesson;
        
        $message = (new MailMessage)
            ->subject('Booking Cancelled')
            ->greeting("Hello {$notifiable->full_name}!")
            ->line("Your booking for {$lesson->title} has been cancelled.")
            ->line("Date: {$lesson->start_datetime->format('l, F j, Y')}")
            ->line("Time: {$lesson->start_datetime->format('H:i')} - {$lesson->end_datetime->format('H:i')}");

        if ($this->refunded) {
            $message->line("Credits refunded: {$this->booking->credits_charged}");
        } else {
            $message->line("No credits were refunded as the cancellation was made after the cutoff time.");
        }

        return $message->action('View Schedule', url('/lessons'));
    }
}
