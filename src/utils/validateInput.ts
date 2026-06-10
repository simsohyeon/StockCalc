import type { CalculatorInput, FieldKey, ValidationErrors } from '../types/calculator';
import { stripComma } from './formatNumber';

// 필드 라벨. 검증 메시지와 UI에서 공통으로 사용한다.
export const FIELD_LABEL: Record<FieldKey, string> = {
  currentAveragePrice: '기존 평균단가',
  currentQuantity: '보유 주식 수',
  currentPrice: '현재가',
  additionalQuantity: '추가 매수 수량',
};

export const FIELD_ORDER: FieldKey[] = [
  'currentAveragePrice',
  'currentQuantity',
  'currentPrice',
  'additionalQuantity',
];

/**
 * 단일 필드의 원시 입력 문자열을 검증한다.
 * 오류가 있으면 메시지를, 없으면 null을 반환한다.
 */
export function validateField(field: FieldKey, raw: string): string | null {
  const value = stripComma(raw);

  if (value === '') {
    return `${FIELD_LABEL[field]}을(를) 입력해 주세요.`;
  }

  const num = Number(value);
  if (Number.isNaN(num)) {
    return '숫자만 입력할 수 있어요.';
  }
  if (!Number.isInteger(num)) {
    return `${FIELD_LABEL[field]}는 소수점 없이 정수로 입력해 주세요.`;
  }

  switch (field) {
    case 'currentAveragePrice':
      if (num <= 0) return '기존 평균단가는 0보다 커야 합니다.';
      break;
    case 'currentQuantity':
      if (num < 0) return '보유 주식 수는 0 이상이어야 합니다.';
      break;
    case 'currentPrice':
      if (num <= 0) return '현재가는 0보다 커야 합니다.';
      break;
    case 'additionalQuantity':
      if (num < 1) return '추가 매수 수량은 1주 이상이어야 합니다.';
      break;
  }

  return null;
}

/**
 * 4개 필드의 원시 입력값을 한 번에 검증한다.
 * 모든 필드가 유효하면 parsed에 파싱된 CalculatorInput을 담아 반환한다.
 */
export function validateInput(values: Record<FieldKey, string>): {
  errors: ValidationErrors;
  parsed: CalculatorInput | null;
} {
  const errors: ValidationErrors = {};

  for (const field of FIELD_ORDER) {
    const error = validateField(field, values[field]);
    if (error) errors[field] = error;
  }

  if (Object.keys(errors).length > 0) {
    return { errors, parsed: null };
  }

  const parsed: CalculatorInput = {
    currentAveragePrice: Number(stripComma(values.currentAveragePrice)),
    currentQuantity: Number(stripComma(values.currentQuantity)),
    currentPrice: Number(stripComma(values.currentPrice)),
    additionalQuantity: Number(stripComma(values.additionalQuantity)),
  };

  return { errors, parsed };
}
