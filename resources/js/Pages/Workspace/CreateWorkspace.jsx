import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm, usePage } from '@inertiajs/react';



export default function CreateWorkspace() {
    const user = usePage().props.auth.user;
    
    const {data, setData, post, get, delete:destroy, errors, clearErrors, processing, recentlySuccessful} = useForm({
        name: '',
        role: 'member',
        user_id: user.id,
        space_id: '',
        project_id: '',
        workspace_id: '',
        status: 'public',
        members: [],
    });

    const addWorkspace  = (e) => {
        e.preventDefault();

        post(route('workspace.store'), {
            onSuccess: () => {
                data.name = '';
            },

            onError: () => {
                console.log('Gagal', errors.name);
            },

            onFinish: () => {
                console.log('selesai');
            }
        });
    }

    return (
        <div className="createWorkspace">
            <Head title="Create Workspace"/>
            
            <div className="flex items-center justify-center min-h-screen">
              <form onSubmit={addWorkspace}>
                <div className="bg-white p-10 rounded-lg shadow-md w-full max-w-md">
                  <h1 className="text-2xl font-semibold mb-4">
                    Ayo kita buat workspace pertama kamu 😊
                  </h1>
                  <p className="text-gray-600 mb-6">
                    Silakan masukkan nama workspace yang kamu inginkan
                  </p>
                  
                  <div className="flex flex-col">
                    <TextInput 
                      placeHolder="Ex: BPSFlow" 
                      onChange={(e) =>  setData('name', e.target.value)} 
                      className="w-full"
                    />
                    {errors.name && <p className="error text-red-500">{errors.name}</p>}
                  </div>

              
                  <PrimaryButton className="w-full flex justify-center mt-5">
                    Save
                  </PrimaryButton>
                </div>
              </form>
            </div>

        </div>
    )
}