import type { ChangeEvent, FormEvent } from 'react';
import { useState } from 'react';
import TextInput from '../common/TextInput';
import Button from '../common/Button';
import type { RegistrationData } from '../../types/auth';

interface SetupAccountProps {
  data: Partial<RegistrationData>;
  onBack: () => void;
  onSubmit: (values: Pick<RegistrationData, 'username' | 'password'>) => Promise<void> | void;
  loading: boolean;
  errorMessage?: string | null;
}

const SetupAccount: React.FC<SetupAccountProps> = ({
  data,
  onBack,
  onSubmit,
  loading,
  errorMessage,
}) => {
  const [values, setValues] = useState({
    username: data.username ?? '',
    password: data.password ?? '',
    confirmPassword: data.password ?? '',
  });

  const [errors, setErrors] = useState<Record<'username' | 'password' | 'confirmPassword', string>>({
    username: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    const fieldName = name as keyof typeof errors;
    setErrors((prev) => ({ ...prev, [fieldName]: '' }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const newErrors = {
      username: values.username.trim().length >= 4 ? '' : 'Username must be at least 4 characters.',
      password: values.password.length >= 6 ? '' : 'Password must be at least 6 characters.',
      confirmPassword:
        values.password === values.confirmPassword
          ? ''
          : 'Confirmation does not match the password.',
    };
    setErrors(newErrors);

    if (Object.values(newErrors).some((message) => message !== '')) {
      return;
    }

    await onSubmit({
      username: values.username.trim(),
      password: values.password,
    });
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit} noValidate>
      <TextInput
        label="Username"
        name="username"
        type="text"
        autoComplete="username"
        required
        requiredMark
        value={values.username}
        onChange={handleChange}
        errorMessage={errors.username || undefined}
      />

      <TextInput
        label="Password"
        name="password"
        type="password"
        autoComplete="new-password"
        required
        requiredMark
        value={values.password}
        onChange={handleChange}
        errorMessage={errors.password || undefined}
        hint="Use at least 6 characters. Include a mix of letters and numbers if you can."
      />

      <TextInput
        label="Confirm password"
        name="confirmPassword"
        type="password"
        autoComplete="new-password"
        required
        requiredMark
        value={values.confirmPassword}
        onChange={handleChange}
        errorMessage={errors.confirmPassword || undefined}
      />

      {errorMessage ? (
        <div
          className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          role="alert"
        >
          {errorMessage}
        </div>
      ) : null}

      <div className="flex gap-3">
        <Button type="button" variant="ghost" onClick={onBack} className="flex-1" disabled={loading}>
          Back
        </Button>
        <Button type="submit" className="flex-1" disabled={loading}>
          {loading ? 'Creating account...' : 'Create account'}
        </Button>
      </div>
    </form>
  );
};

export default SetupAccount;