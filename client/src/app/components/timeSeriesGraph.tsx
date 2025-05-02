export default function TimeSeriesGraph() {
    return (
      <div className="relative h-80 bg-blue-50 rounded-xl border border-blue-100 p-6 overflow-hidden">
        {/* Ejes */}
        <div className="absolute bottom-6 left-16 right-6 h-px bg-gray-300"></div>
        <div className="absolute bottom-6 top-6 left-16 w-px bg-gray-300"></div>
        
        {/* Etiquetas de eje Y */}
        <div className="absolute bottom-4 left-6 text-xs text-gray-500">0</div>
        <div className="absolute bottom-[50%] left-6 text-xs text-gray-500">50</div>
        <div className="absolute top-4 left-6 text-xs text-gray-500">100</div>
        
        {/* Etiquetas de eje X */}
        <div className="absolute bottom-2 left-16 text-xs text-gray-500">Ene</div>
        <div className="absolute bottom-2 left-[25%] text-xs text-gray-500">Mar</div>
        <div className="absolute bottom-2 left-[50%] text-xs text-gray-500">Jun</div>
        <div className="absolute bottom-2 left-[75%] text-xs text-gray-500">Sep</div>
        <div className="absolute bottom-2 right-6 text-xs text-gray-500">Dic</div>
        
        {/* Línea de datos */}
        <svg 
          className="absolute bottom-6 left-16 right-6 top-6"
          viewBox="0 0 1000 500" 
          preserveAspectRatio="none"
        >
          {/* Líneas de cuadrícula */}
          <line x1="0" y1="125" x2="1000" y2="125" stroke="#e5e7eb" strokeDasharray="5,5" />
          <line x1="0" y1="250" x2="1000" y2="250" stroke="#e5e7eb" strokeDasharray="5,5" />
          <line x1="0" y1="375" x2="1000" y2="375" stroke="#e5e7eb" strokeDasharray="5,5" />
          <line x1="200" y1="0" x2="200" y2="500" stroke="#e5e7eb" strokeDasharray="5,5" />
          <line x1="400" y1="0" x2="400" y2="500" stroke="#e5e7eb" strokeDasharray="5,5" />
          <line x1="600" y1="0" x2="600" y2="500" stroke="#e5e7eb" strokeDasharray="5,5" />
          <line x1="800" y1="0" x2="800" y2="500" stroke="#e5e7eb" strokeDasharray="5,5" />
          
          {/* Línea de datos principal con muchos más puntos */}
          <path 
            d="M0,380 
               C10,378 20,375 30,372 
               S40,368 50,365 
               S60,360 70,355 
               S80,350 90,345 
               S100,340 110,335 
               S120,330 130,325 
               S140,320 150,315 
               S160,310 170,305 
               S180,300 190,295 
               S200,290 210,285 
               S220,270 230,255 
               S240,240 250,225 
               S260,210 270,200 
               S280,190 290,185 
               S300,180 310,180 
               S320,180 330,180 
               S340,180 350,180 
               S360,180 370,180 
               L370,180 
               C375,180 380,179 385,177 
               S390,172 395,168 
               S400,160 405,150 
               S410,140 415,130 
               S420,120 425,110 
               S430,100 435,95 
               S440,90 445,87 
               S450,85 455,83 
               S460,82 465,81 
               S470,80 475,80 
               L475,80 
               C480,80 485,80 490,80 
               S495,80 500,80 
               S505,80 510,80 
               S515,80 520,80 
               S525,80 530,80 
               S535,80 540,80 
               S545,78 550,75 
               S555,70 560,65 
               S565,60 570,56 
               S575,52 580,50 
               S585,48 590,47 
               S595,46 600,45 
               L600,45 
               C605,45 610,45 615,45 
               S620,45 625,45 
               S630,45 635,45 
               S640,45 645,45 
               S650,45 655,46 
               S660,47 665,48 
               S670,49 675,50 
               S680,52 685,55 
               S690,58 695,60 
               L695,60 
               C700,60 705,62 710,65 
               S715,70 720,80 
               S725,100 730,120 
               S735,150 740,170 
               S745,190 750,210 
               S755,230 760,240 
               S765,245 770,250 
               S775,255 780,260 
               S785,265 790,270 
               S795,275 800,280 
               S805,282 810,284 
               S815,286 820,288 
               S825,290 830,292 
               S835,294 840,296 
               S845,298 850,300 
               S855,305 860,310 
               S865,315 870,317 
               S875,319 880,320 
               S885,320 890,320 
               S895,318 900,315 
               S905,310 910,305 
               S915,300 920,295 
               S925,290 930,285 
               S935,280 940,275 
               S945,270 950,265 
               S955,260 960,255 
               S965,250 970,247 
               S975,244 980,242 
               S985,240 990,240 
               S995,240 1000,240" 
            fill="none" 
            stroke="#60a5fa" 
            strokeWidth="2.5"
          />
          
          {/* Más puntos pequeños a lo largo de la línea para darle más detalle */}
          <circle cx="50" cy="365" r="1.5" fill="#60a5fa" />
          <circle cx="100" cy="340" r="1.5" fill="#60a5fa" />
          <circle cx="150" cy="315" r="1.5" fill="#60a5fa" />
          <circle cx="200" cy="290" r="1.5" fill="#60a5fa" />
          <circle cx="250" cy="225" r="1.5" fill="#60a5fa" />
          <circle cx="300" cy="180" r="1.5" fill="#60a5fa" />
          <circle cx="350" cy="180" r="1.5" fill="#60a5fa" />
          <circle cx="400" cy="160" r="1.5" fill="#60a5fa" />
          <circle cx="450" cy="85" r="1.5" fill="#60a5fa" />
          <circle cx="500" cy="80" r="1.5" fill="#60a5fa" />
          <circle cx="550" cy="75" r="1.5" fill="#60a5fa" />
          <circle cx="600" cy="45" r="1.5" fill="#60a5fa" />
          <circle cx="650" cy="46" r="1.5" fill="#60a5fa" />
          <circle cx="700" cy="60" r="1.5" fill="#60a5fa" />
          <circle cx="750" cy="210" r="1.5" fill="#60a5fa" />
          <circle cx="800" cy="280" r="1.5" fill="#60a5fa" />
          <circle cx="850" cy="300" r="1.5" fill="#60a5fa" />
          <circle cx="900" cy="315" r="1.5" fill="#60a5fa" />
          <circle cx="950" cy="265" r="1.5" fill="#60a5fa" />
          <circle cx="1000" cy="240" r="1.5" fill="#60a5fa" />
          
          {/* Change points destacados */}
          <circle cx="250" cy="225" r="8" fill="#f87171" />
          <circle cx="475" cy="80" r="8" fill="#f87171" />
          <circle cx="600" cy="45" r="8" fill="#f87171" />
          <circle cx="695" cy="60" r="8" fill="#f87171" />
          <circle cx="850" cy="300" r="8" fill="#f87171" />
          
          {/* Etiquetas de change points */}
          <g>
            <rect x="230" y="175" width="40" height="20" rx="4" fill="#fee2e2" />
            <text x="250" y="189" textAnchor="middle" fill="#ef4444" fontSize="12" fontWeight="500">CP1</text>
          </g>
          <g>
            <rect x="455" y="30" width="40" height="20" rx="4" fill="#fee2e2" />
            <text x="475" y="44" textAnchor="middle" fill="#ef4444" fontSize="12" fontWeight="500">CP2</text>
          </g>
          <g>
            <rect x="580" y="15" width="40" height="20" rx="4" fill="#fee2e2" />
            <text x="600" y="29" textAnchor="middle" fill="#ef4444" fontSize="12" fontWeight="500">CP3</text>
          </g>
          <g>
            <rect x="675" y="30" width="40" height="20" rx="4" fill="#fee2e2" />
            <text x="695" y="44" textAnchor="middle" fill="#ef4444" fontSize="12" fontWeight="500">CP4</text>
          </g>
          <g>
            <rect x="830" y="250" width="40" height="20" rx="4" fill="#fee2e2" />
            <text x="850" y="264" textAnchor="middle" fill="#ef4444" fontSize="12" fontWeight="500">CP5</text>
          </g>
          
          {/* Áreas sombreadas para destacar regiones entre change points */}
          <path 
            d="M0,500 L0,380 C10,378 20,375 30,372 S40,368 50,365 S60,360 70,355 S80,350 90,345 S100,340 110,335 S120,330 130,325 S140,320 150,315 S160,310 170,305 S180,300 190,295 S200,290 210,285 S220,270 230,255 S240,240 250,225 L250,500 Z" 
            fill="rgba(96, 165, 250, 0.1)" 
          />
          <path 
            d="M250,500 L250,225 S260,210 270,200 S280,190 290,185 S300,180 310,180 S320,180 330,180 S340,180 350,180 S360,180 370,180 L370,180 C375,180 380,179 385,177 S390,172 395,168 S400,160 405,150 S410,140 415,130 S420,120 425,110 S430,100 435,95 S440,90 445,87 S450,85 455,83 S460,82 465,81 S470,80 475,80 L475,500 Z" 
            fill="rgba(147, 197, 253, 0.1)" 
          />
          <path 
            d="M475,500 L475,80 C480,80 485,80 490,80 S495,80 500,80 S505,80 510,80 S515,80 520,80 S525,80 530,80 S535,80 540,80 S545,78 550,75 S555,70 560,65 S565,60 570,56 S575,52 580,50 S585,48 590,47 S595,46 600,45 L600,500 Z" 
            fill="rgba(96, 165, 250, 0.1)" 
          />
          <path 
            d="M600,500 L600,45 C605,45 610,45 615,45 S620,45 625,45 S630,45 635,45 S640,45 645,45 S650,45 655,46 S660,47 665,48 S670,49 675,50 S680,52 685,55 S690,58 695,60 L695,500 Z" 
            fill="rgba(147, 197, 253, 0.1)" 
          />
          <path 
            d="M695,500 L695,60 C700,60 705,62 710,65 S715,70 720,80 S725,100 730,120 S735,150 740,170 S745,190 750,210 S755,230 760,240 S765,245 770,250 S775,255 780,260 S785,265 790,270 S795,275 800,280 S805,282 810,284 S815,286 820,288 S825,290 830,292 S835,294 840,296 S845,298 850,300 L850,500 Z" 
            fill="rgba(96, 165, 250, 0.1)" 
          />
          <path 
            d="M850,500 L850,300 S855,305 860,310 S865,315 870,317 S875,319 880,320 S885,320 890,320 S895,318 900,315 S905,310 910,305 S915,300 920,295 S925,290 930,285 S935,280 940,275 S945,270 950,265 S955,260 960,255 S965,250 970,247 S975,244 980,242 S985,240 990,240 S995,240 1000,240 L1000,500 Z" 
            fill="rgba(147, 197, 253, 0.1)" 
          />
        </svg>
        
        {/* Leyenda */}
        <div className="absolute top-4 right-6 bg-white bg-opacity-90 p-2 rounded-md border border-gray-100 flex items-center space-x-4">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-400 rounded-full mr-1.5"></div>
            <span className="text-xs text-gray-600">Datos</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-rose-400 rounded-full mr-1.5"></div>
            <span className="text-xs text-gray-600">Change Points</span>
          </div>
        </div>
      </div>
    )
  }