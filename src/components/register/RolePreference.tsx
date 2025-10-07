import type { FormEvent } from 'react';
import { useState } from 'react';
import Button from '../common/Button';
import type { RegistrationData } from '../../types/auth';

const roleOptions = [
  { value: 'Frontend Developer', label: 'Frontend Developer' },
  { value: 'Backend Developer', label: 'Backend Developer' },
  { value: 'Full-stack Developer', label: 'Full-stack Developer' },
  { value: 'Product Manager', label: 'Product Manager' },
  { value: 'UI/UX Designer', label: 'UI/UX Designer' },
];

interface RolePreferenceProps {
  data: Partial<RegistrationData>;
  onBack: () => void;
  onNext: (values: Pick<RegistrationData, 'role'>) => void;
}

const RolePreference: React.FC<RolePreferenceProps> = ({ data, onBack, onNext }) => {
  const [role, setRole] = useState<string>(data.role ?? '');
  const [error, setError] = useState<string>('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!role) {
      setError('Please select a role that best matches your interests.');
      return;
    }
    setError('');
    onNext({ role });
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit} noValidate>
      <div className="flex flex-col gap-2">
        <label htmlFor="role" className="text-sm font-medium text-slate-700">
          What role are you most interested in?
          <span className="ml-1 text-red-600">*</span>
        </label>
        <select
          id="role"
          name="role"
          value={role}
          onChange={(event) => {
            setRole(event.target.value);
            if (error) {
              setError('');
            }
          }}
          className={`block w-full rounded-md border px-3 py-2 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
            error
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
              : 'border-slate-300 focus:border-indigo-500'
          }`}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? 'role-error' : 'role-hint'}
        >
          <option value="">Select a role</option>
          {roleOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error ? (
          <p id="role-error" className="text-xs text-red-600">
            {error}
          </p>
        ) : (
          <p id="role-hint" className="text-xs text-slate-500">
            Choose the opportunity that most closely aligns with your skillset.
          </p>
        )}
      </div>

      <div className="flex gap-3">
        <Button type="button" variant="ghost" onClick={onBack} className="flex-1">
          Back
        </Button>
        <Button type="submit" className="flex-1">
          Continue
        </Button>
      </div>
    </form>
  );
};

export default RolePreference;