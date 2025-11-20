import type { FC } from 'react';

type PreviewCardProps = {
  title: string;
  unit: string;
  value?: number | null;
  fractionDigits?: number;
};

const PreviewCard: FC<PreviewCardProps> = ({ title, unit, value, fractionDigits = 3 }) => {
  const display = value === undefined || value === null || Number.isNaN(value) ? '-' : value.toFixed(fractionDigits);

  return (
    <div className="rounded-md bg-blue-50 p-3 text-sm text-blue-900">
      <p className="font-medium">
        {title} <span className="text-blue-800">[{unit}]</span>
      </p>
      <p className="tabular-nums">{display}</p>
    </div>
  );
};

export default PreviewCard;
