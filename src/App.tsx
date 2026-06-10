import { Header } from './components/Header';
import { InputCard } from './components/InputCard';
import { ResultCard } from './components/ResultCard';
import { Disclaimer } from './components/Disclaimer';
import { useAveragePriceCalculator } from './hooks/useAveragePriceCalculator';

// 전체 화면 레이아웃과 상태를 조합하는 루트 컴포넌트.
export default function App() {
  const { values, errors, result, isComplete, setField, calculate, reset, validateOnBlur } =
    useAveragePriceCalculator();

  return (
    <main className="app">
      <Header />
      <InputCard
        values={values}
        errors={errors}
        isComplete={isComplete}
        onChange={setField}
        onBlur={validateOnBlur}
        onCalculate={calculate}
        onReset={reset}
      />
      {result && <ResultCard result={result} />}
      <Disclaimer />
    </main>
  );
}
