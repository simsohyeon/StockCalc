// 계산기에서 사용하는 도메인 타입 정의.

export type CalculatorInput = {
  currentAveragePrice: number;
  currentQuantity: number;
  currentPrice: number;
  additionalQuantity: number;
};

export type CalculationStatus = 'profit' | 'loss' | 'breakEven';

export type CalculatorResult = {
  currentPurchaseAmount: number;
  additionalPurchaseAmount: number;
  totalPurchaseAmount: number;
  totalQuantity: number;
  newAveragePrice: number;
  evaluationAmount: number;
  expectedProfit: number;
  expectedProfitRate: number;
  breakEvenPrice: number;
  averagePriceChange: number;
  status: CalculationStatus;
};

// 입력 필드 키. UI 상태 관리와 검증에서 공통으로 사용한다.
export type FieldKey = keyof CalculatorInput;

// 필드별 검증 오류 메시지. 오류가 없는 필드는 키가 존재하지 않는다.
export type ValidationErrors = Partial<Record<FieldKey, string>>;
