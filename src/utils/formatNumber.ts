// 금액/수량/수익률 표시용 포맷팅 유틸. 모든 함수는 순수 함수이다.

const KO = 'ko-KR';

/** 콤마가 들어간 정수 문자열. 예: 1045000 -> "1,045,000" */
export function formatNumberWithComma(value: number): string {
  return Math.round(value).toLocaleString(KO);
}

/** 금액 표시. 예: 69666.66 -> "69,667원" */
export function formatCurrency(value: number): string {
  return `${formatNumberWithComma(value)}원`;
}

/** 수량 표시. 예: 15 -> "15주" */
export function formatQuantity(value: number): string {
  return `${Math.round(value).toLocaleString(KO)}주`;
}

/**
 * 수익금 표시. 부호를 명시한다.
 * 예: 70000 -> "+70,000원", -70000 -> "-70,000원", 0 -> "0원"
 */
export function formatProfit(value: number): string {
  const rounded = Math.round(value);
  if (rounded > 0) return `+${rounded.toLocaleString(KO)}원`;
  if (rounded < 0) return `${rounded.toLocaleString(KO)}원`; // toLocaleString이 음수 부호 포함
  return '0원';
}

/**
 * 수익률 표시. 소수점 둘째 자리까지, 부호를 명시한다.
 * 예: 3.125 -> "+3.13%", -6.698 -> "-6.70%", 0 -> "0.00%"
 */
export function formatRate(value: number): string {
  // -0.00 같은 표기를 피하기 위해 반올림한 값으로 부호를 판단한다.
  const rounded = Number(value.toFixed(2));
  if (rounded > 0) return `+${rounded.toFixed(2)}%`;
  if (rounded < 0) return `${rounded.toFixed(2)}%`;
  return '0.00%';
}

/**
 * 입력창 표시용 콤마 포맷. 숫자가 아닌 문자는 제거하고 정수로만 처리한다.
 * 예: "1045000" -> "1,045,000", "12,3a4" -> "1,234"
 */
export function formatInputWithComma(raw: string): string {
  const digits = raw.replace(/[^\d]/g, '');
  if (digits === '') return '';
  return Number(digits).toLocaleString(KO);
}

/** 콤마/공백을 제거한 순수 숫자 문자열로 변환. 빈 값이면 빈 문자열. */
export function stripComma(raw: string): string {
  return raw.replace(/,/g, '').trim();
}
