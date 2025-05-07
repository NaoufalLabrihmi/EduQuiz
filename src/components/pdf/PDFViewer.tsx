import { useState, useRef, useEffect } from 'react';
import { Document, Page } from 'react-pdf';
import { cn } from '@/lib/utils';

interface PDFViewerProps {
  pdfUrl: string;
  onComplete?: () => void;
  onClose?: () => void;
}

export default function PDFViewer({ pdfUrl, onComplete, onClose }: PDFViewerProps) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [scale, setScale] = useState<number>(1);
  const [completed, setCompleted] = useState(false);

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

  const glassToolbar =
    'bg-white/70 backdrop-blur-lg rounded-b-3xl shadow-lg flex gap-4 items-center px-8 py-3 m-2 animate-fade-in-up';
  const iconBtn =
    'hover:bg-blue-100/60 active:bg-blue-200 focus:ring-2 focus:ring-blue-400 transition-all duration-150 rounded-full p-2 text-blue-700 disabled:opacity-40 disabled:cursor-not-allowed';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      onClick={handleOverlayClick}
    >
      <div
        className={cn(
          'flex flex-col items-center justify-center w-[90vw] max-w-[1100px] aspect-[16/9] max-h-[80vh] min-h-[320px] bg-white/80 backdrop-blur-2xl border border-blue-100 shadow-2xl rounded-3xl animate-fade-in-fast',
        )}
        onClick={e => e.stopPropagation()}
      >
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
              width={800 * scale} // 800 is a safe default for 16/9
              renderTextLayer={false}
              renderAnnotationLayer={false}
              className="mx-auto rounded-2xl"
            />
          </Document>
        </div>
        {/* Bottom Glassy Toolbar */}
        <div className="absolute bottom-0 left-0 w-full flex justify-center pointer-events-none">
          <div className={glassToolbar + ' pointer-events-auto'}>
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
          </div>
        </div>
      </div>
    </div>
  );
}
