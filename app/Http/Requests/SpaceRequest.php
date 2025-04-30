<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SpaceRequest extends FormRequest
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
            'workspace_id' => ['required', 'integer'],
            'name' => ['required', 'string', 'max: 255'],
            'status' => ['required', 'string'],
            'members' => ['nullable', 'array'],
            'members.*.id' => ['required', 'integer', 'exists:users,id'],
        ];
    }
}
