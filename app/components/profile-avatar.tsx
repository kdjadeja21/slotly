import { profileInitials } from "@/lib/profile-initials";

const sizes = {
  md: "h-16 w-16 text-xl",
  xl: "h-28 w-28 text-4xl",
} as const;

export function ProfileAvatar({
  src,
  name,
  username,
  size,
}: {
  src: string | null;
  name: string;
  username: string;
  size: keyof typeof sizes;
}) {
  const dimension = sizes[size];
  if (src) {
    return (
      // User uploads are served from this app and change with a query string.
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={`${name || username} profile picture`}
        className={`${dimension} rounded-full object-cover ring-4 ring-paper`}
      />
    );
  }

  return (
    <span
      className={`${dimension} inline-flex items-center justify-center rounded-full bg-accent font-display text-accent-ink ring-4 ring-paper`}
      aria-hidden="true"
    >
      {profileInitials(name, username)}
    </span>
  );
}
