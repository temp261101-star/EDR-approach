import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

export const NewWindowPortal = ({ children, isOpen, onClose }) => {
  const windowRef = useRef(null);
  const [container, setContainer] = useState(null);

  useEffect(() => {
    if (isOpen) {
      // Open new window
      const newWindow = window.open(
        '',
        '_blank',
        'width=1200,height=600,left=100,top=100,scrollbars=yes,resizable=yes'
      );

      

      windowRef.current = newWindow;

      // Setup the document
      newWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Scanplus</title>
            <script src="https://cdn.tailwindcss.com"></script>
            <style>
              body {
                margin: 0;
                padding: 0;
                background: #020617;
                color: #f8fafc;
                font-family: system-ui, -apple-system, sans-serif;
              }
            </style>
          </head>
          <body>
            <div id="portal-root"></div>
          </body>
        </html>
      `);
      newWindow.document.close();

      // Get the container
      const portalRoot = newWindow.document.getElementById('portal-root');
      setContainer(portalRoot);

      // Handle window close
      // newWindow.addEventListener('beforeunload', () => {
      //   onClose();
      // });

      // Cleanup
      return () => {
        if (newWindow && !newWindow.closed) {
          newWindow.close();
        }
      };
    }
  }, [isOpen, onClose]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (windowRef.current && !windowRef.current.closed) {
        windowRef.current.close();
      }
    };
  }, []);

  if (!container) return null;

  return createPortal(children, container);
};