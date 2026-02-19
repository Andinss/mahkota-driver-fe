interface AvatarProps {
  src?: string;
  alt?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeStyles: Record<"sm" | "md" | "lg", string> = {
  sm: "size-8",
  md: "size-9",
  lg: "size-10",
};

export const Avatar = ({ src, alt = "Avatar", size = "md", className = "" }: AvatarProps) => {
  return (
    <div
      className={`${sizeStyles[size]} rounded-full bg-slate-200 dark:bg-slate-700 bg-cover bg-center ${className}`}
      data-alt={alt}
      style={src ? { backgroundImage: `url("${src}")` } : undefined}
    />
  );
};
