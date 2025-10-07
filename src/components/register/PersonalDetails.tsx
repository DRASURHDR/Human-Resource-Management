import type { ChangeEvent, FormEvent } from 'react';
import { useState } from 'react';
import TextInput from '../common/TextInput';
import Button from '../common/Button';
import type { RegistrationData } from '../../types/auth';

const emailPattern = /\S+@\S+\.\S+/;

interface PersonalDetailsProps {
  data: Partial<RegistrationData>;
  onNext: (values: Pick<RegistrationData, 'fullName' | 'email' | 'phoneNumber'>) => void;
}

const PersonalDetails: React.FC<PersonalDetailsProps> = ({ data, onNext }) => {
  const [values, setValues] = useState({
    fullName: data.fullName ?? '',
    email: data.email ?? '',
    phoneNumber: data.phoneNumber ?? '',
  });

  const [errors, setErrors] = useState<Record<'fullName' | 'email' | 'phoneNumber', string>>({
    fullName: '',
    email: '',
    phoneNumber: '',
  });

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    const fieldName = name as keyof typeof errors;
    setErrors((prev) => ({ ...prev, [fieldName]: '' }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const newErrors: Record<'fullName' | 'email' | 'phoneNumber', string> = {
      fullName: values.fullName.trim() ? '' : 'Please enter your full name.',
      email: emailPattern.test(values.email) ? '' : 'Please provide a valid email address.',
      phoneNumber:
        values.phoneNumber.trim().length >= 9 ? '' : 'Phone number must contain at least 9 digits.',
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some((message) => message !== '')) {
      return;
    }

    onNext({
      fullName: values.fullName.trim(),
      email: values.email.trim(),
      phoneNumber: values.phoneNumber.trim(),
    });
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit} noValidate>
      <TextInput
        label="Full name"
        name="fullName"
        type="text"
        autoComplete="name"
        required
        requiredMark
        value={values.fullName}
        onChange={handleChange}
        errorMessage={errors.fullName || undefined}
      />

      <TextInput
        label="Email address"
        name="email"
        type="email"
        autoComplete="email"
        required
        requiredMark
        value={values.email}
        onChange={handleChange}
        errorMessage={errors.email || undefined}
      />

      <TextInput
        label="Phone number"
        name="phoneNumber"
        type="tel"
        autoComplete="tel"
        required
        requiredMark
        value={values.phoneNumber}
        onChange={handleChange}
        errorMessage={errors.phoneNumber || undefined}
        hint="Include your country code if applicable."
      />

      <Button type="submit" full>
        Continue
      </Button>
    </form>
  );
};

export default PersonalDetails;