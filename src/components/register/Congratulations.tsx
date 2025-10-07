import Button from '../common/Button';
import type { RegistrationData } from '../../types/auth';

interface CongratulationsProps {
  data: RegistrationData;
  onContinue: () => void;
}

const summaryFields: Array<{ key: keyof RegistrationData; label: string }> = [
  { key: 'fullName', label: 'Full name' },
  { key: 'email', label: 'Email' },
  { key: 'phoneNumber', label: 'Phone number' },
  { key: 'role', label: 'Preferred role' },
  { key: 'department', label: 'Department' },
  { key: 'position', label: 'Position' },
  { key: 'description', label: 'About you' },
  { key: 'username', label: 'Username' },
];

const Congratulations: React.FC<CongratulationsProps> = ({ data, onContinue }) => (
  <div className="space-y-8">
    <div className="rounded-xl bg-emerald-50 px-6 py-8 text-center text-emerald-900 shadow-sm">
      <h2 className="text-2xl font-semibold">You are all set!</h2>
      <p className="mt-3 text-sm leading-6">
        Thank you for sharing your details. We have created your account and saved your preferences.
        You can now sign in to explore the dashboard.
      </p>
    </div>

    <div className="space-y-4">
      <h3 className="text-sm font-semibold uppercase tracking-widest text-slate-500">Summary</h3>
      <dl className="grid gap-4 rounded-xl border border-slate-200 bg-white px-6 py-6 shadow-sm md:grid-cols-2">
        {summaryFields.map(({ key, label }) => (
          <div key={key} className="space-y-1">
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</dt>
            <dd className="text-sm text-slate-700">
              {key === 'description' ? (
                <span className="block whitespace-pre-line">{data[key]}</span>
              ) : (
                data[key]
              )}
            </dd>
          </div>
        ))}
      </dl>
    </div>

    <Button type="button" full onClick={onContinue}>
      Continue to login
    </Button>
  </div>
);

export default Congratulations;