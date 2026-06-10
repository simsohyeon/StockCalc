import type { CalculationStatus } from '../types/calculator';

// 색상 토큰. 밝은 모드/다크 모드 공통으로 자연스럽게 보이는 값으로 선택했다.
// 레이아웃 색상은 global.css의 CSS 변수에서 관리하며,
// 여기서는 수익/손실/중립처럼 로직으로 결정되는 의미 색상을 다룬다.
export const theme = {
  colors: {
    primary: '#2563eb', // 메인 파란색 계열
    profit: '#16a34a', // 수익 - 초록색 계열
    loss: '#dc2626', // 손실 - 빨간색 계열
    neutral: '#64748b', // 손익분기 - 중립색
  },
} as const;

// 계산 상태 -> 색상 클래스. ResultCard/ResultSummary에서 사용한다.
export const STATUS_CLASS: Record<CalculationStatus, string> = {
  profit: 'status-profit',
  loss: 'status-loss',
  breakEven: 'status-neutral',
};
