import * as React from "react";

import { cn } from "./utils";

function Avatar({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="avatar"
      className={cn("relative flex size-10 shrink-0 overflow-hidden rounded-full", className)}
      {...props}
    >
      {children}
    </div>
  );
}

function AvatarImage({
  className,
  alt = "",
  ...props
}: React.ImgHTMLAttributes<HTMLImageElement>) {
  return (
    <img
      data-slot="avatar-image"
      alt={alt}
      className={cn("aspect-square size-full object-cover", className)}
      {...props}
    />
  );
}

function AvatarFallback({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="avatar-fallback"
      className={cn("bg-muted flex size-full items-center justify-center rounded-full", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export { Avatar, AvatarImage, AvatarFallback };
