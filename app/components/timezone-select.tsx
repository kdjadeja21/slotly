import { controlClassName } from "@/app/components/form-controls";

export type TimezoneGroup = {
  region: string;
  zones: string[];
};

export function TimezoneSelect({
  id,
  defaultValue,
  describedBy,
  invalid,
  groups,
}: {
  id: string;
  defaultValue: string;
  describedBy?: string;
  invalid?: boolean;
  groups: TimezoneGroup[];
}) {
  const known = groups.some((group) => group.zones.includes(defaultValue));
  const extra = defaultValue && !known ? defaultValue : null;

  return (
    <select
      id={id}
      name="timezone"
      defaultValue={defaultValue}
      aria-invalid={invalid || undefined}
      aria-describedby={describedBy}
      className={controlClassName}
    >
      <option value="">Select a timezone</option>
      {extra ? <option value={extra}>{extra}</option> : null}
      {groups.map((group) => (
        <optgroup key={group.region} label={group.region}>
          {group.zones.map((zone) => (
            <option key={zone} value={zone}>
              {zone.replaceAll("_", " ")}
            </option>
          ))}
        </optgroup>
      ))}
    </select>
  );
}
