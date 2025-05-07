
import { useState, useRef, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut, 
  Maximize, 
  ChevronDown
} from "lucide-react";
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { cn } from '@/lib/utils';

// Set the worker source
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

interface PDFViewerProps {
  pdfUrl: string;
  onComplete?: () => void;
}

export default function PDFViewer({ pdfUrl, onComplete }: PDFViewerProps) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [scale, setScale] = useState<number>(1.4); // Increased default scale
  const [fullscreen, setFullscreen] = useState<boolean>(false);
  const [presentationMode, setPresentationMode] = useState<boolean>(false);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  
  const containerRef = useRef<HTMLDivElement>(null);
  const pdfContainerRef = useRef<HTMLDivElement>(null);

  // Calculate available space for the PDF view
  useEffect(() => {
    const handleResize = () => {
      if (pdfContainerRef.current) {
        const { width, height } = pdfContainerRef.current.getBoundingClientRect();
        setDimensions({ width, height });
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [presentationMode]);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setLoading(false);
  }

  function onDocumentLoadError(error: Error) {
    setError(`Error loading PDF: ${error.message}`);
    setLoading(false);
  }

  function changePage(offset: number) {
    const newPage = pageNumber + offset;
    if (newPage >= 1 && newPage <= (numPages || 1)) {
      setPageNumber(newPage);
    }

    // If we've reached the last page, call onComplete
    if (newPage === numPages && onComplete) {
      onComplete();
    }
  }
  
  function zoomIn() {
    setScale(prevScale => Math.min(prevScale + 0.2, 3));
  }
  
  function zoomOut() {
    setScale(prevScale => Math.max(prevScale - 0.2, 0.6));
  }
  
  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setFullscreen(true);
    } else {
      document.exitFullscreen();
      setFullscreen(false);
    }
  }

  function togglePresentationMode() {
    setPresentationMode(!presentationMode);
    if (!presentationMode) {
      setScale(1.6); // Larger scale in presentation mode
    } else {
      setScale(1.4); // Back to default when exiting presentation mode
    }
  }
  
  // Calculate page progress
  const progress = numPages ? Math.round((pageNumber / numPages) * 100) : 0;

  // Keyboard navigation
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (presentationMode || fullscreen) {
        if (e.key === 'ArrowRight' || e.key === 'Space') {
          changePage(1);
        } else if (e.key === 'ArrowLeft') {
          changePage(-1);
        } else if (e.key === 'Escape') {
          if (presentationMode) setPresentationMode(false);
          if (fullscreen && document.fullscreenElement) document.exitFullscreen();
        }
      }
    }
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [presentationMode, fullscreen, pageNumber, numPages]);

  return (
    <div 
      className={cn(
        "flex flex-col transition-all duration-300", 
        presentationMode && "fixed inset-0 z-50 bg-gray-900"
      )} 
      ref={containerRef}
    >
      {/* Presentation mode toolbar */}
      <div className={cn(
        "canva-style-toolbar shadow-lg z-10",
        presentationMode ? "px-6 py-4" : ""
      )}>
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center space-x-3">
            <Button 
              onClick={() => changePage(-1)} 
              disabled={pageNumber <= 1 || loading}
              variant="ghost" 
              size="sm"
              className="dark:hover:bg-gray-700"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            
            <div className="text-sm bg-gray-700/50 backdrop-blur-sm px-4 py-1 rounded-full">
              {pageNumber} / {numPages || '-'}
            </div>
            
            <Button 
              onClick={() => changePage(1)} 
              disabled={pageNumber >= (numPages || 1) || loading}
              variant="ghost" 
              size="sm"
              className="dark:hover:bg-gray-700"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="bg-gray-700/30 h-2 w-48 rounded-full overflow-hidden hidden md:block">
            <div 
              className="bg-blue-500 h-full" 
              style={{ width: `${progress}%` }}
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
            ></div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button 
              onClick={zoomOut} 
              variant="ghost" 
              size="sm"
              className="dark:hover:bg-gray-700"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            
            <Button 
              onClick={zoomIn} 
              variant="ghost" 
              size="sm"
              className="dark:hover:bg-gray-700"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            
            <Button 
              onClick={togglePresentationMode}
              variant={presentationMode ? "secondary" : "ghost"}
              size="sm"
              className="dark:hover:bg-gray-700"
            >
              {presentationMode ? (
                <ChevronDown className="h-4 w-4 mr-1" />
              ) : (
                <Maximize className="h-4 w-4 mr-1" />
              )}
              {presentationMode ? "Exit" : "Presentation"}
            </Button>
          </div>
        </div>
      </div>

      <div 
        ref={pdfContainerRef}
        className={cn(
          "flex-1 flex justify-center items-center overflow-auto p-4 transition-all duration-300 canva-style-editor",
          presentationMode ? "bg-gray-900" : ""
        )}
      >
        {loading && (
          <div className="py-20 text-center text-gray-400 dark:text-gray-400">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
            <div className="mt-4">Loading presentation...</div>
          </div>
        )}
        
        {error && (
          <div className="py-10 text-center text-red-500">
            {error}
            <div className="mt-2">
              <p className="dark:text-gray-400">For this demo, a sample PDF is used instead of a real PDF.</p>
            </div>
          </div>
        )}

        <Document
          file={pdfUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onDocumentLoadError}
          className={cn(
            "flex justify-center",
            presentationMode ? "max-w-screen-xl mx-auto" : ""
          )}
        >
          <Page 
            pageNumber={pageNumber} 
            renderTextLayer={true}
            renderAnnotationLayer={true}
            className={cn(
              "shadow-xl transition-all duration-200",
              presentationMode ? "rounded-lg overflow-hidden" : "border dark:border-gray-700"
            )}
            scale={scale}
          />
        </Document>
      </div>

      {!presentationMode && (
        <div className="glass-panel mt-4 p-3 rounded-lg flex items-center justify-between">
          <Button 
            onClick={() => changePage(-1)} 
            disabled={pageNumber <= 1 || loading}
            variant="outline"
            size="sm"
            className="dark:bg-gray-800 dark:border-gray-600"
          >
            Previous
          </Button>
          <div className="flex-1 mx-4">
            <input
              type="range"
              min={1}
              max={numPages || 1}
              value={pageNumber}
              onChange={(e) => setPageNumber(parseInt(e.target.value))}
              className="w-full accent-blue-500"
            />
          </div>
          <Button 
            onClick={() => changePage(1)} 
            disabled={pageNumber >= (numPages || 1) || loading}
            className={pageNumber === (numPages || 1) ? 'bg-green-600 hover:bg-green-700 text-white' : 'dark:bg-blue-600 dark:hover:bg-blue-500'}
            size="sm"
          >
            {pageNumber === (numPages || 1) ? "Complete" : "Next"}
          </Button>
        </div>
      )}
      
      {/* Presentation mode navigation arrows */}
      {presentationMode && (
        <>
          <button 
            className="fixed left-4 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-3 transition-all"
            onClick={() => changePage(-1)}
            disabled={pageNumber <= 1}
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          
          <button 
            className="fixed right-4 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-3 transition-all"
            onClick={() => changePage(1)}
            disabled={pageNumber >= (numPages || 1)}
          >
            <ChevronRight className="h-6 w-6" />
          </button>
          
          <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm">
            {pageNumber} / {numPages || '-'} - Press arrows or space to navigate
          </div>
        </>
      )}
    </div>
  );
}
