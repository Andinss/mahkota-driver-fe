interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export const Breadcrumbs = ({ items }: BreadcrumbsProps) => {
  return (
    <div className="flex flex-wrap gap-2 text-sm">
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          {item.href ? (
            <a
              className="text-[#617589] dark:text-[#94a3b8] font-medium hover:text-primary transition-colors"
              href={item.href}
            >
              {item.label}
            </a>
          ) : (
            <span className="text-[#111418] dark:text-white font-medium">
              {item.label}
            </span>
          )}
          {index < items.length - 1 && (
            <span className="text-[#617589] dark:text-[#94a3b8] font-medium">
              /
            </span>
          )}
        </div>
      ))}
    </div>
  );
};
