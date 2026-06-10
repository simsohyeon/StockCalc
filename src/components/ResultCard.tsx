import type { CalculatorResult } from '../types/calculator';
import { STATUS_CLASS } from '../styles/theme';
import {
  formatCurrency,
  formatProfit,
  formatQuantity,
  formatRate,
} from '../utils/formatNumber';
import { ResultSummary } from './ResultSummary';

type ResultCardProps = {
  result: CalculatorResult;
};

// 계산 결과 카드. 메인 결과(평균단가)를 가장 크게 보여주고,
// 서브 결과와 해석 문구를 함께 표시한다.
export function ResultCard({ result }: ResultCardProps) {
  const statusClass = STATUS_CLASS[result.status];

  // 평균단가 변화 안내. 부호로 상승/하락을 함께 표기한다(색상에만 의존하지 않음).
  const changeRounded = Math.round(result.averagePriceChange);
  const changeText =
    changeRounded === 0
      ? '기존 평균단가와 동일'
      : changeRounded > 0
        ? `기존 대비 +${changeRounded.toLocaleString('ko-KR')}원 상승`
        : `기존 대비 ${changeRounded.toLocaleString('ko-KR')}원 하락`;

  return (
    <section className="card" aria-label="계산 결과">
      <p className="result__main-label">추가 매수 후 평균단가</p>
      <p className="result__main-value">{formatCurrency(result.newAveragePrice)}</p>
      <p className="result__main-change">{changeText}</p>

      <hr className="result__divider" />

      <Row label="총 보유수량" value={formatQuantity(result.totalQuantity)} />
      <Row label="총 매입금액" value={formatCurrency(result.totalPurchaseAmount)} />
      <Row label="현재 평가금액" value={formatCurrency(result.evaluationAmount)} />
      <Row
        label="예상 수익금"
        value={formatProfit(result.expectedProfit)}
        valueClass={statusClass}
      />
      <Row
        label="예상 수익률"
        value={formatRate(result.expectedProfitRate)}
        valueClass={statusClass}
      />
      <Row label="손익분기점" value={formatCurrency(result.breakEvenPrice)} />

      <ResultSummary result={result} />
    </section>
  );
}

function Row({
  label,
  value,
  valueClass,
}: {
  label: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <div className="result__row">
      <span className="result__row-label">{label}</span>
      <span className={`result__row-value${valueClass ? ` ${valueClass}` : ''}`}>{value}</span>
    </div>
  );
}
