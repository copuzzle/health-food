export function LoadingLabel({ children }: { children: string }) {
  return (
    <span className="inline-flex items-center justify-center gap-2">
      <span
        aria-hidden="true"
        className="h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent"
      />
      {children}
    </span>
  );
}
