// 앱인토스 인앱 광고 설정.
//
// ⚠️ 실제 수익화하려면 아래 adGroupId를 앱인토스 콘솔에서 발급받은 값으로 교체하세요.
//    (콘솔 > 사업자/정산 등록 > 광고 그룹 생성 후 발급)
//    교체 전까지는 테스트 ID로 동작 확인만 가능하며 실제 수익은 발생하지 않습니다.
//    광고는 토스 앱(WebView) 안에서만 노출되고, 일반 브라우저/로컬에서는 표시되지 않습니다.

// 전면형(전체화면) 광고 그룹 ID. 현재는 앱인토스 공식 테스트 ID.
export const INTERSTITIAL_AD_GROUP_ID = 'ait-ad-test-interstitial-id';

// 전면 광고 노출 빈도: N회 계산마다 1번 노출 (과도한 노출 방지 — 토스 정책 준수).
export const INTERSTITIAL_FREQUENCY = 3;
