// Algeria uses UTC+01:00 year-round. Keep one deadline for the UI and API.
export const recruitmentClosesAt = '2026-10-31T23:59:00+01:00';
export const recruitmentDeadlineLabel = '31 October 2026 · 23:59 (Algiers)';
export const recruitmentDeadline = Date.parse(recruitmentClosesAt);
export function isRecruitmentClosed(now = Date.now()) {
  return now >= recruitmentDeadline;
}
export function getRemainingTime(now: number) {
  const seconds = Math.max(0, Math.floor((recruitmentDeadline - now) / 1000));
  return {
    days: Math.floor(seconds / 86400),
    hours: Math.floor(seconds / 3600) % 24,
    minutes: Math.floor(seconds / 60) % 60,
    seconds: seconds % 60,
  };
}
