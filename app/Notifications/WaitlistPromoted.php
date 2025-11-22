<?php

declare(strict_types=1);

namespace App\Notifications;

use App\Models\Booking;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class WaitlistPromoted extends Notification
{
    use Queueable;

    public function __construct(
        public Booking $booking
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
        
        return (new MailMessage)
            ->subject('Spot Available - Booking Confirmed!')
            ->greeting("Hello {$notifiable->full_name}!")
            ->line("Great news! A spot has become available for {$lesson->title}.")
            ->line("Your booking has been automatically confirmed.")
            ->line("Date: {$lesson->start_datetime->format('l, F j, Y')}")
            ->line("Time: {$lesson->start_datetime->format('H:i')} - {$lesson->end_datetime->format('H:i')}")
            ->line("Location: {$lesson->location}")
            ->line("Credits charged: {$this->booking->credits_charged}")
            ->action('View Booking', url('/bookings'))
            ->line('See you at the class!');
    }
}
