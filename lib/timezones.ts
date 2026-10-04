export type TimezoneGroup = {
  region: string;
  zones: string[];
};

export function listTimezoneGroups(): TimezoneGroup[] {
  let zones: string[];
  try {
    zones = Intl.supportedValuesOf("timeZone");
  } catch {
    zones = ["UTC"];
  }

  const groups = new Map<string, string[]>();
  for (const zone of zones) {
    const region = zone.includes("/") ? zone.split("/")[0]! : "Other";
    const list = groups.get(region) ?? [];
    list.push(zone);
    groups.set(region, list);
  }

  return [...groups.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([region, zoneList]) => ({
      region,
      zones: zoneList.sort((a, b) => a.localeCompare(b)),
    }));
}

export function timezoneAppearsInGroups(
  value: string,
  groups: TimezoneGroup[],
): boolean {
  if (!value) {
    return true;
  }
  return groups.some((group) => group.zones.includes(value));
}
