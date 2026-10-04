export function profileInitials(name: string, username: string): string {
  const trimmedName = name.trim();
  if (trimmedName) {
    const parts = trimmedName.split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      const first = parts[0]?.[0] ?? "";
      const last = parts[parts.length - 1]?.[0] ?? "";
      const initials = `${first}${last}`.toUpperCase();
      if (initials) {
        return initials;
      }
    }
    const fromSingle = trimmedName.slice(0, 2).toUpperCase();
    if (fromSingle) {
      return fromSingle;
    }
  }

  const trimmedUsername = username.trim();
  if (trimmedUsername) {
    return trimmedUsername.slice(0, 2).toUpperCase();
  }

  return "?";
}
