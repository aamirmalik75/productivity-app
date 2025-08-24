<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class GoalNotification extends Notification
{
  use Queueable;

  /**
   * Create a new notification instance.
   *
   * @return void
   */

  protected $message, $user;
  public function __construct($user, $message)
  {
    $this->user = $user;
    $this->message = $message;
  }

  /**
   * Get the notification's delivery channels.
   *
   * @param  mixed  $notifiable
   * @return array
   */
  public function via($notifiable)
  {
    return ['database'];
  }

  /**
   * Get the mail representation of the notification.
   *
   * @param  mixed  $notifiable
   * @return \Illuminate\Notifications\Messages\MailMessage
   */

  /**
   * Get the array representation of the notification.
   *
   * @param  mixed  $notifiable
   * @return array
   */
  public function toArray($notifiable)
  {
    return [
      'greeting' => "Dear " . $this->user . "!",
      'message' => $this->message,
    ];
  }
}
