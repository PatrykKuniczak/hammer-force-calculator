import { useFormContext } from 'react-hook-form';
import type { CombinedFormValuesType as FormValuesType } from '../schemas/formSchemas';
import type { FC } from 'react';
import type { Path } from 'react-hook-form';

type NumberFieldProps = {
  name: Path<FormValuesType>;
  label: string;
  unit?: string;
  step?: string | number;
  placeholder?: string;
  min?: number;
  max?: number;
};

const NumberField: FC<NumberFieldProps> = ({ name, label, unit, step = '0.01', placeholder, min, max }) => {
  const { register, formState } = useFormContext<FormValuesType>();
  const { errors } = formState;

  const fieldError = errors[name]?.message as string | undefined;

  return (
    <div>
      <label className="block text-sm font-medium text-gray-800" htmlFor={name}>
        {label} {unit && <span className="text-gray-500">[{unit}]</span>}
      </label>
      <div className="mt-1 flex items-stretch">
        <input
          id={name}
          type="number"
          step={step}
          placeholder={placeholder}
          className="w-full rounded-l-md border border-gray-300 bg-white p-2 text-sm shadow-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          {...register(name, { valueAsNumber: true, min, max })}
        />
        <span className="inline-flex items-center rounded-r-md border border-l-0 border-gray-300 bg-gray-50 px-2 text-sm text-gray-600">
          {unit ?? ''}
        </span>
      </div>
      {fieldError && <p className="mt-1 text-xs text-red-600">{fieldError}</p>}
    </div>
  );
};

export default NumberField;
