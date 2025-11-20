import './App.css';
import NumberField from './components/NumberField';
import PreviewCard from './components/PreviewCard';
import Section from './components/Section';
import { ipcInvoke, ipcOn, ipcSend } from './lib/helpers';
import { computePreview } from './lib/preview';
import { normalizeUnitsToSI } from './lib/units';
import { combinedFormSchema } from './schemas/formSchemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useMemo, useState } from 'react';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import type { CombinedFormValuesType as FormValuesType } from './schemas/formSchemas';
import type { SubmitHandler } from 'react-hook-form';

const App = () => {
  const [backendPenetrationPct, setBackendPenetrationPct] = useState<number | null>(null);

  const methods = useForm<FormValuesType>({
    mode: 'onChange',
    resolver: zodResolver(combinedFormSchema),
  });

  const {
    handleSubmit,
    formState: { isSubmitting, isValid, isSubmitted },
    reset,
  } = methods;

  const values = useWatch<FormValuesType>({ control: methods.control });
  const preview = useMemo(() => computePreview(values), [values]);

  useEffect(
    () =>
      ipcOn('calc:penetration:done', pct => {
        if (typeof pct === 'number' && Number.isFinite(pct)) {
          setBackendPenetrationPct(pct);
        } else {
          setBackendPenetrationPct(null);
        }
      }),
    [],
  );

  const onSubmit: SubmitHandler<FormValuesType> = async (data: FormValuesType) => {
    try {
      const normalizedData = normalizeUnitsToSI(data);
      ipcSend('form:submit', normalizedData);
      const penetration = await ipcInvoke('calc:penetration', normalizedData);

      if (typeof penetration === 'number' && Number.isFinite(penetration)) {
        setBackendPenetrationPct(penetration);
      } else {
        setBackendPenetrationPct(null);
      }
    } catch (e) {
      console.error('IPC send error:', e);
      setBackendPenetrationPct(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="mx-auto w-full max-w-5xl space-y-6">
        <header className="flex items-end justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">Hammer Force Calculator</h1>
          <button
            type="button"
            onClick={() => reset()}
            className="rounded-md bg-gray-100 px-3 py-2 text-sm text-gray-700 ring-1 ring-gray-300 ring-inset hover:bg-gray-200">
            Wyczyść
          </button>
        </header>

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Section title="Parametry ruchu / Układu młotka">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <NumberField name="armLength" label="Długość ramienia" unit="cm" step="0.1" placeholder="35" />
                <NumberField
                  name="handleToHammerHeadLength"
                  label="Długość rękojeści do głowicy"
                  unit="cm"
                  step="0.1"
                  placeholder="20"
                />
                <NumberField
                  name="hammerHeadHeight"
                  label="Wysokość głowicy młotka"
                  unit="cm"
                  step="0.1"
                  placeholder="5"
                />

                <NumberField name="travelTime" label="Czas ruchu (zamachu)" unit="s" step="0.01" placeholder="0.30" />
                <NumberField name="hammerWeight" label="Masa młotka" unit="kg" step="0.01" placeholder="1.2" />
                <NumberField name="armWeight" label="Masa ramienia" unit="kg" step="0.1" placeholder="4" />
              </div>

              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <PreviewCard title="Łączna droga" unit="m" value={preview?.totalArmLength} />
                <PreviewCard title="Prędkość" unit="m/s" value={preview?.velocity} />
                <PreviewCard title="Suma mas" unit="kg" value={preview?.totalMass} />
                <PreviewCard title="Energia kinetyczna" unit="J" value={preview?.kineticEnergy} />
              </div>
            </Section>

            <Section title="Parametry gwoździa i materiału">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <NumberField name="diameter" label="Średnica gwoździa" unit="mm" step="0.1" placeholder="4" />
                <NumberField name="nailLength" label="Długość gwoździa" unit="cm" step="0.1" placeholder="6" />
                <NumberField name="coneLength" label="Długość stożka gwoździa" unit="cm" step="0.1" placeholder="1" />
                <NumberField name="coneAngleDeg" label="Kąt stożka gwoździa" unit="°" step="1" placeholder="30" />
                <NumberField
                  name="materialHardness"
                  label="Twardość materiału w który wbijany jest gwoźdź"
                  unit="MPa"
                  step="1"
                  placeholder="200"
                />
                <NumberField
                  name="materialHeight"
                  label="Wysokość materiału w który wbijany jest gwoźdź"
                  unit="cm"
                  step="0.1"
                  placeholder="5"
                />
                <NumberField
                  name="nailFrictionCoefficient"
                  label="Współczynnik tarcia materiału gwoździa"
                  unit="-"
                  step="0.01"
                  placeholder="0.4"
                />
              </div>
              {(isSubmitted || backendPenetrationPct !== null) && (
                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <PreviewCard
                    title="Penetracja Materiału"
                    unit="%"
                    value={backendPenetrationPct ?? undefined}
                    fractionDigits={1}
                  />
                </div>
              )}
            </Section>

            <button
              type="submit"
              disabled={isSubmitting || !isValid}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60">
              Zatwierdź
            </button>
          </form>
        </FormProvider>
      </div>
    </div>
  );
};

export default App;
