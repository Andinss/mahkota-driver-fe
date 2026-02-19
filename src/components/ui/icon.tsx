interface IconProps {
  name: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  color?: string;
}

const sizeStyles: Record<"sm" | "md" | "lg", string> = {
  sm: "text-[16px]",
  md: "text-[20px]",
  lg: "text-[24px]",
};

export const Icon = ({ name, size = "md", className = "", color = "" }: IconProps) => {
  return (
    <span className={`material-symbols-outlined ${sizeStyles[size]} ${color} ${className}`}>
      {name}
    </span>
  );
};
