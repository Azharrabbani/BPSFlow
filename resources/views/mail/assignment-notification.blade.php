<x-mail::message>
     Hai {{ $member }}!

    {{ $user->name }} baru saja mengunggah file ke assignment: **{{ $assignment }}** di workspace **{{ $workspace }}**.

    file yang di upload : @foreach ($files as $file)<{{ $file }}>, @endforeach

    Silakan buka workspace Anda untuk melihat detailnya.

    Terima kasih.
</x-mail::message>