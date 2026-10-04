import {
  listTimezoneGroups,
  timezoneAppearsInGroups,
} from "@/lib/timezones";
import { controlClassName } from "@/app/components/form-controls";

export function TimezoneSelect({
  id,
  name = "timezone",
  defaultValue = "",
}: {
  id: string;
  name?: string;
  defaultValue?: string;
}) {
  const groups = listTimezoneGroups();
  const showSavedValue =
    defaultValue !== "" && !timezoneAppearsInGroups(defaultValue, groups);

  return (
    <select
      id={id}
      name={name}
      defaultValue={defaultValue}
      className={controlClassName}
    >
      <option value="">Select a timezone</option>
      {showSavedValue ? (
        <option value={defaultValue}>{defaultValue}</option>
      ) : null}
      {groups.map((group) => (
        <optgroup key={group.region} label={group.region}>
          {group.zones.map((zone) => (
            <option key={zone} value={zone}>
              {zone}
            </option>
          ))}
        </optgroup>
      ))}
    </select>
  );
}
