
interface GraphPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function GraphPagination({ currentPage, totalPages, onPageChange }: GraphPaginationProps) {
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };
  
    return (
      <div className="flex items-center space-x-1">
        <button
          onClick={() => goToPage(1)}
          disabled={currentPage === 1}
          className={`px-2 py-1 rounded text-xs ${
            currentPage === 1 
              ? 'text-gray-400 cursor-not-allowed' 
              : 'text-blue-600 hover:bg-blue-50'
          }`}
        >
          <span className="sr-only">Primera página</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
        </button>
        
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-2 py-1 rounded text-xs ${
            currentPage === 1 
              ? 'text-gray-400 cursor-not-allowed' 
              : 'text-blue-600 hover:bg-blue-50'
          }`}
        >
          <span className="sr-only">Página anterior</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <span className="px-3 py-1 text-sm text-gray-700">
          {currentPage} de {totalPages}
        </span>
        
        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-2 py-1 rounded text-xs ${
            currentPage === totalPages 
              ? 'text-gray-400 cursor-not-allowed' 
              : 'text-blue-600 hover:bg-blue-50'
          }`}
        >
          <span className="sr-only">Siguiente página</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
        
        <button
          onClick={() => goToPage(totalPages)}
          disabled={currentPage === totalPages}
          className={`px-2 py-1 rounded text-xs ${
            currentPage === totalPages 
              ? 'text-gray-400 cursor-not-allowed' 
              : 'text-blue-600 hover:bg-blue-50'
          }`}
        >
          <span className="sr-only">Última página</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    );
  }