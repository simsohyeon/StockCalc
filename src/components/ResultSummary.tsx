import type { CalculatorResult } from '../types/calculator';
import { STATUS_CLASS } from '../styles/theme';

// 계산 상태에 따른 해석 문구.
const SUMMARY_TEXT: Record<CalculatorResult['status'], { title: string; body: string }> = {
  loss: {
    title: '현재가 기준으로는 아직 손실 구간이에요.',
    body: '현재가가 손익분기점(추가 매수 후 평균단가)을 넘으면 전체 보유분 기준 수익 구간에 진입해요.',
  },
  profit: {
    title: '현재가 기준으로 수익 구간이에요.',
    body: '추가 매수 후 평균단가보다 현재가가 높아 전체 보유분 기준 예상 수익이 발생해요.',
  },
  breakEven: {
    title: '현재가는 추가 매수 후 평균단가와 같아요.',
    body: '현재 기준으로는 손익이 거의 없는 상태예요.',
  },
};

type ResultSummaryProps = {
  result: CalculatorResult;
};

export function ResultSummary({ result }: ResultSummaryProps) {
  const text = SUMMARY_TEXT[result.status];
  // 추가 매수가가 기존 평단보다 높아 평단이 올라간 경우 안내 문구를 덧붙인다.
  const priceWentUp = result.averagePriceChange > 0;

  return (
    <div className="summary">
      <p className={`summary__title ${STATUS_CLASS[result.status]}`}>{text.title}</p>
      <p className="summary__body">{text.body}</p>
      {priceWentUp && (
        <p className="summary__body" style={{ marginTop: 6 }}>
          추가 매수가가 기존 평균단가보다 높아 평균단가가 올라갔어요. 예상 수익률을 함께
          확인해보세요.
        </p>
      )}
    </div>
  );
}
