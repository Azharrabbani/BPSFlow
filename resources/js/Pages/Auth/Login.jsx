import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import GoogleButton  from '@/Components/GoogleButton';
import { Head, Link, useForm } from '@inertiajs/react';
import { useRoute } from '../../../../vendor/tightenco/ziggy';

export default function Login({ status, canResetPassword }) {
    const route = useRoute();

    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Log in" />

            {status && (
                <div className="mb-4 text-sm font-medium text-green-600">
                    {status}
                </div>
            )}

            <form onSubmit={submit}>
                <div>
                    <InputLabel htmlFor="email" value="Email" />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full"
                        autoComplete="username"
                        isFocused={true}
                        onChange={(e) => setData('email', e.target.value)}
                    />

                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="password" value="Password" />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full"
                        autoComplete="current-password"
                        onChange={(e) => setData('password', e.target.value)}
                    />

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="mt-4 flex justify-between">
                    <div>
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) =>
                                setData('remember', e.target.checked)
                            }
                        />
                        <span className="ms-2 text-sm text-gray-600">
                            Remember me
                        </span>
                    </div>

                    <div>
                    {canResetPassword && (
                        <Link
                            href={route('password.request')}
                            className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                            Forgot your password?
                        </Link>
                    )}
                    </div>
                    
                </div>

                <div className="mt-6 flex items-center justify-center">
                    

                    <PrimaryButton className="px-[100px] py-4 text-[15px]" disabled={processing}>
                        Log in
                    </PrimaryButton>
                </div>

                <div className='mt-6 text-center'>
                    <p>Tidak Punya Akun? <Link className='text-blue-600 hover:text-blue-300' href={route('register')}>Register</Link></p>
                </div>
                
                <div className='mt-4 text-center'>
                    <p>or</p>
                </div>

                <GoogleButton>
                    <a className='google-button' href={route('oauth.google')}>
                        Sign in with Google
                        <span class="google-icon">
                          <svg viewBox="0 0 48 48">
                            <title>Google Logo</title>
                            <clipPath id="g">
                              <path
                                d="M44.5 20H24v8.5h11.8C34.7 33.9 30.1 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22c11 0 21-8 21-22 0-1.3-.2-2.7-.5-4z"
                              ></path>
                            </clipPath>
                            <g clip-path="url(#g)" class="colors">
                              <path d="M0 37V11l17 13z" fill="#FBBC05"></path>
                              <path d="M0 11l17 13 7-6.1L48 14V0H0z" fill="#EA4335"></path>
                              <path d="M0 37l30-23 7.9 1L48 0v48H0z" fill="#34A853"></path>
                              <path d="M48 48L17 24l-4-3 35-10z" fill="#4285F4"></path>
                            </g>
                          </svg>
                        </span>
                    </a>
                </GoogleButton>
            </form>
        </GuestLayout>
    );
}
