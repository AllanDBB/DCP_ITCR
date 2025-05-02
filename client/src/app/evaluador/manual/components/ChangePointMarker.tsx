export default function ChangePointMarker({ x, y, label, onDelete }) {
    return (
      <g>
        <circle 
          cx={x} 
          cy={y} 
          r="6" 
          fill="#f87171" 
          onClick={onDelete}
          className="cursor-pointer hover:fill-red-600"
        />
        <text 
          x={x} 
          y={y - 10} 
          textAnchor="middle" 
          fill="#ef4444" 
          fontSize="10"
        >
          {label}
        </text>
      </g>
    );
  }