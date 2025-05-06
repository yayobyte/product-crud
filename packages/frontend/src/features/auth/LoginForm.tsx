import { useState, FormEvent } from 'react';
import type { LoginCredentials } from '../../types';
import { ErrorAlert } from '../../components/ui/ErrorAlert';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

export const LoginForm = () => {
  const [credentials, setCredentials] = useState<LoginCredentials>({
    username: '',
    password: '',
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      console.log('Login attempt with:', credentials);

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Temp validation - will be replaced with actual API call
      if (
        credentials.username === 'admin' &&
        credentials.password === 'password'
      ) {
        alert('Login successful!');
      } else {
        setError('Invalid username or password');
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : 'Login failed. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>

        {error && (
          <ErrorAlert message={error} onDismiss={() => setError(null)} />
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="-space-y-px rounded-md shadow-sm">
            <div>
              <Input
                id="username"
                name="username"
                type="text"
                required
                label="Username"
                placeholder="Username"
                value={credentials.username}
                onChange={handleChange}
                disabled={loading}
                className="rounded-t-md rounded-b-none"
              />
            </div>
            <div>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                label="Password"
                placeholder="Password"
                value={credentials.password}
                onChange={handleChange}
                disabled={loading}
                className="rounded-t-none rounded-b-md"
              />
            </div>
          </div>

          <div>
            <Button
              type="submit"
              fullWidth
              isLoading={loading}
              variant="primary"
              size="md"
            >
              Sign in
            </Button>
          </div>
        </form>

        <div className="text-sm text-center mt-4">
          <p className="text-gray-600">
            Demo credentials: username: <code>admin</code>, password:{' '}
            <code>password</code>
          </p>
        </div>
      </div>
    </div>
  );
};
