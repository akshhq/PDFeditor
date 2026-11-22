// PDFeditz Chrome Extension - Background Service Worker

const PDFEDITZ_URL = 'https://pdfeditz.akshhq.com/en';

// Create context menu when extension is installed
chrome.runtime.onInstalled.addListener(() => {
    // Create main context menu item
    chrome.contextMenus.create({
        id: 'pdfeditz-open',
        title: 'Open with PDFeditz',
        contexts: ['link', 'page']
    });

    // Create submenu for specific tools
    chrome.contextMenus.create({
        id: 'pdfeditz-merge',
        parentId: 'pdfeditz-open',
        title: 'Merge PDFs',
        contexts: ['link', 'page']
    });

    chrome.contextMenus.create({
        id: 'pdfeditz-compress',
        parentId: 'pdfeditz-open',
        title: 'Compress PDF',
        contexts: ['link', 'page']
    });

    chrome.contextMenus.create({
        id: 'pdfeditz-convert',
        parentId: 'pdfeditz-open',
        title: 'Convert to PDF',
        contexts: ['link', 'page']
    });

    chrome.contextMenus.create({
        id: 'pdfeditz-all-tools',
        parentId: 'pdfeditz-open',
        title: 'All Tools →',
        contexts: ['link', 'page']
    });

    console.log('PDFeditz context menus created');
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
    let url = PDFEDITZ_URL;

    switch (info.menuItemId) {
        case 'pdfeditz-merge':
            url = `${PDFEDITZ_URL}/tools/merge-pdf`;
            break;
        case 'pdfeditz-compress':
            url = `${PDFEDITZ_URL}/tools/compress-pdf`;
            break;
        case 'pdfeditz-convert':
            url = `${PDFEDITZ_URL}/tools/jpg-to-pdf`;
            break;
        case 'pdfeditz-all-tools':
        case 'pdfeditz-open':
            url = PDFEDITZ_URL;
            break;
        default:
            url = PDFEDITZ_URL;
    }

    // Open PDFeditz in a new tab
    chrome.tabs.create({ url: url });
});

// Log when service worker starts
console.log('PDFeditz background service worker started');
