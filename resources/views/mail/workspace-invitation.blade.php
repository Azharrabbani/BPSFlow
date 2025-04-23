<div>
    # Undangan Bergabung ke Workspace "{{ $workspace->name }}"

    Hai {{ $user->name }},
    
    {{ $inviter }} mengundang Anda untuk bergabung ke workspace **"{{ $workspace->name }}"**.
    
    Klik tombol di bawah ini untuk menerima undangan dan mulai berkolaborasi bersama tim:
    
    <x-mail::button :url="url('/invite/' . $workspace->id)">
    Terima Undangan
    </x-mail::button>
    
    Jika Anda tidak mengenal undangan ini, Anda dapat mengabaikan email ini.
    
    Terima kasih,<br>
    {{ config('app.name') }}
</div>
