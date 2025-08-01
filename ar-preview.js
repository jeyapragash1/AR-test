window.addEventListener('DOMContentLoaded', () => {

    const desktopView = document.getElementById('desktop-view');
    const mobileView = document.getElementById('mobile-view');
    const modelViewer = document.getElementById('ar-viewer');
    const furnitureLibrary = document.getElementById('furniture-library');
    const downloadSummaryBtn = document.getElementById('download-summary-btn');

    // This will store a log of what the user does
    const userActivity = [];

    // --- Core Logic: Detect Device and Show Correct View ---
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    if (isMobile) {
        // We are on a mobile device, show the AR interface
        mobileView.style.display = 'block';
    } else {
        // We are on a desktop, show the QR code
        desktopView.style.display = 'block';
        new QRCode(document.getElementById("qrcode"), {
            text: window.location.href, // The QR code links to the current page
            width: 256,
            height: 256,
        });
    }

    // --- Mobile View Logic ---

    // 1. Handle clicking on a furniture item
    if (furnitureLibrary) {
        furnitureLibrary.addEventListener('click', (event) => {
            if (event.target.tagName === 'IMG') {
                const modelSrc = event.target.getAttribute('data-model');
                const modelName = event.target.getAttribute('alt');
                
                // Update the model-viewer to show the selected furniture
                modelViewer.src = modelSrc;

                // Log this activity
                const logEntry = `Placed a '${modelName}' into the scene.`;
                console.log(logEntry);
                userActivity.push(logEntry);

                // Optional: Automatically activate AR mode
                // modelViewer.activateAR();
            }
        });
    }

    // 2. Handle downloading the summary
    if (downloadSummaryBtn) {
        downloadSummaryBtn.addEventListener('click', () => {
            generateSummaryPDF();
        });
    }

    function generateSummaryPDF() {
        // Get the jsPDF library
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // --- Add Content to the PDF ---
        doc.setFontSize(22);
        doc.text("SpaceSnap Design Summary", 20, 20);

        doc.setFontSize(16);
        doc.text("Date: " + new Date().toLocaleDateString(), 20, 30);
        
        doc.setFontSize(12);
        doc.text("Here is a summary of the items you viewed in AR:", 20, 50);

        if (userActivity.length > 0) {
            let yPosition = 60;
            userActivity.forEach((activity, index) => {
                doc.text(`${index + 1}. ${activity}`, 20, yPosition);
                yPosition += 10; // Move down for the next line
            });
        } else {
            doc.text("No items were placed in the scene.", 20, 60);
        }

        // Add a concluding message
        const finalY = doc.internal.pageSize.height - 20;
        doc.text("Thank you for using SpaceSnap!", 20, finalY);

        // Save the PDF
        doc.save("SpaceSnap_AR_Summary.pdf");
    }
});

// Note on Downloading an Image:
// Directly screenshotting the AR view from the browser is very complex.
// For your project deadline, the simplest solution is to instruct the user to
// use their phone's built-in screenshot feature (e.g., Power + Volume Down).
// You can add a text message on the page: "Once you are happy with the design,
// take a screenshot to save the image!"