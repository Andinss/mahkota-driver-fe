import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface PageHeaderProps {
  title: string;
  description: string;
  buttonText?: string;
  buttonHref?: string;
}

export const PageHeader = ({
  title,
  description,
  buttonText,
  buttonHref,
}: PageHeaderProps) => {
  const router = useRouter();

  const handleClick = () => {
    if (buttonHref) {
      router.push(buttonHref);
    }
  };

  return (
    <div className="flex flex-wrap justify-between items-end gap-4">
      <div className="flex flex-col gap-1">
        <h1 className="text-[#111418] dark:text-white text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em]">
          {title}
        </h1>
        <p className="text-[#617589] dark:text-[#94a3b8] text-base font-normal">
          {description}
        </p>
      </div>
      {buttonText && buttonHref && (
        <Button icon="add" onClick={handleClick}>
          {buttonText}
        </Button>
      )}
    </div>
  );
};
