import type { ChangeEvent, FormEvent } from 'react';
import { useState } from 'react';
import TextInput from '../common/TextInput';
import Button from '../common/Button';
import type { RegistrationData } from '../../types/auth';

interface SelectDesignationProps {
  data: Partial<RegistrationData>;
  onBack: () => void;
  onNext: (
    values: Pick<RegistrationData, 'department' | 'position' | 'description'>,
  ) => void;
}

const SelectDesignation: React.FC<SelectDesignationProps> = ({ data, onBack, onNext }) => {
  const [values, setValues] = useState({
    department: data.department ?? '',
    position: data.position ?? '',
    description: data.description ?? '',
  });

  const [errors, setErrors] = useState<Record<'department' | 'position' | 'description', string>>({
    department: '',
    position: '',
    description: '',
  });

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    const fieldName = name as keyof typeof errors;
    setErrors((prev) => ({ ...prev, [fieldName]: '' }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const newErrors = {
      department: values.department.trim() ? '' : 'Please specify the department you would join.',
      position: values.position.trim() ? '' : 'Please enter the position title.',
      description:
        values.description.trim().length >= 20
          ? ''
          : 'Tell us a bit more (at least 20 characters).',
    };
    setErrors(newErrors);

    if (Object.values(newErrors).some((message) => message !== '')) {
      return;
    }

    onNext({
      department: values.department.trim(),
      position: values.position.trim(),
      description: values.description.trim(),
    });
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit} noValidate>
      <TextInput
        label="Department"
        name="department"
        type="text"
        required
        requiredMark
        value={values.department}
        onChange={handleChange}
        errorMessage={errors.department || undefined}
      />

      <TextInput
        label="Position title"
        name="position"
        type="text"
        required
        requiredMark
        value={values.position}
        onChange={handleChange}
        errorMessage={errors.position || undefined}
      />

      <div className="flex flex-col gap-2">
        <label htmlFor="description" className="text-sm font-medium text-slate-700">
          Brief description
          <span className="ml-1 text-red-600">*</span>
        </label>
        <textarea
          id="description"
          name="description"
          required
          minLength={20}
          value={values.description}
          onChange={handleChange}
          className={`min-h-[120px] rounded-md border px-3 py-2 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
            errors.description
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
              : 'border-slate-300 focus:border-indigo-500'
          }`}
          aria-invalid={Boolean(errors.description)}
          aria-describedby={errors.description ? 'description-error' : 'description-hint'}
        />
        {errors.description ? (
          <p id="description-error" className="text-xs text-red-600">
            {errors.description}
          </p>
        ) : (
          <p id="description-hint" className="text-xs text-slate-500">
            Share a short blurb about your experience and the impact you want to make with us.
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

export default SelectDesignation;