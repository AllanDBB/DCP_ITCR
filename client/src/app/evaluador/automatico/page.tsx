import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Evaluador Automático - DCP ITCR',
  description: 'Herramienta de evaluación automática de change points',
};

export default function EvaluadorAutomaticoPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Evaluador Automático</h1>
      <p className="text-gray-600">Esta funcionalidad estará disponible próximamente.</p>
    </div>
  );
}