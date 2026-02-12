import React, { useState, useCallback, useEffect, useRef } from 'react';
import { ControlPanel } from './components/ControlPanel';
import { WorksheetDisplay } from './components/WorksheetDisplay';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorMessage } from './components/ErrorMessage';
import { generateWorksheetData } from './services/geminiService';
import { Level, WorksheetData, SavedWorksheet } from './types';
import { SavedWorksheetsPanel } from './components/SavedWorksheetsPanel';
import { getImageFromCache, saveImageToCache } from './services/imageCache';

// For using jsPDF and html2canvas from CDN
declare const html2canvas: any;
declare const jspdf: any;

const fetchImageFromServer = async (word: string, level: Level) => {
  const res = await fetch('/api/generate-image', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ word, level }),
  });

  if (!res.ok) {
    throw new Error('Image generation failed');
  }

  const data = await res.json();
  return data.image;
};
function App() {
  const [word, setWord] = useState<string>('');
  const [level, setLevel] = useState<Level>(Level.L1);
  const [worksheetData, setWorksheetData] = useState<WorksheetData | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [savedWorksheets, setSavedWorksheets] = useState<SavedWorksheet[]>([]);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState<boolean>(false);
  const worksheetContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('savedWorksheets');
      if (saved) {
        setSavedWorksheets(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load worksheets from localStorage", e);
    }
  }, []);

  const handleSaveWorksheet = useCallback(() => {
    if (!worksheetData) return;

    const isDuplicate = savedWorksheets.some(
      ws => ws.word.toLowerCase() === worksheetData.word.toLowerCase() && ws.level === level
    );

    if (isDuplicate) {
      setError("This worksheet (word and level) is already saved.");
      setTimeout(() => setError(null), 3000);
      return;
    }

    const newSavedWorksheet: SavedWorksheet = {
      id: Date.now(),
      word: worksheetData.word,
      level: level,
      data: worksheetData,
      image: generatedImage,
    };

    const updatedWorksheets = [newSavedWorksheet, ...savedWorksheets];
    setSavedWorksheets(updatedWorksheets);
    localStorage.setItem('savedWorksheets', JSON.stringify(updatedWorksheets));
  }, [worksheetData, generatedImage, level, savedWorksheets]);

  const handleDownloadPdf = useCallback(() => {
    if (!worksheetContainerRef.current || !worksheetData) return;

    // First, check if the required libraries are loaded from the CDN.
    if (typeof html2canvas === 'undefined' || typeof jspdf === 'undefined') {
      setError("PDF generation libraries could not be loaded. Please check your internet connection and try again.");
      console.error("html2canvas or jspdf is not defined. The CDN script may have failed to load.");
      return;
    }
    
    setIsDownloadingPdf(true);
    
    // Use setTimeout to allow React to re-render with the 'print-mode' class
    // before we try to capture the element. This fixes the timing issue.
    setTimeout(async () => {
        const elementToCapture = worksheetContainerRef.current;
        if (!elementToCapture) { // re-check after timeout
            setIsDownloadingPdf(false);
            return;
        }

        try {
          const canvas = await html2canvas(elementToCapture, {
            scale: 2, // Higher scale for better quality
            useCORS: true,
            logging: false,
            backgroundColor: '#ffffff', // Ensure a solid background for the capture
          });
          
          const imgData = canvas.toDataURL('image/png');
          const { jsPDF } = jspdf;
          const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4',
          });

          const margin = 10; // 10mm margin
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = pdf.internal.pageSize.getHeight();
          
          const contentWidth = pdfWidth - margin * 2;

          const imgProps = pdf.getImageProperties(imgData);
          const imgHeight = (imgProps.height * contentWidth) / imgProps.width;
          
          let heightLeft = imgHeight;
          let position = 0;
          const pageViewableHeight = pdfHeight - margin * 2;
          
          // Add first page
          pdf.addImage(imgData, 'PNG', margin, margin, contentWidth, imgHeight);
          heightLeft -= pageViewableHeight;

          // Add subsequent pages if content is taller than one page
          while (heightLeft > 0) {
            position -= pageViewableHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', margin, position + margin, contentWidth, imgHeight);
            heightLeft -= pageViewableHeight;
          }
          
          pdf.save(`worksheet-${worksheetData.word}-level-${level}.pdf`);
        } catch (err) {
          console.error("Failed to generate PDF:", err);
          setError("Sorry, we couldn't create the PDF. Please try again.");
        } finally {
          setIsDownloadingPdf(false);
        }
    }, 100); // 100ms delay is enough for the render to complete
  }, [worksheetData, level]);


  const handleLoadWorksheet = useCallback((worksheet: SavedWorksheet) => {
    setWord(worksheet.word);
    setLevel(worksheet.level);
    setWorksheetData(worksheet.data);
    setGeneratedImage(worksheet.image);
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleDeleteWorksheet = useCallback((id: number) => {
    const updatedWorksheets = savedWorksheets.filter(ws => ws.id !== id);
    setSavedWorksheets(updatedWorksheets);
    localStorage.setItem('savedWorksheets', JSON.stringify(updatedWorksheets));
  }, [savedWorksheets]);

  const handleGenerate = useCallback(async () => {
    if (!word.trim()) {
      setError('Please enter a word.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setWorksheetData(null);
    setGeneratedImage(null);

    try {
      // Check for image in cache first
      const cachedImage = getImageFromCache(word);
      if (cachedImage) {
        setGeneratedImage(cachedImage);
        console.log(`Loaded image for "${word}" from cache.`);
      }

      // Generate worksheet data
      const dataPromise = generateWorksheetData(word, level);
      
      // Generate image only if not in cache
      const imagePromise = cachedImage
        ? Promise.resolve(cachedImage)
        : fetchImageFromServer(word, level);

      const [data, imageData] = await Promise.all([
        dataPromise,
        imagePromise
      ]);
      
      setWorksheetData(data);
      
      if (imageData && !cachedImage) {
        // Save the newly generated image to cache
        saveImageToCache(word, imageData);
        console.log(`Saved new image for "${word}" to cache.`);
      }
      setGeneratedImage(imageData);

    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred. Please check the console.');
    } finally {
      setIsLoading(false);
    }
  }, [word, level]);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <header className="w-full max-w-5xl text-center mb-8">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-800 tracking-tight">
          AI Vocabulary Worksheet
        </h1>
        <p className="mt-2 text-lg text-slate-600">
          Generate personalized English vocabulary worksheets instantly.
        </p>
      </header>
      
      <main className="w-full max-w-5xl">
        <ControlPanel
          word={word}
          setWord={setWord}
          level={level}
          setLevel={setLevel}
          onGenerate={handleGenerate}
          isLoading={isLoading}
        />
        
        {isLoading && <LoadingSpinner />}
        {error && <ErrorMessage message={error} />}
        
        {worksheetData && (
          <div className="mt-8">
            <div className="flex justify-end mb-4 gap-3">
              <button
                onClick={handleSaveWorksheet}
                className="bg-green-600 text-white font-bold py-2 px-5 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors flex items-center shadow-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v2a2 2 0 01-2 2H7a2 2 0 01-2-2V4z" />
                    <path fillRule="evenodd" d="M3 8a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 4a1 1 0 10-2 0v2a1 1 0 102 0v-2z" clipRule="evenodd" />
                </svg>
                Save Worksheet
              </button>
              <button
                onClick={handleDownloadPdf}
                disabled={isDownloadingPdf}
                className="bg-blue-600 text-white font-bold py-2 px-5 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors flex items-center shadow-sm disabled:bg-slate-400 disabled:cursor-not-allowed"
              >
                {isDownloadingPdf ? (
                    <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                )}
                {isDownloadingPdf ? 'Downloading...' : 'Download PDF'}
              </button>
            </div>
            <div ref={worksheetContainerRef} className={isDownloadingPdf ? 'print-mode' : ''}>
                <WorksheetDisplay
                  level={level}
                  data={worksheetData}
                  image={generatedImage}
                />
            </div>
          </div>
        )}

        {!isLoading && !worksheetData && (
            <div className="text-center mt-12 p-8 bg-white rounded-xl shadow-md border border-slate-200">
                <h2 className="text-2xl font-bold text-slate-700">Ready to learn?</h2>
                <p className="text-slate-500 mt-2">Enter a word, select a level, and click "Generate" to create your worksheet.</p>
                <img src="https://picsum.photos/600/400?grayscale" alt="placeholder" className="mt-6 rounded-lg mx-auto opacity-70" />
            </div>
        )}

        <SavedWorksheetsPanel 
            worksheets={savedWorksheets}
            onLoad={handleLoadWorksheet}
            onDelete={handleDeleteWorksheet}
        />
      </main>
    </div>
  );
}

export default App;
