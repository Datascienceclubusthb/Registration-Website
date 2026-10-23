import {departments, type DepartmentId} from '@/config/site';
const validIds = new Set<string>(departments.map((d) => d.id));
/** Ranked interests only, never a confirmed department assignment. */
export function parseDepartmentPreference(value: unknown): DepartmentId[] | null {
  if (value === undefined) return [];
  if (!Array.isArray(value) || value.length > 3 || new Set(value).size !== value.length)
    return null;
  return value.every((id) => typeof id === 'string' && validIds.has(id))
    ? (value as DepartmentId[])
    : null;
}
export function restoreDepartmentPreference(value: unknown): DepartmentId[] {
  if (!Array.isArray(value)) return [];
  return [
    ...new Set(
      value.filter((id): id is DepartmentId => typeof id === 'string' && validIds.has(id))
    ),
  ].slice(0, 3);
}
