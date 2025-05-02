interface StepCardProps {
    number: number;
    title: string;
    description: string;
  }
  
  export default function StepCard({ number, title, description }: StepCardProps) {
    return (
      <div className="text-center">
        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
          <span className="text-xl font-bold text-blue-400">{number}</span>
        </div>
        <h3 className="text-lg font-semibold text-gray-600 mb-2">{title}</h3>
        <p className="text-sm text-gray-600">
          {description}
        </p>
      </div>
    )
  }