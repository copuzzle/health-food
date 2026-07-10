"use client";

import { useFormStatus } from "react-dom";
import { LoadingLabel } from "@/components/loading-label";

export function AsyncSubmitButton({
  disabled = false,
  idleLabel,
  pendingLabel,
  className,
}: {
  disabled?: boolean;
  idleLabel: string;
  pendingLabel: string;
  className: string;
}) {
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={disabled || pending} className={className} aria-busy={pending}>
      {pending ? <LoadingLabel>{pendingLabel}</LoadingLabel> : idleLabel}
    </button>
  );
}
