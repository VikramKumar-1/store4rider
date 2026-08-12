import { RegisterForm } from "@/modules/auth/components/RegisterForm";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 glass p-8 rounded-2xl">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-black text-zinc-900 dark:text-white">
            Create an account
          </h2>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Or{' '}
            <Link href="/login" className="font-medium text-brand hover:text-brand-light transition-colors">
              sign in to your existing account
            </Link>
          </p>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
}
