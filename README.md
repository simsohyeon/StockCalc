# 주식 평단 계산기

추가 매수 후 평균단가와 현재가 기준 예상 수익을 계산하는 App in Toss 미니앱입니다.

서버, DB, 로그인, 외부 주식 API 없이 프론트엔드 단독으로 동작하며, 사용자가 직접 입력한 값만으로 계산합니다.

## 주요 기능

- 기존 평균단가 입력
- 보유 주식 수 입력
- 현재가 입력
- 추가 매수 수량 입력
- 추가 매수 후 평균단가 계산
- 예상 수익금 계산
- 예상 수익률 계산
- 손익분기점 표시
- 수익 / 손실 / 손익분기 상태 구분 및 해석 문구 제공

## 기술 스택

- React 18 + TypeScript
- Vite (개발 서버 / 번들)
- Vitest (계산 로직 단위 테스트)
- 서버 / DB / 외부 API 없음

## 시작하기

```bash
npm install      # 의존성 설치
npm run dev      # 개발 서버 실행
npm test         # 계산 로직 단위 테스트
npm run build    # 프로덕션 빌드 (타입 체크 포함)
npm run preview  # 빌드 결과 미리보기
```

## 폴더 구조

```text
stock-average-calculator/
  ├─ src/
  │  ├─ App.tsx
  │  ├─ main.tsx
  │  ├─ components/      # Header, InputCard, NumberInput, ResultCard, ResultSummary, Disclaimer, ResetButton
  │  ├─ hooks/           # useAveragePriceCalculator
  │  ├─ utils/           # calculateAveragePrice, formatNumber, validateInput
  │  ├─ types/           # calculator
  │  └─ styles/          # theme.ts, global.css
  ├─ tests/
  │  └─ calculateAveragePrice.test.ts
  └─ README.md
```

## 핵심 계산 공식

```text
총 보유수량        = 보유 주식 수 + 추가 매수 수량
총 매입금액        = (기존 평균단가 × 보유 주식 수) + (현재가 × 추가 매수 수량)
추가 매수 후 평균단가 = 총 매입금액 / 총 보유수량
현재 평가금액      = 현재가 × 총 보유수량
예상 수익금        = 현재 평가금액 - 총 매입금액
예상 수익률        = (예상 수익금 / 총 매입금액) × 100
손익분기점         = 추가 매수 후 평균단가
```

## 유의사항

본 서비스는 투자 권유가 아닌 단순 계산 도구입니다.
수수료, 세금, 실제 체결가는 반영되지 않을 수 있습니다.
입력한 값은 사용자의 기기에서 계산되며 별도로 저장하지 않습니다.
