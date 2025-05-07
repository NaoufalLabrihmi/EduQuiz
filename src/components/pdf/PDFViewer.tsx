import { useState, useRef, useEffect } from 'react';
import { Document, Page } from 'react-pdf';
import { cn } from '@/lib/utils';

interface PDFViewerProps {
  pdfUrl: string;
  courseId: string;
  onComplete?: () => void;
  onClose?: () => void;
  onQuizClick: () => void;
}

export default function PDFViewer({ pdfUrl, courseId, onComplete, onClose, onQuizClick }: PDFViewerProps) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [scale, setScale] = useState<number>(1);
  const [completed, setCompleted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

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
  }
  
  function zoomIn() {
    setScale(prev => Math.min(prev + 0.1, 2));
  }
  
  function zoomOut() {
    setScale(prev => Math.max(prev - 0.1, 0.5));
  }
  
  useEffect(() => {
    if (numPages && pageNumber === numPages && !completed) {
      setCompleted(true);
      if (onComplete) onComplete();
    }
    if (pageNumber !== numPages && completed) {
      setCompleted(false);
    }
  }, [pageNumber, numPages, completed, onComplete]);

  // Overlay click to close
  function handleOverlayClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget && onClose) {
      onClose();
    }
  }

  // Fullscreen handler
  function handleFullscreen() {
    setIsFullscreen(f => !f);
        }

  const glassToolbar =
    'bg-white/70 backdrop-blur-lg rounded-b-3xl shadow-lg flex gap-4 items-center px-8 py-3 m-2 animate-fade-in-up';
  const iconBtn =
    'hover:bg-blue-100/60 active:bg-blue-200 focus:ring-2 focus:ring-blue-400 transition-all duration-150 rounded-full p-2 text-blue-700 disabled:opacity-40 disabled:cursor-not-allowed';

  return (
    <div 
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-blue-900/80 to-blue-400/60 backdrop-blur-2xl",
        isFullscreen ? "" : ""
      )}
      onClick={handleOverlayClick}
    >
      <div
        className={cn(
          'flex flex-col items-center justify-center w-[90vw] max-w-[1100px] aspect-[16/9] max-h-[80vh] min-h-[320px] bg-white/90 backdrop-blur-2xl border-2 border-blue-200/60 shadow-2xl rounded-3xl animate-fade-in-fast relative',
          isFullscreen && 'fixed inset-0 w-screen h-screen max-w-none max-h-none z-[100] rounded-none border-0 bg-white/95'
        )}
        onClick={e => e.stopPropagation()}
      >
        {/* Floating Fullscreen Button */}
        <button
          onClick={handleFullscreen}
          className="absolute top-6 right-8 z-20 bg-gradient-to-br from-blue-500 to-blue-400 text-white shadow-lg rounded-full p-3 hover:scale-110 active:scale-95 transition-all duration-150 border-2 border-white/70 backdrop-blur-md"
          title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
        >
          {isFullscreen ? (
            // Exit fullscreen icon
            <svg width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path d="M9 9L5 5M5 9V5h4M15 15l4 4m0-4v4h-4" /></svg>
          ) : (
            // Fullscreen icon
            <svg width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path d="M9 5H5v4M5 5l4 4M15 19h4v-4m0 4l-4-4" /></svg>
          )}
        </button>
        {/* PDF Slide */}
        <div className="flex-1 flex flex-col items-center justify-center w-full h-full px-8 py-6">
        <Document
          file={pdfUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onDocumentLoadError}
            className="flex justify-center items-center w-full h-full"
        >
          <Page 
            pageNumber={pageNumber} 
              width={(isFullscreen ? window.innerWidth * 0.8 : 800) * scale}
              renderTextLayer={false}
              renderAnnotationLayer={false}
              className="mx-auto rounded-2xl shadow-xl"
          />
        </Document>
      </div>
        {/* Bottom Glassy Toolbar */}
        <div className="absolute bottom-0 left-0 w-full flex justify-center pointer-events-none">
          <div className={glassToolbar + ' pointer-events-auto bg-gradient-to-br from-blue-100/80 to-white/80 border-2 border-blue-200/60 shadow-xl'}>
            <button onClick={zoomOut} className={iconBtn} title="Zoom Out">
              <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 12H9" /></svg>
            </button>
            <button onClick={() => changePage(-1)} disabled={pageNumber <= 1 || loading} className={iconBtn} title="Previous">
              <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6" /></svg>
            </button>
            <span className="font-bold text-blue-700 text-base select-none">
              {pageNumber} / {numPages || '-'}
            </span>
            <button onClick={() => changePage(1)} disabled={pageNumber >= (numPages || 1) || loading} className={iconBtn} title="Next">
              <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 6l6 6-6 6" /></svg>
            </button>
            <button onClick={zoomIn} className={iconBtn} title="Zoom In">
              <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 9v6m3-3H9" /></svg>
            </button>
            {/* Quiz Icon Button */}
            <button
              onClick={onQuizClick}
              className={iconBtn + ' ml-4'}
              title={numPages && pageNumber === numPages ? 'Take the Quiz' : 'Finish the presentation to unlock the quiz'}
              disabled={!numPages || pageNumber !== numPages}
            >
              {/* Quiz/Trophy Icon */}
              <svg width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                <path d="M8 21h8M12 17v4M17 5V3a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v2M21 5h-4v2a5 5 0 0 1-10 0V5H3v2a7 7 0 0 0 14 0V5h4z" />
              </svg>
            </button>
          </div>
        </div>
          </div>
    </div>
  );
}
