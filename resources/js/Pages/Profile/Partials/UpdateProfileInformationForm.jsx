import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = '',
}) {
    const user = usePage().props.auth.user;

    const { data, setData, post, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            email: user.email,
            jabatan: user.jabatan,
            no_pegawai: user.no_pegawai,
            photo: user.photo,
            oldProfile: user.photo
        });
        
        const handleFileChange = (e) => {
            setData('photo', e.target.files[0]); 
        };

        const submit = (e) => {
            e.preventDefault();
            console.log(data)
            post(route('profile.update'));
        };

    

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-gray-900">
                    Profile Information
                </h2>

                <p className="mt-1 text-sm text-gray-600">
                    Informasi personal anda dan pengaturan akun
                </p>
            </header>


            <form onSubmit={submit} className="mt-6 space-y-6" enctype="multipart/form-data">
                <div>
                    <InputLabel htmlFor="photo" value="Photo" />
                    <img src={
                        data.photo instanceof File 
                        ? URL.createObjectURL(data.photo) 
                        : data.photo 
                            ? `/storage/${data.photo}` 
                            : 'https://cdn-icons-png.flaticon.com/512/9815/9815472.png'
                    }  alt="Profile" width="150" className='my-5 rounded-full'/> 

                    <input type="hidden" name="oldProfile" value={data.oldProfile} />

                    <label type="button" className="button rounded-lg">
                      <span className="button__text text-md">Add Photo</span>
                      <input
                        id="photo"
                        type="file"
                        
                        onChange={handleFileChange}
                        className="input_file mt-1 block w-full"
                        />
                      <span className="button__icon rounded-lg"><svg xmlns="http://www.w3.org/2000/svg" width="24" viewBox="0 0 24 24" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" stroke="currentColor" height="24" fill="none" class="svg"><line y2="19" y1="5" x2="12" x1="12"></line><line y2="12" y1="12" x2="19" x1="5"></line></svg></span>
                    </label>
                   

                    <InputError className="mt-2" message={errors.photo} />
                </div>


                <div>
                    <InputLabel htmlFor="name" value="Name" />

                    <TextInput
                        id="name"
                        className="mt-1 block w-full"
                        value={data.name ?? ""}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                        isFocused
                       
                    />

                    <InputError className="mt-2" message={errors.name} />
                </div>

                <div>
                    <InputLabel htmlFor="email" value="Email" />

                    <TextInput
                        type="email"
                        className="mt-1 block w-full"
                        value={data.email ?? ""}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        readOnly
                    />

                    <InputError className="mt-2" message={errors.email} />
                </div>

                <div>
                    <InputLabel htmlFor="jabatan" value="Jabatan" />

                    <TextInput
                        id="jabatan"
                        type="text"
                        className="mt-1 block w-full"
                        value={data.jabatan ? data.jabatan : ""}
                        onChange={(e) => setData('jabatan', e.target.value)}
                       
                    />

                    <InputError className="mt-2" message={errors.jabatan} />
                </div>

                <div>
                    <InputLabel htmlFor="no_pegawai" value="Nomor Pegawai" />

                    <TextInput
                        type="text"
                        className="mt-1 block w-full"
                        value={data.no_pegawai ? data.no_pegawai : ""}
                        onChange={(e) => setData('no_pegawai', e.target.value)}
                       
                    />

                    <InputError className="mt-2" message={errors.no_pegawai} />
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div>
                        <p className="mt-2 text-sm text-gray-800">
                            Your email address is unverified.
                            <Link
                                href={route('verification.send')}
                                method="post"
                                as="button"
                                className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                                Click here to re-send the verification email.
                            </Link>
                        </p>

                        {status === 'verification-link-sent' && (
                            <div className="mt-2 text-sm font-medium text-green-600">
                                A new verification link has been sent to your
                                email address.
                            </div>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={processing}>Save</PrimaryButton>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-gray-600">
                            Saved.
                        </p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
