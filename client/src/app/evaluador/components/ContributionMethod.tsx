import { ReactNode } from "react";

interface ContributionMethodProps {
  title: string;
  description: string;
  icon: ReactNode;
  bgColorClass: string;
  iconColorClass: string;
}

export default function ContributionMethod({
  title,
  description,
  icon,
  bgColorClass,
  iconColorClass
}: ContributionMethodProps) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className={`h-16 w-16 rounded-full ${bgColorClass} flex items-center justify-center mb-3`}>
        {icon}
      </div>
      <h4 className="font-medium text-gray-700 mb-1">{title}</h4>
      <p className="text-sm text-gray-600">
        {description}
      </p>
    </div>
  );
}