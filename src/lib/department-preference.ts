import {departments, type DepartmentId} from '@/config/site';

const validIds = new Set<string>(departments.map((department) => department.id));

/** Optional expression of interest, never a confirmed department assignment. */
export function parseDepartmentPreference(value: unknown): DepartmentId[] | null {
  if (value === undefined) return [];
  if (!Array.isArray(value) || value.length > 1) return null;
  if (value.length === 0) return [];
  return typeof value[0] === 'string' && validIds.has(value[0]) ? [value[0] as DepartmentId] : null;
}

/** Preserve the first valid interest from older ranked browser drafts. */
export function restoreDepartmentPreference(value: unknown): DepartmentId[] {
  if (!Array.isArray(value)) return [];
  const first = value.find((id) => typeof id === 'string' && validIds.has(id));
  return first ? [first as DepartmentId] : [];
}
