import Image from "next/image";
import { profileInitials } from "@/lib/profile-initials";

const sizeClasses = {
  md: "h-16 w-16 text-lg",
  lg: "h-24 w-24 text-2xl",
  xl: "h-28 w-28 text-3xl",
} as const;

export function ProfileAvatar({
  src,
  name,
  username,
  size = "lg",
  className = "",
}: {
  src: string | null;
  name: string;
  username: string;
  size?: keyof typeof sizeClasses;
  className?: string;
}) {
  const initials = profileInitials(name, username);
  const sizeClass = sizeClasses[size];

  if (src) {
    return (
      <Image
        src={src}
        alt=""
        width={112}
        height={112}
        unoptimized
        className={`${sizeClass} shrink-0 rounded-full object-cover ${className}`}
      />
    );
  }

  return (
    <div
      aria-hidden
      className={`${sizeClass} flex shrink-0 items-center justify-center rounded-full bg-zinc-200 font-semibold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 ${className}`}
    >
      {initials}
    </div>
  );
}
