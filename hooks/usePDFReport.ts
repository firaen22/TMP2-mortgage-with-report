import { useState } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export const usePDFReport = (title: string) => {
    const [isDownloading, setIsDownloading] = useState(false);
    const [isReportVisible, setIsReportVisible] = useState(false);

    const handleDownloadPDF = async () => {
        setIsDownloading(true);
        setIsReportVisible(true); // Render the report in the off-screen area

        // Wait for the report container to render and Recharts to settle (remove animation)
        setTimeout(async () => {
            const page1 = document.getElementById('pdf-report-page-1');
            const page2 = document.getElementById('pdf-report-page-2');

            if (!page1 || !page2) {
                setIsDownloading(false);
                setIsReportVisible(false);
                return;
            }

            try {
                // Capture Page 1
                const canvas1 = await html2canvas(page1, {
                    scale: 2, // High resolution
                    backgroundColor: '#ffffff',
                    useCORS: true,
                    logging: false,
                    windowWidth: page1.scrollWidth,
                    windowHeight: page1.scrollHeight
                });
                const imgData1 = canvas1.toDataURL('image/png');

                // Capture Page 2
                const canvas2 = await html2canvas(page2, {
                    scale: 2, // High resolution
                    backgroundColor: '#ffffff',
                    useCORS: true,
                    logging: false,
                    windowWidth: page2.scrollWidth,
                    windowHeight: page2.scrollHeight
                });
                const imgData2 = canvas2.toDataURL('image/png');

                // Initialize PDF (A4 Portrait)
                const pdf = new jsPDF('p', 'mm', 'a4');
                const pdfWidth = pdf.internal.pageSize.getWidth();
                // const pdfHeight = pdf.internal.pageSize.getHeight(); 

                // Add Page 1
                // Calculate ratio to fit width exactly
                const imgProps1 = pdf.getImageProperties(imgData1);
                const pdfHeight1 = (imgProps1.height * pdfWidth) / imgProps1.width;
                pdf.addImage(imgData1, 'PNG', 0, 0, pdfWidth, pdfHeight1);

                // Add Page 2
                pdf.addPage();
                const imgProps2 = pdf.getImageProperties(imgData2);
                const pdfHeight2 = (imgProps2.height * pdfWidth) / imgProps2.width;
                pdf.addImage(imgData2, 'PNG', 0, 0, pdfWidth, pdfHeight2);

                pdf.save(`${title}_Analysis.pdf`);

            } catch (error) {
                console.error('PDF Generation failed:', error);
                alert('Generating PDF failed. Please try again.');
            } finally {
                setIsDownloading(false);
                setIsReportVisible(false); // Remove from DOM
            }
        }, 1500); // Delay to ensure charts render
    };

    return {
        isDownloading,
        isReportVisible,
        handleDownloadPDF
    };
};
