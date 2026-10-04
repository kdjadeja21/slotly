export function listTimezones(): string[] {
  return Intl.supportedValuesOf("timeZone");
}

export function isTimezone(value: string): boolean {
  return value === "" || listTimezones().includes(value);
}

export function timezoneGroups(): { region: string; zones: string[] }[] {
  const groups = new Map<string, string[]>();
  for (const zone of listTimezones()) {
    const slash = zone.indexOf("/");
    const region = slash === -1 ? "Other" : zone.slice(0, slash);
    const zones = groups.get(region) ?? [];
    zones.push(zone);
    groups.set(region, zones);
  }

  return [...groups.entries()].map(([region, zones]) => ({ region, zones }));
}

export function timezoneErrorMessage(): string {
  return "Choose a timezone from the list.";
}
