'use client';

import { useEffect, useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Check } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import BrandLogo from '@/components/BrandLogo';
import useAuth from '@/hooks/useAuth';

const SocialButtons = () => (
  <div className="grid grid-cols-3 gap-3">
    <button
      type="button"
      className="group flex items-center justify-center gap-2 rounded-xl border border-gray-200 py-2.5 transition-all duration-200 hover:border-gray-300 hover:bg-gray-50"
    >
      <svg className="h-4 w-4" viewBox="0 0 24 24">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
      </svg>
      <span className="hidden text-xs font-medium text-gray-600 sm:inline">Google</span>
    </button>
    <button
      type="button"
      className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 py-2.5 transition-all duration-200 hover:border-gray-300 hover:bg-gray-50"
    >
      <svg className="h-4 w-4" fill="#1877F2" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
      <span className="hidden text-xs font-medium text-gray-600 sm:inline">Facebook</span>
    </button>
    <button
      type="button"
      className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 py-2.5 transition-all duration-200 hover:border-gray-300 hover:bg-gray-50"
    >
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
      </svg>
      <span className="hidden text-xs font-medium text-gray-600 sm:inline">Apple</span>
    </button>
  </div>
);

export default function LoginPage() {
  const router = useRouter();
  const { login, user, isLoading } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [redirectTo, setRedirectTo] = useState(null);

  const redirectTarget = redirectTo || '/';

  useEffect(() => {
    setRedirectTo(new URLSearchParams(window.location.search).get('next') || '/');
  }, []);

  useEffect(() => {
    if (redirectTo && !isLoading && user) {
      router.replace(redirectTo);
    }
  }, [isLoading, redirectTo, router, user]);

  async function handleSubmit(event) {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    try {
      await toast.promise(
        login({
          email,
          password,
          rememberMe,
        }),
        {
          loading: 'Signing you in...',
          success: 'Welcome back.',
          error: (error) => error.message,
        }
      );

      router.replace(redirectTarget);
      router.refresh();
    } catch (error) {
      void error;
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex">
      <div className="relative hidden overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 p-12 lg:flex lg:w-[45%] lg:flex-col lg:justify-between">
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute left-0 top-0 h-full w-full"
            style={{
              backgroundImage: 'radial-gradient(circle at 25px 25px, rgba(255,255,255,0.2) 2px, transparent 0)',
              backgroundSize: '50px 50px',
            }}
          />
        </div>
        <div className="absolute -left-20 top-1/4 h-72 w-72 rounded-full bg-blue-500 opacity-20 blur-[120px]" />
        <div className="absolute bottom-1/4 right-0 h-64 w-64 rounded-full bg-indigo-600 opacity-20 blur-[100px]" />

        <div className="relative z-10">
          <BrandLogo size="md" className="brightness-0 invert" />
        </div>

        <div className="relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
            <span className="text-xs font-medium tracking-wide text-white/80">Trusted by 2M+ buyers</span>
          </div>
          <h2 className="text-4xl font-bold leading-tight text-white">
            Your global
            <br />
            marketplace
            <br />
            <span className="text-blue-400">awaits you.</span>
          </h2>
          <p className="max-w-xs text-sm leading-relaxed text-white/50">
            Connect with verified suppliers, discover exclusive deals, and grow your business worldwide.
          </p>
        </div>

        <div className="relative z-10 space-y-3 rounded-2xl border border-white/10 bg-white/5 p-5">
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, index) => (
              <svg key={index} className="h-3.5 w-3.5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <p className="text-sm italic leading-relaxed text-white/70">
            &ldquo;Found suppliers I never would have discovered otherwise. Our procurement costs dropped 30% in the first quarter.&rdquo;
          </p>
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 text-xs font-bold text-white">
              SK
            </div>
            <div>
              <p className="text-xs font-semibold text-white">Sarah K.</p>
              <p className="text-xs text-white/40">Procurement Manager, Berlin</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center bg-gray-50 px-6 py-12">
        <div className="w-full max-w-[420px] space-y-8">
          <div className="lg:hidden">
            <BrandLogo size="md" />
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">Welcome back</h1>
            <p className="text-sm text-gray-500">Sign in to continue to your account</p>
          </div>

          <div className="space-y-5 rounded-2xl border border-gray-100 bg-white p-7 shadow-sm shadow-gray-100">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">Email</label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-3 pl-10 pr-4 text-sm text-gray-800 placeholder-gray-300 transition-all focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">Password</label>
                  <a href="#" className="text-xs font-medium text-blue-500 transition-colors hover:text-blue-600">
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Enter your password"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-3 pl-10 pr-10 text-sm text-gray-800 placeholder-gray-300 transition-all focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <label className="flex cursor-pointer items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setRememberMe((current) => !current)}
                  className={`flex h-4 w-4 items-center justify-center rounded-[4px] border-2 transition-all duration-150 ${
                    rememberMe ? 'border-blue-500 bg-blue-500' : 'border-gray-300 bg-white'
                  }`}
                >
                  {rememberMe && <Check size={10} className="text-white" strokeWidth={3} />}
                </button>
                <span className="text-sm text-gray-600">Keep me signed in</span>
              </label>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-500 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-600 hover:shadow-blue-500/40 active:bg-blue-700 disabled:translate-y-0 disabled:cursor-not-allowed disabled:bg-blue-400 disabled:shadow-none"
              >
                <span>{isSubmitting ? 'Signing In...' : 'Sign In'}</span>
                <ArrowRight size={15} />
              </button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-100" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-3 text-xs uppercase tracking-widest text-gray-400">or</span>
              </div>
            </div>

            <SocialButtons />
          </div>

          <p className="text-center text-sm text-gray-500">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="font-semibold text-blue-500 transition-colors hover:text-blue-600">
              Create one free
            </Link>
          </p>

          <div className="flex items-center justify-center gap-5 pt-2">
            {[
              { icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10', label: 'SSL Secured' },
              { icon: 'M22 11.08V12a10 10 0 1 1-5.93-9.14M9 11l3 3L22 4', label: 'Verified' },
            ].map(({ icon, label }) => (
              <div key={label} className="flex items-center gap-1.5 text-gray-400">
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d={icon} />
                </svg>
                <span className="text-xs">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
