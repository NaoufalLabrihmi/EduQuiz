
import { useState } from 'react';
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

  return (
    <div className="flex flex-col items-center">
      <Card className="p-4 mb-4 w-full max-w-3xl mx-auto">
        {loading && <div className="py-20 text-center text-gray-500">Loading PDF...</div>}
        
        {error && (
          <div className="py-10 text-center text-red-500">
            {error}
            <div className="mt-2">
              <p>For this demo, a sample PDF is used instead of a real PDF.</p>
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
            className="border shadow-sm"
            scale={1.2}
          />
        </Document>
      </Card>

      <div className="flex items-center justify-between w-full max-w-3xl mb-6">
        <div className="text-sm text-gray-500">
          Page {pageNumber} of {numPages || '-'}
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={() => changePage(-1)} 
            disabled={pageNumber <= 1 || loading}
            variant="outline"
            size="sm"
          >
            Previous
          </Button>
          <Button 
            onClick={() => changePage(1)} 
            disabled={pageNumber >= (numPages || 1) || loading}
            variant={pageNumber === (numPages || 1) ? "default" : "outline"}
            size="sm"
            className={pageNumber === (numPages || 1) ? "btn-primary" : ""}
          >
            {pageNumber === (numPages || 1) ? "Complete" : "Next"}
          </Button>
        </div>
      </div>
    </div>
  );
}
