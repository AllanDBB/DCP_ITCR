import React from "react";

interface ContributionMethodProps {
  title: string;
  description: string;
  bgColorClass: string;
  iconColorClass: string;
  icon: React.ReactNode;
}

export default function ContributionMethod({
  title,
  description,
  bgColorClass,
  iconColorClass,
  icon
}: ContributionMethodProps) {
  return (
    <div className={`p-4 rounded-xl ${bgColorClass}`}>
      <div className="flex items-start">
        <div className={`mr-3 ${iconColorClass}`}>
          {icon}
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-800">{title}</h3>
          <p className="mt-1 text-xs text-gray-600">{description}</p>
        </div>
      </div>
    </div>
  );
}