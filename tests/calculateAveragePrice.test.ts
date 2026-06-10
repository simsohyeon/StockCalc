import { describe, it, expect } from 'vitest';
import { calculateAveragePrice } from '../src/utils/calculateAveragePrice';
import { validateField, validateInput } from '../src/utils/validateInput';
import {
  formatCurrency,
  formatProfit,
  formatQuantity,
  formatRate,
  formatInputWithComma,
} from '../src/utils/formatNumber';

describe('calculateAveragePrice - 정상 케이스', () => {
  it('정상 케이스 1: 손실 구간', () => {
    const r = calculateAveragePrice({
      currentAveragePrice: 72000,
      currentQuantity: 10,
      currentPrice: 65000,
      additionalQuantity: 5,
    });

    expect(r.totalQuantity).toBe(15);
    expect(r.currentPurchaseAmount).toBe(720000);
    expect(r.additionalPurchaseAmount).toBe(325000);
    expect(r.totalPurchaseAmount).toBe(1045000);
    expect(r.newAveragePrice).toBeCloseTo(69666.6667, 3);
    expect(r.evaluationAmount).toBe(975000);
    expect(r.expectedProfit).toBe(-70000);
    expect(r.expectedProfitRate).toBeCloseTo(-6.6985, 3);
    expect(r.breakEvenPrice).toBeCloseTo(69666.6667, 3);
    expect(r.status).toBe('loss');

    // 표시 포맷 확인
    expect(formatCurrency(r.newAveragePrice)).toBe('69,667원');
    expect(formatProfit(r.expectedProfit)).toBe('-70,000원');
    expect(formatRate(r.expectedProfitRate)).toBe('-6.70%');
  });

  it('정상 케이스 2: 수익 구간', () => {
    const r = calculateAveragePrice({
      currentAveragePrice: 50000,
      currentQuantity: 10,
      currentPrice: 60000,
      additionalQuantity: 10,
    });

    expect(r.totalQuantity).toBe(20);
    expect(r.totalPurchaseAmount).toBe(1100000);
    expect(r.newAveragePrice).toBe(55000);
    expect(r.evaluationAmount).toBe(1200000);
    expect(r.expectedProfit).toBe(100000);
    expect(r.expectedProfitRate).toBeCloseTo(9.0909, 3);
    expect(r.status).toBe('profit');

    expect(formatProfit(r.expectedProfit)).toBe('+100,000원');
    expect(formatRate(r.expectedProfitRate)).toBe('+9.09%');
  });
});

describe('calculateAveragePrice - 경계 케이스', () => {
  it('보유 0주에서 1주 매수, 손익분기', () => {
    const r = calculateAveragePrice({
      currentAveragePrice: 10000,
      currentQuantity: 0,
      currentPrice: 10000,
      additionalQuantity: 1,
    });

    expect(r.totalQuantity).toBe(1);
    expect(r.newAveragePrice).toBe(10000);
    expect(r.totalPurchaseAmount).toBe(10000);
    expect(r.evaluationAmount).toBe(10000);
    expect(r.expectedProfit).toBe(0);
    expect(r.expectedProfitRate).toBe(0);
    expect(r.status).toBe('breakEven');

    expect(formatProfit(r.expectedProfit)).toBe('0원');
    expect(formatRate(r.expectedProfitRate)).toBe('0.00%');
  });

  it('평균단가 상승 케이스: averagePriceChange > 0', () => {
    const r = calculateAveragePrice({
      currentAveragePrice: 50000,
      currentQuantity: 10,
      currentPrice: 70000,
      additionalQuantity: 10,
    });
    expect(r.newAveragePrice).toBe(60000);
    expect(r.averagePriceChange).toBe(10000);
  });
});

describe('validateField - 예외 케이스', () => {
  it('기존 평균단가 0 -> 0보다 커야 함', () => {
    expect(validateField('currentAveragePrice', '0')).toBe('기존 평균단가는 0보다 커야 합니다.');
  });

  it('추가 매수 수량 0 -> 1주 이상', () => {
    expect(validateField('additionalQuantity', '0')).toBe(
      '추가 매수 수량은 1주 이상이어야 합니다.',
    );
  });

  it('보유 주식 수 -1 -> 0 이상', () => {
    expect(validateField('currentQuantity', '-1')).toBe('보유 주식 수는 0 이상이어야 합니다.');
  });

  it('빈 값 -> 입력 안내', () => {
    expect(validateField('currentPrice', '')).toBe('현재가을(를) 입력해 주세요.');
  });

  it('소수점 -> 정수 안내', () => {
    expect(validateField('currentAveragePrice', '100.5')).toContain('정수');
  });

  it('숫자가 아닌 값 -> 숫자 안내', () => {
    expect(validateField('currentPrice', 'abc')).toBe('숫자만 입력할 수 있어요.');
  });

  it('보유 주식 수 0은 허용', () => {
    expect(validateField('currentQuantity', '0')).toBeNull();
  });

  it('콤마가 포함된 정상 입력은 허용', () => {
    expect(validateField('currentAveragePrice', '72,000')).toBeNull();
  });
});

describe('validateInput - 전체 검증', () => {
  it('모든 값이 정상이면 parsed 반환', () => {
    const { errors, parsed } = validateInput({
      currentAveragePrice: '72,000',
      currentQuantity: '10',
      currentPrice: '65,000',
      additionalQuantity: '5',
    });
    expect(Object.keys(errors)).toHaveLength(0);
    expect(parsed).toEqual({
      currentAveragePrice: 72000,
      currentQuantity: 10,
      currentPrice: 65000,
      additionalQuantity: 5,
    });
  });

  it('오류가 하나라도 있으면 parsed는 null', () => {
    const { errors, parsed } = validateInput({
      currentAveragePrice: '0',
      currentQuantity: '10',
      currentPrice: '65000',
      additionalQuantity: '5',
    });
    expect(parsed).toBeNull();
    expect(errors.currentAveragePrice).toBeDefined();
  });
});

describe('포맷팅 유틸', () => {
  it('formatCurrency 반올림', () => {
    expect(formatCurrency(69666.66)).toBe('69,667원');
    expect(formatCurrency(1045000)).toBe('1,045,000원');
  });

  it('formatQuantity', () => {
    expect(formatQuantity(15)).toBe('15주');
  });

  it('formatRate 부호 표기', () => {
    expect(formatRate(-6.698564)).toBe('-6.70%');
    expect(formatRate(3.125)).toBe('+3.13%');
    expect(formatRate(0)).toBe('0.00%');
    expect(formatRate(-0.001)).toBe('0.00%'); // -0.00 방지
  });

  it('formatProfit 부호 표기', () => {
    expect(formatProfit(70000)).toBe('+70,000원');
    expect(formatProfit(-70000)).toBe('-70,000원');
    expect(formatProfit(0)).toBe('0원');
  });

  it('formatInputWithComma', () => {
    expect(formatInputWithComma('1045000')).toBe('1,045,000');
    expect(formatInputWithComma('12,3a4')).toBe('1,234');
    expect(formatInputWithComma('')).toBe('');
  });
});
