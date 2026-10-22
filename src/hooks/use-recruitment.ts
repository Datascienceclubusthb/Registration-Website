'use client';
import {useEffect, useState} from 'react';
import {getRemainingTime, isRecruitmentClosed} from '@/lib/recruitment';
export function useRecruitment() {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    const tick = () => setNow(Date.now());
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, []);
  return {
    closed: now !== null && isRecruitmentClosed(now),
    remaining: now === null ? null : getRemainingTime(now),
  };
}
