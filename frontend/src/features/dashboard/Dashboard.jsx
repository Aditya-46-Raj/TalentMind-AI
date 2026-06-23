import { useAuthStore } from '../auth/authStore';
import { Button } from '@/components/ui/button';

export default function Dashboard() {
  const { user, logout } = useAuthStore();

  return (
    <div className="min-h-screen bg-zinc-50 p-8 dark:bg-zinc-950">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="flex items-center justify-between rounded-lg border bg-white p-6 shadow-sm dark:bg-zinc-900">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              Welcome to Dashboard
            </h1>
            <p className="mt-2 text-zinc-500 dark:text-zinc-400">
              Hello, {user?.name || 'User'}! You have successfully logged in.
            </p>
          </div>
          <Button variant="outline" onClick={logout}>
            Sign out
          </Button>
        </div>
      </div>
    </div>
  );
}
