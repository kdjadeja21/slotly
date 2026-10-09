"use client";

import {
  forwardRef,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { ProfileAvatar } from "@/app/components/profile-avatar";

const accept = "image/jpeg,image/png,image/webp,image/gif";

function assignFile(input: HTMLInputElement, file: File | null) {
  if (!file) {
    input.value = "";
    return;
  }
  const transfer = new DataTransfer();
  transfer.items.add(file);
  input.files = transfer.files;
}

export type PictureFieldHandle = {
  syncFileInput: () => void;
};

export const PictureField = forwardRef<
  PictureFieldHandle,
  {
    inputId: string;
    name?: string;
    existingSrc?: string | null;
    displayName: string;
    username: string;
  }
>(function PictureField(
  { inputId, name = "picture", existingSrc, displayName, username },
  ref,
) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const shownSrc = selectedFile ? previewUrl : (existingSrc ?? null);

  useImperativeHandle(
    ref,
    () => ({
      syncFileInput: () => {
        const input = inputRef.current;
        if (input) {
          assignFile(input, selectedFile);
        }
      },
    }),
    [selectedFile],
  );

  useLayoutEffect(() => {
    const input = inputRef.current;
    if (input) {
      assignFile(input, selectedFile);
    }
  }, [selectedFile]);

  function chooseFile(file: File | null) {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(file);
    setFileName(file?.name ?? null);
    setPreviewUrl(file ? URL.createObjectURL(file) : null);
  }

  return (
    <div className="flex items-center gap-4">
      <ProfileAvatar
        src={shownSrc}
        name={displayName}
        username={username || "you"}
        size="md"
      />
      <div className="flex min-w-0 flex-col items-start gap-2">
        <input
          ref={inputRef}
          id={inputId}
          name={name}
          type="file"
          accept={accept}
          className="sr-only"
          onChange={(event) => {
            chooseFile(event.target.files?.[0] ?? null);
          }}
        />
        <label
          htmlFor={inputId}
          className="inline-flex h-10 cursor-pointer items-center rounded-full border border-line bg-paper px-4 text-sm font-medium text-ink transition hover:border-accent/50"
        >
          Choose picture
        </label>
        <p className="truncate text-sm text-muted">
          {fileName ?? "JPEG, PNG, WebP, or GIF. Up to 2 MB."}
        </p>
      </div>
    </div>
  );
});
