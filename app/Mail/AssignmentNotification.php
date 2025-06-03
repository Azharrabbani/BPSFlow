<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class AssignmentNotification extends Mailable
{
    use Queueable, SerializesModels;

    public $workspace;
    public $assignment;
    public $files;
    public $user;
    public $member;

    /**
     * Create a new message instance.
     */
    public function __construct($workspace, $assignment, $files, $user, $member)
    {
        $this->workspace = $workspace;
        $this->assignment = $assignment;
        $this->files = $files;
        $this->member = $member;
        $this->user = $user;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Assignment Notification',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            markdown: 'mail.assignment-notification',
            with: [
                'workspace' => $this->workspace,
                'assignment' => $this->assignment,
                'files' => $this->files,
                'member' => $this->member,
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
