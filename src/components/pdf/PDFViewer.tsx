
import { useState, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

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
  const [scale, setScale] = useState<number>(1.2);
  const [fullscreen, setFullscreen] = useState<boolean>(false);
  
  const containerRef = useRef<HTMLDivElement>(null);

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
  
  // Calculate page progress
  const progress = numPages ? Math.round((pageNumber / numPages) * 100) : 0;

  return (
    <div className="flex flex-col" ref={containerRef}>
      <div className="bg-gray-100 dark:bg-gray-800 p-2 border-b dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button 
              onClick={() => changePage(-1)} 
              disabled={pageNumber <= 1 || loading}
              variant="outline" 
              size="sm"
              className="dark:bg-gray-700 dark:border-gray-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </Button>
            
            <div className="text-sm dark:text-gray-300">
              Page <span className="font-medium">{pageNumber}</span> of <span className="font-medium">{numPages || '-'}</span>
            </div>
            
            <Button 
              onClick={() => changePage(1)} 
              disabled={pageNumber >= (numPages || 1) || loading}
              variant="outline" 
              size="sm"
              className={`dark:bg-gray-700 dark:border-gray-600 ${pageNumber === (numPages || 1) ? 'bg-green-600 text-white hover:bg-green-700' : ''}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </Button>
          </div>
          
          <div className="bg-gray-200 dark:bg-gray-700 h-2 w-36 rounded-full overflow-hidden">
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
              variant="outline" 
              size="sm"
              className="dark:bg-gray-700 dark:border-gray-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
            </Button>
            
            <Button 
              onClick={zoomIn} 
              variant="outline" 
              size="sm"
              className="dark:bg-gray-700 dark:border-gray-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
            </Button>
            
            <Button 
              onClick={toggleFullscreen} 
              variant="outline" 
              size="sm"
              className="dark:bg-gray-700 dark:border-gray-600"
            >
              {fullscreen ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 14h6m0 0v6m0-6-7 7"/><path d="M20 10h-6m0 0V4m0 6 7-7"/></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>
              )}
            </Button>
          </div>
        </div>
      </div>

      <Card className="p-4 mb-4 w-full dark:bg-gray-800 dark:border-gray-700 flex justify-center">
        {loading && <div className="py-20 text-center text-gray-500 dark:text-gray-400">Loading PDF...</div>}
        
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
          className="flex justify-center"
        >
          <Page 
            pageNumber={pageNumber} 
            renderTextLayer={true}
            renderAnnotationLayer={true}
            className="border shadow-sm dark:border-gray-700"
            scale={scale}
          />
        </Document>
      </Card>

      <div className="flex items-center justify-between mb-6 bg-white dark:bg-gray-800 p-3 border rounded-lg dark:border-gray-700">
        <Button 
          onClick={() => changePage(-1)} 
          disabled={pageNumber <= 1 || loading}
          variant="outline"
          size="sm"
          className="dark:bg-gray-700 dark:border-gray-600"
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
          className={pageNumber === (numPages || 1) ? 'bg-green-600 hover:bg-green-700 text-white' : 'dark:bg-blue-700 dark:hover:bg-blue-600'}
          size="sm"
        >
          {pageNumber === (numPages || 1) ? "Complete" : "Next"}
        </Button>
      </div>
    </div>
  );
}
