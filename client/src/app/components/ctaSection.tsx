import Link from "next/link";

interface CTASectionProps {
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
}

export default function CTASection({ title, description, buttonText, buttonLink }: CTASectionProps) {
  return (
    <section className="bg-blue-100 px-4 sm:px-6 md:px-8 py-16 text-center border-t border-blue-200">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-600 mb-6">{title}</h2>
        <p className="mb-8 text-blue-600">
          {description}
        </p>
        <Link href={buttonLink} className="inline-block bg-blue-400 text-white hover:bg-blue-500 transition-colors px-6 py-3 rounded-lg font-medium shadow-sm">
          {buttonText}
        </Link>
      </div>
    </section>
  )
}