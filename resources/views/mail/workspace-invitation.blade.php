<div>
    # Undangan Bergabung ke Workspace "{{ $workspace->name }}"

    <h1>Hai {{ $user->name }},</h1>
    
    <p>{{ $inviter }} mengundang Anda untuk bergabung ke workspace **"{{ $workspace->name }}"**.</p>
    
    <P>Klik tombol di bawah ini untuk menerima undangan dan mulai berkolaborasi bersama tim:</p>
    
        <a href="{{ route('invitation.accept', $workspace) }}">
            <button>Terima Undangan</button>
        </a>
    
    Jika Anda tidak mengenal undangan ini, Anda dapat mengabaikan email ini.
    
    Terima kasih,<br>
    {{ config('app.name') }}
</div>
