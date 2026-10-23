'use client';
import {useEffect, useState} from 'react';
import {getRemainingTime, isRecruitmentClosed} from '@/lib/recruitment';
export function useRecruitment() {
  const [now, setNow] = useState<number | null>(null);
  const [enabled, setEnabled] = useState<boolean | null>(null);
  const [unavailable, setUnavailable] = useState(false);
  useEffect(() => {
    let active = true;
    const controller = new AbortController();
    const tick = () => setNow(Date.now());
    tick();
    const timer = setInterval(tick, 1000);
    async function refresh() {
      try {
        const r = await fetch('/api/recruitment', {cache: 'no-store', signal: controller.signal});
        if (!r.ok) throw Error();
        const data = await r.json();
        if (typeof data.enabled !== 'boolean') throw Error();
        if (active) {
          setEnabled(data.enabled);
          setUnavailable(false);
        }
      } catch {
        if (active) setUnavailable(true);
      }
    }
    void refresh();
    const poll = setInterval(refresh, 60000);
    window.addEventListener('focus', refresh);
    return () => {
      active = false;
      controller.abort();
      clearInterval(timer);
      clearInterval(poll);
      window.removeEventListener('focus', refresh);
    };
  }, []);
  const expired = now !== null && isRecruitmentClosed(now);
  return {
    closed: expired || enabled === false,
    expired,
    checking: enabled === null && !unavailable,
    unavailable,
    remaining: now === null ? null : getRemainingTime(now),
  };
}
