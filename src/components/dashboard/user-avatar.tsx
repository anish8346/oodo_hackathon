type UserAvatarProps = {
  image?: string | null;
  name?: string | null;
  email?: string | null;
  size?: "sm" | "lg";
};

const sizeClass = {
  sm: "h-10 w-10 text-base",
  lg: "h-16 w-16 text-2xl",
};

export function UserAvatar({ image, name, email, size = "sm" }: UserAvatarProps) {
  const initial = (name?.trim()[0] || email?.trim()[0] || "U").toUpperCase();

  return (
    <div
      className={`flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-zinc-950 font-semibold text-white ${sizeClass[size]}`}
    >
      {image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={image} alt="" className="h-full w-full object-cover" />
      ) : (
        initial
      )}
    </div>
  );
}
