import { Button } from "@/components/ui/button";

interface MonitoringHeaderProps {
  title: string;
  location: string;
  buttonText?: string;
  buttonIcon?: string;
  onButtonClick?: () => void;
}

export const MonitoringHeader = ({
  title,
  location,
  buttonText,
  buttonIcon,
  onButtonClick,
}: MonitoringHeaderProps) => {
  return (
    <div className="flex flex-wrap justify-between items-end gap-4 pb-2">
      <div className="flex flex-col gap-1">
        <h1 className="text-[#0d141b] dark:text-white text-3xl lg:text-4xl font-black leading-tight tracking-[-0.033em]">
          {title}
        </h1>
        <div className="flex items-center gap-2 text-[#4c739a] dark:text-slate-400">
          <span className="material-symbols-outlined text-[18px]">location_on</span>
          <p className="text-base font-normal">{location}</p>
        </div>
      </div>
      {buttonText && (
        <Button icon={buttonIcon || "navigation"} onClick={onButtonClick}>
          {buttonText}
        </Button>
      )}
    </div>
  );
};