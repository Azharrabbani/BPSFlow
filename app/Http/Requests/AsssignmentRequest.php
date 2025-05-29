<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AsssignmentRequest extends FormRequest
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
            'task_id' => ['required', 'integer'],
            'space_member_id' => ['nullable', 'integer', 'max: 255'],
            'name' => ['required', 'string'],
            'priority' => ['nullable', 'string'],
            'status' => ['required', 'string'],
            'due_date' => ['nullable', 'date']
        ];
    }
}
