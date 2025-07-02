<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class AssignNotification extends Mailable
{
    use Queueable, SerializesModels;

    public $workspace;
    public $assignment;
    public $task;
    public $project;
    public $space;
    public $user;

    /**
     * Create a new message instance.
     */
    public function __construct($workspace, $assignment, $task, $project, $space, $user)
    {
        $this->workspace = $workspace;
        $this->assignment = $assignment;
        $this->task = $task;
        $this->project = $project;
        $this->space = $space;
        $this->user = $user;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Assign Notification',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            markdown:'mail.assign-notification',
            with: [
                'workspace' => $this->workspace,
                'assignment' => $this->assignment,
                'task' => $this->task,
                'project' => $this->project,
                'space' => $this->space,
                'user' => $this->user
            ]
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
