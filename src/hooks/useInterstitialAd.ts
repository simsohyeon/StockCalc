import { useCallback, useEffect, useRef } from 'react';
import { loadAppsInTossAdSdk, type AppsInTossAdSdk } from '../ads/appsInTossSdk';
import { INTERSTITIAL_AD_GROUP_ID } from '../ads/adConfig';

// 토스 런타임에서만 광고가 지원된다. 그 외 환경에서는 모두 안전하게 false/no-op.
function isSupported(sdk: AppsInTossAdSdk | null): sdk is AppsInTossAdSdk {
  if (!sdk) return false;
  try {
    return sdk.loadFullScreenAd.isSupported() && sdk.showFullScreenAd.isSupported();
  } catch {
    return false;
  }
}

/**
 * 전면형(전체화면) 광고 훅.
 *
 * 동작 흐름: SDK 로드 → 미리 로드(preload) → 로드 완료 대기 → show() 호출 시 노출 →
 * 닫히면 다음 광고 미리 로드. 광고가 지원되지 않는 환경에서는 모든 동작이 no-op.
 */
export function useInterstitialAd() {
  const sdkRef = useRef<AppsInTossAdSdk | null>(null);
  const loadedRef = useRef(false); // 광고가 로드 완료되어 노출 가능한 상태인지
  const cleanupRef = useRef<(() => void) | null>(null);

  const preload = useCallback(() => {
    const sdk = sdkRef.current;
    if (!isSupported(sdk) || loadedRef.current) return;
    cleanupRef.current = sdk.loadFullScreenAd({
      options: { adGroupId: INTERSTITIAL_AD_GROUP_ID },
      onEvent: (event) => {
        if (event.type === 'loaded') loadedRef.current = true;
      },
      onError: () => {
        loadedRef.current = false;
      },
    });
  }, []);

  // 마운트 시 SDK를 로드하고 첫 광고를 미리 받아 둔다.
  useEffect(() => {
    let active = true;
    loadAppsInTossAdSdk().then((sdk) => {
      if (!active) return;
      sdkRef.current = sdk;
      preload();
    });
    return () => {
      active = false;
      cleanupRef.current?.();
    };
  }, [preload]);

  /** 로드된 광고가 있으면 노출한다. 없으면 조용히 넘어가고 다음 광고를 준비한다. */
  const show = useCallback(() => {
    const sdk = sdkRef.current;
    if (!isSupported(sdk)) return;
    if (!loadedRef.current) {
      preload();
      return;
    }
    loadedRef.current = false;
    sdk.showFullScreenAd({
      options: { adGroupId: INTERSTITIAL_AD_GROUP_ID },
      onEvent: (event) => {
        // 광고가 닫히거나 노출 실패하면 다음 광고를 미리 로드한다.
        if (event.type === 'dismissed' || event.type === 'failedToShow') {
          preload();
        }
      },
      onError: () => {
        preload();
      },
    });
  }, [preload]);

  return { show };
}
