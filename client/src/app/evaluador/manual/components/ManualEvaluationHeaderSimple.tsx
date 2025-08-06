import React from "react";

interface Props {
  datasetName?: string;
  description?: string;
  expectedChangePoints?: number;
  currentChangePoints?: number;
  user?: any;
  onBack?: () => void;
}

export default function ManualEvaluationHeaderSimple(props: Props) {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-sky-50 border-b border-blue-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h1 className="text-2xl font-bold">{props.datasetName || "Evaluación Manual"}</h1>
        <p>{props.description || "Descripción no disponible"}</p>
      </div>
    </div>
  );
}
