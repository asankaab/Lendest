import { useState, useEffect } from 'react';
import { X, Download } from 'lucide-react';
import '../styles/InstallPrompt.css';

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    const isInstalled = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
    if (isInstalled) {
      return;
    }

    const handleBeforeInstallPrompt = (event) => {
      // Prevent the mini-infobar from appearing on mobile
      event.preventDefault();
      // Store the event for later use
      setDeferredPrompt(event);
      // Show our custom install banner
      setShowPrompt(true);
    };

    const handleAppInstalled = () => {
      // App was installed
      setShowPrompt(false);
      setDeferredPrompt(null);
      // Optionally show a success message or update UI
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
    }

    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <div className="install-prompt-container">
      <div className="install-prompt">
        <div className="install-prompt-content">
          <div className="install-prompt-icon">
            <Download size={24} />
          </div>
          <div className="install-prompt-text">
            <h3>Install LendBook</h3>
            <p>Add LendBook to your home screen for quick access</p>
          </div>
        </div>
        <div className="install-prompt-actions">
          <button className="install-btn-install" onClick={handleInstall}>
            Install
          </button>
          <button className="install-btn-dismiss" onClick={handleDismiss}>
            <X size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
