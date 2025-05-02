interface SectionHeaderProps {
    title: string;
    description?: string;
  }
  
  export default function SectionHeader({ title, description }: SectionHeaderProps) {
    return (
      <div className="text-center mb-12">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-600">{title}</h2>
        {description && (
          <p className="mt-4 text-gray-600 max-w-3xl mx-auto">
            {description}
          </p>
        )}
      </div>
    )
  }