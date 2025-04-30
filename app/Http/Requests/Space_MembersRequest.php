<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class Space_MembersRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'user_id' => ['required', 'array'],
            'user_id.*.id' => ['required', 'integer', 'exists:users,id'],
            'space_id' => ['required', 'integer'],
        ];
    }
}
