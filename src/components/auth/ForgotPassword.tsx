import type { FormEvent } from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from '../common/AuthLayout';
import TextInput from '../common/TextInput';
import Button from '../common/Button';
import { requestPasswordReset } from '../../lib/api';

const emailPattern = /\S+@\S+\.\S+/;

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setStatus(null);

    if (!emailPattern.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    try {
      setIsSubmitting(true);
      await requestPasswordReset(email);
      setStatus('If this email exists in our system, you will receive reset instructions shortly.');
    } catch (resetError) {
      const message =
        resetError instanceof Error ? resetError.message : 'Unable to process the request.';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Forgot your password?"
      description="Enter the email associated with your account and we will send you instructions to reset it."
    >
      <form className="space-y-6" onSubmit={handleSubmit} noValidate>
        <TextInput
          label="Email address"
          name="email"
          type="email"
          required
          requiredMark
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            if (error) {
              setError(null);
            }
            if (status) {
              setStatus(null);
            }
          }}
          errorMessage={error ?? undefined}
        />
        {status ? (
          <div
            className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
            role="status"
          >
            {status}
          </div>
        ) : null}
        <Button type="submit" full disabled={isSubmitting}>
          {isSubmitting ? 'Sending...' : 'Send reset link'}
        </Button>
      </form>

      <p className="mt-6 text-sm text-slate-600">
        Remembered your password?{' '}
        <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-700">
          Return to login
        </Link>
      </p>
    </AuthLayout>
  );
};

export default ForgotPassword;