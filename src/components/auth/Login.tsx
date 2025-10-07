import type { FormEvent } from 'react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../common/AuthLayout';
import TextInput from '../common/TextInput';
import Button from '../common/Button';
import { useAuth } from '../../context/AuthContext';

const emailPattern = /\S+@\S+\.\S+/;

const Login: React.FC = () => {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [keepLoggedIn, setKeepLoggedIn] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationErrors: { email?: string; password?: string } = {};

    if (!emailPattern.test(email)) {
      validationErrors.email = 'Please enter a valid email address.';
    }

    if (password.trim().length < 6) {
      validationErrors.password = 'Password must be at least 6 characters.';
    }

    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    try {
      setFormError(null);
      await login({ email, password, keepLoggedIn });
      navigate('/dashboard');
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unable to log in. Please try again.';
      setFormError(message);
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      description="Sign in to access your personalized dashboard and team updates."
    >
      <form className="space-y-6" onSubmit={handleSubmit} noValidate>
        <TextInput
          label="Email address"
          name="email"
          type="email"
          autoComplete="email"
          required
          requiredMark
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            if (errors.email) {
              setErrors((prev) => ({ ...prev, email: undefined }));
            }
          }}
          errorMessage={errors.email}
        />

        <TextInput
          label="Password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          requiredMark
          value={password}
          onChange={(event) => {
            setPassword(event.target.value);
            if (errors.password) {
              setErrors((prev) => ({ ...prev, password: undefined }));
            }
          }}
          errorMessage={errors.password}
        />

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm text-slate-600" htmlFor="keep-logged-in">
            <input
              id="keep-logged-in"
              name="keep-logged-in"
              type="checkbox"
              className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              checked={keepLoggedIn}
              onChange={(event) => setKeepLoggedIn(event.target.checked)}
            />
            Keep me logged in
          </label>
          <Link to="/forgot" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">
            Forgot password?
          </Link>
        </div>

        {formError ? (
          <div
            className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            role="alert"
          >
            {formError}
          </div>
        ) : null}

        <Button type="submit" full disabled={loading}>
          {loading ? 'Signing in...' : 'Sign in'}
        </Button>
      </form>

      <div className="mt-8 flex items-center gap-4">
        <div className="h-px flex-1 bg-slate-200" />
        <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">Or</span>
        <div className="h-px flex-1 bg-slate-200" />
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {['Google', 'Facebook', 'GitHub'].map((provider) => (
          <Button key={provider} type="button" variant="secondary" full>
            Continue with {provider}
          </Button>
        ))}
      </div>

      <p className="mt-8 text-sm text-slate-600">
        Do not have an account yet?{' '}
        <Link to="/register" className="font-semibold text-indigo-600 hover:text-indigo-700">
          Sign up
        </Link>
      </p>
    </AuthLayout>
  );
};

export default Login;