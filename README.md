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
  │  ├─ hooks/           # useAveragePriceCalculator, useInterstitialAd
  │  ├─ utils/           # calculateAveragePrice, formatNumber, validateInput
  │  ├─ ads/             # adConfig, appsInTossSdk (앱인토스 인앱 광고 연동)
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

## 인앱 광고 (수익화)

앱인토스 인앱 광고(전면형)를 연동했습니다. 계산하기를 일정 횟수(기본 3회)마다 한 번 전면 광고를 노출합니다.

- 광고 로직: `src/hooks/useInterstitialAd.ts`, SDK 로더: `src/ads/appsInTossSdk.ts`, 설정: `src/ads/adConfig.ts`
- 광고는 **토스 앱(WebView) 런타임에서만** 노출됩니다. 일반 브라우저/로컬에서는 `isSupported()` 가드로 자동 비활성화(no-op)되어 개발에 영향이 없습니다.
- 실제 수익화하려면 앱인토스 콘솔에서 **사업자/정산 정보 등록 → 광고 그룹 생성 → adGroupId 발급** 후, `src/ads/adConfig.ts`의 `INTERSTITIAL_AD_GROUP_ID`(현재 테스트 ID)를 발급받은 값으로 교체하세요.
- 노출 빈도는 `adConfig.ts`의 `INTERSTITIAL_FREQUENCY`로 조정합니다. (과도한 노출은 토스 정책 위반 소지)

## 빌드 참고 (rollup → WASM)

`package.json`의 `overrides`로 rollup을 `@rollup/wasm-node`(WASM 빌드)로 고정했습니다.
일부 Windows 환경에서 rollup 네이티브 바이너리가 프로덕션 빌드 중 비정상 종료(`0xC0000409`)하는 문제를 우회하기 위함이며, 빌드 결과물은 동일합니다(빌드가 약간 느려질 수 있음).

## 유의사항

본 서비스는 투자 권유가 아닌 단순 계산 도구입니다.
수수료, 세금, 실제 체결가는 반영되지 않을 수 있습니다.
입력한 값은 사용자의 기기에서 계산되며 별도로 저장하지 않습니다.
