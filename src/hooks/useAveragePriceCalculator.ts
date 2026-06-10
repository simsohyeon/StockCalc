import { useMemo, useState } from 'react';
import type { CalculatorResult, FieldKey, ValidationErrors } from '../types/calculator';
import { calculateAveragePrice } from '../utils/calculateAveragePrice';
import { validateField, validateInput, FIELD_ORDER } from '../utils/validateInput';
import { formatInputWithComma } from '../utils/formatNumber';

type Values = Record<FieldKey, string>;

const EMPTY_VALUES: Values = {
  currentAveragePrice: '',
  currentQuantity: '',
  currentPrice: '',
  additionalQuantity: '',
};

/**
 * 입력 상태, 검증 오류, 계산 결과를 관리하는 커스텀 훅.
 * 입력값은 콤마가 포함된 문자열로 보관하고, 계산 시점에 파싱한다.
 */
export function useAveragePriceCalculator() {
  const [values, setValues] = useState<Values>(EMPTY_VALUES);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [result, setResult] = useState<CalculatorResult | null>(null);

  const setField = (field: FieldKey, raw: string) => {
    const formatted = formatInputWithComma(raw);
    setValues((prev) => ({ ...prev, [field]: formatted }));
    // 입력 중에는 해당 필드의 기존 오류만 제거해 부담을 줄인다.
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const calculate = () => {
    const { errors: nextErrors, parsed } = validateInput(values);
    setErrors(nextErrors);
    if (!parsed) {
      setResult(null);
      return;
    }
    setResult(calculateAveragePrice(parsed));
  };

  const reset = () => {
    setValues(EMPTY_VALUES);
    setErrors({});
    setResult(null);
  };

  // 모든 필드가 입력되어야 계산 버튼을 활성화한다.
  const isComplete = useMemo(
    () => FIELD_ORDER.every((field) => values[field].trim() !== ''),
    [values],
  );

  // 입력 필드를 벗어날 때 즉시 검증 피드백을 제공한다.
  const validateOnBlur = (field: FieldKey) => {
    const error = validateField(field, values[field]);
    setErrors((prev) => {
      const next = { ...prev };
      if (error) next[field] = error;
      else delete next[field];
      return next;
    });
  };

  return {
    values,
    errors,
    result,
    isComplete,
    setField,
    calculate,
    reset,
    validateOnBlur,
  };
}
