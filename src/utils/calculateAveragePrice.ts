import type { CalculatorInput, CalculatorResult, CalculationStatus } from '../types/calculator';

/**
 * 추가 매수 후 평균단가와 현재가 기준 예상 손익을 계산하는 순수 함수.
 *
 * 입력값은 이미 검증되었다고 가정한다(검증은 validateInput에서 수행).
 * 어떤 부수효과도 없으며, 동일 입력에 대해 항상 동일 결과를 반환한다.
 * 반올림하지 않은 원시 숫자를 반환하며, 표시용 반올림은 formatNumber에서 처리한다.
 */
export function calculateAveragePrice(input: CalculatorInput): CalculatorResult {
  const { currentAveragePrice, currentQuantity, currentPrice, additionalQuantity } = input;

  const currentPurchaseAmount = currentAveragePrice * currentQuantity;
  const additionalPurchaseAmount = currentPrice * additionalQuantity;
  const totalPurchaseAmount = currentPurchaseAmount + additionalPurchaseAmount;

  const totalQuantity = currentQuantity + additionalQuantity;
  const newAveragePrice = totalPurchaseAmount / totalQuantity;

  const evaluationAmount = currentPrice * totalQuantity;
  const expectedProfit = evaluationAmount - totalPurchaseAmount;
  const expectedProfitRate =
    totalPurchaseAmount === 0 ? 0 : (expectedProfit / totalPurchaseAmount) * 100;

  const breakEvenPrice = newAveragePrice;
  const averagePriceChange = newAveragePrice - currentAveragePrice;

  const status: CalculationStatus =
    expectedProfit > 0 ? 'profit' : expectedProfit < 0 ? 'loss' : 'breakEven';

  return {
    currentPurchaseAmount,
    additionalPurchaseAmount,
    totalPurchaseAmount,
    totalQuantity,
    newAveragePrice,
    evaluationAmount,
    expectedProfit,
    expectedProfitRate,
    breakEvenPrice,
    averagePriceChange,
    status,
  };
}
