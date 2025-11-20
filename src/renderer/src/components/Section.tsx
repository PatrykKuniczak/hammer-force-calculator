import type { PropsWithChildren } from 'react';

type SectionProps = PropsWithChildren<{
  title?: string;
  className?: string;
}>;

const Section = ({ title, className = '', children }: SectionProps) => {
  const base = 'rounded-lg border border-gray-200 bg-white p-4 shadow-sm';
  return (
    <section className={`${base} ${className}`.trim()}>
      {title ? <h2 className="mb-3 text-lg font-medium text-gray-900">{title}</h2> : null}
      {children}
    </section>
  );
};

export default Section;
