// 앱인토스 인앱 광고 SDK 런타임 로더.
//
// 앱인토스 SDK(@apps-in-toss/web-framework)는 토스 런타임/공식 빌드 환경에서만 제공된다.
// 이 프로젝트의 표준 Vite 빌드에 SDK를 직접 번들하면 토스 전용 빌드 툴체인
// (granite/mpack 등)까지 끌려와 빌드가 깨지므로, 정적 분석이 안 되는 동적 import로
// "런타임에만" 로드한다. 토스가 아닌 환경(일반 브라우저/로컬)에서는 로드가 실패하고
// 모든 광고 동작이 안전하게 no-op 처리된다.

// SDK 광고 API의 최소 타입 (공식 @apps-in-toss/types 정의를 그대로 반영).
type LoadFullScreenAdEvent = { type: 'loaded' };

type ShowFullScreenAdEvent =
  | { type: 'requested' }
  | { type: 'show' }
  | { type: 'impression' }
  | { type: 'clicked' }
  | { type: 'dismissed' }
  | { type: 'failedToShow' }
  | { type: 'userEarnedReward'; data: { unitType: string; unitAmount: number } };

interface FullScreenAdParams<E> {
  options: { adGroupId: string };
  onEvent: (data: E) => void;
  onError: (err: unknown) => void;
}

type AdFunction<E> = ((params: FullScreenAdParams<E>) => () => void) & {
  isSupported: () => boolean;
};

export type AppsInTossAdSdk = {
  loadFullScreenAd: AdFunction<LoadFullScreenAdEvent>;
  showFullScreenAd: AdFunction<ShowFullScreenAdEvent>;
};

let cached: AppsInTossAdSdk | null | undefined;

/**
 * 앱인토스 광고 SDK를 런타임에 로드한다.
 * 토스 환경이 아니면 null을 반환하며, 결과는 캐시된다.
 */
export async function loadAppsInTossAdSdk(): Promise<AppsInTossAdSdk | null> {
  if (cached !== undefined) return cached;
  try {
    // 변수 specifier + @vite-ignore 로 번들러가 이 모듈을 정적으로 해석/포함하지 않게 한다.
    const moduleName = '@apps-in-toss/web-framework';
    const mod = await import(/* @vite-ignore */ moduleName);
    cached =
      mod && typeof mod.loadFullScreenAd === 'function'
        ? (mod as AppsInTossAdSdk)
        : null;
  } catch {
    cached = null;
  }
  return cached;
}
