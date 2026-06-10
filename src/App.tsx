import { useRef } from 'react';
import { Header } from './components/Header';
import { InputCard } from './components/InputCard';
import { ResultCard } from './components/ResultCard';
import { Disclaimer } from './components/Disclaimer';
import { useAveragePriceCalculator } from './hooks/useAveragePriceCalculator';
import { useInterstitialAd } from './hooks/useInterstitialAd';
import { INTERSTITIAL_FREQUENCY } from './ads/adConfig';

// 전체 화면 레이아웃과 상태를 조합하는 루트 컴포넌트.
export default function App() {
  const { values, errors, result, isComplete, setField, calculate, reset, validateOnBlur } =
    useAveragePriceCalculator();

  // 앱인토스 전면 광고. 계산 성공 N회마다 1번 노출한다(토스 런타임에서만 실제 노출).
  const { show: showInterstitial } = useInterstitialAd();
  const calcCountRef = useRef(0);

  const handleCalculate = () => {
    const next = calculate();
    if (!next) return; // 입력 오류면 광고를 띄우지 않는다.
    calcCountRef.current += 1;
    if (calcCountRef.current % INTERSTITIAL_FREQUENCY === 0) {
      showInterstitial();
    }
  };

  return (
    <main className="app">
      <Header />
      <InputCard
        values={values}
        errors={errors}
        isComplete={isComplete}
        onChange={setField}
        onBlur={validateOnBlur}
        onCalculate={handleCalculate}
        onReset={reset}
      />
      {result && <ResultCard result={result} />}
      <Disclaimer />
    </main>
  );
}
