import type { HTMLAttributes, ImgHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type AvatarProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

export function Avatar({ className, children, ...props }: AvatarProps) {
  return (
    <div
      className={cn(
        "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full bg-slate-200",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function AvatarImage({ className, alt = "", ...props }: ImgHTMLAttributes<HTMLImageElement>) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img alt={alt} className={cn("absolute inset-0 h-full w-full object-cover", className)} {...props} />
  );
}

export function AvatarFallback({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement> & { children: ReactNode }) {
  return (
    <div
      className={cn(
        "flex h-full w-full items-center justify-center bg-slate-900 text-sm font-semibold text-white",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
