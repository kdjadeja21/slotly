"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { ProfileAvatar } from "@/app/components/profile-avatar";

const accept = "image/jpeg,image/png,image/webp,image/gif";

export function PictureField({
  inputId,
  name = "picture",
  existingSrc,
  displayName,
  username,
}: {
  inputId: string;
  name?: string;
  existingSrc?: string | null;
  displayName: string;
  username: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const shownSrc = previewUrl ?? existingSrc ?? null;

  function onFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      setFileName(null);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      setPreviewUrl(null);
      return;
    }

    setFileName(file.name);
    const nextUrl = URL.createObjectURL(file);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(nextUrl);
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-4">
        {shownSrc ? (
          <Image
            src={shownSrc}
            alt=""
            width={96}
            height={96}
            unoptimized
            className="h-24 w-24 shrink-0 rounded-full object-cover"
          />
        ) : (
          <ProfileAvatar
            src={null}
            name={displayName}
            username={username}
            size="lg"
          />
        )}
        <div className="flex min-w-0 flex-col gap-2">
          <input
            ref={inputRef}
            id={inputId}
            name={name}
            type="file"
            accept={accept}
            className="sr-only"
            onChange={onFileChange}
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="inline-flex h-10 w-fit items-center justify-center rounded-full border border-black/10 px-4 text-sm font-medium transition-colors hover:bg-black/[.04] dark:border-white/15 dark:hover:bg-white/[.06]"
          >
            Choose picture
          </button>
          {fileName ? (
            <p className="truncate text-sm text-zinc-600 dark:text-zinc-400">
              {fileName}
            </p>
          ) : (
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              JPEG, PNG, WebP, or GIF. Max 1 MB.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
