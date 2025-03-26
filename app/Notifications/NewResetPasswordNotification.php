<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NewResetPasswordNotification extends Notification
{
    public $token;

    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct($token)
    {
        $this->token = $token;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
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
        $resetUrl = url(route('password.reset', ['token' => $this->token, 'email' => $notifiable->email], false));
        
        return (new MailMessage)
        ->subject('Reset Password Anda')
        ->greeting('Halo ' . $notifiable->name . ',')
        ->line('Kami menerima permintaan untuk mereset password Anda.')
        ->action('Reset Password', $resetUrl)
        ->line('Jika Anda tidak meminta reset password, abaikan email ini.')
        ->salutation('Terima kasih, ' . config('app.name'));
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            //
        ];
    }
}
