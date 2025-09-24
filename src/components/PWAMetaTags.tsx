import React from 'react';

interface PWAMetaTagsProps {
  language: 'en' | 'hi' | 'pa' | 'bn';
}

const translations = {
  en: {
    title: 'JanArogya - Digital Healthcare for Rural India',
    description: 'Comprehensive healthcare app with voice-first navigation, offline capabilities, AI symptom triage, and multilingual support for rural communities'
  },
  hi: {
    title: 'जनआरोग्य - भारतीय ग्रामीण क्षेत्रों के लिए डिजिटल स्वास्थ्य सेवा',
    description: 'वॉयस-फर्स्ट नेवीगेशन, ऑफलाइन क्षमताओं, AI लक्षण ट्राइएज और बहुभाषी समर्थन के साथ व्यापक स्वास्थ्य सेवा ऐप'
  },
  pa: {
    title: 'ਜਨਆਰੋਗਿਆ - ਭਾਰਤੀਯ ਪਿੰਡਾਂ ਲਈ ਡਿਜੀਟਲ ਸਿਹਤ ਸੇਵਾ',
    description: 'ਵੌਇਸ-ਫਰਸਟ ਨੇਵੀਗੇਸ਼ਨ, ਔਫਲਾਈਨ ਸਮਰੱਥਾਵਾਂ, AI ਲੱਛਣ ਟ੍ਰਾਈਏਜ ਅਤੇ ਬਹੁਭਾਸ਼ਾ ਸਹਾਇਤਾ ਦੇ ਨਾਲ ਵਿਆਪਕ ਸਿਹਤ ਸੇਵਾ ਐਪ'
  },
  bn: {
    title: 'জনআরোগ্য - ভারতীয় গ্রামাঞ্চলের জন্য ডিজিটাল স্বাস্থ্যসেবা',
    description: 'ভয়েস-ফার্স্ট নেভিগেশন, অফলাইন সম্ভাবনা, AI উপসর্গ ট্রাইয়েজ এবং বহুভাষিক সহায়তা সহ ব্যাপক স্বাস্থ্যসেবা অ্যাপ'
  }
};

export function PWAMetaTags({ language }: PWAMetaTagsProps) {
  const t = translations[language];

  React.useEffect(() => {
    // Update document title
    document.title = t.title;
    
    // Update meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', t.description);

    // Update theme color
    let themeColor = document.querySelector('meta[name="theme-color"]');
    if (!themeColor) {
      themeColor = document.createElement('meta');
      themeColor.setAttribute('name', 'theme-color');
      document.head.appendChild(themeColor);
    }
    themeColor.setAttribute('content', '#2EB086');

    // Apple mobile web app capable
    let appleMobileCapable = document.querySelector('meta[name="apple-mobile-web-app-capable"]');
    if (!appleMobileCapable) {
      appleMobileCapable = document.createElement('meta');
      appleMobileCapable.setAttribute('name', 'apple-mobile-web-app-capable');
      document.head.appendChild(appleMobileCapable);
    }
    appleMobileCapable.setAttribute('content', 'yes');

    // Apple mobile web app status bar style
    let appleStatusBar = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');
    if (!appleStatusBar) {
      appleStatusBar = document.createElement('meta');
      appleStatusBar.setAttribute('name', 'apple-mobile-web-app-status-bar-style');
      document.head.appendChild(appleStatusBar);
    }
    appleStatusBar.setAttribute('content', 'default');

    // Apple mobile web app title
    let appleTitle = document.querySelector('meta[name="apple-mobile-web-app-title"]');
    if (!appleTitle) {
      appleTitle = document.createElement('meta');
      appleTitle.setAttribute('name', 'apple-mobile-web-app-title');
      document.head.appendChild(appleTitle);
    }
    appleTitle.setAttribute('content', 'JanArogya');

    // Mobile web app capable for other browsers
    let mobileWebAppCapable = document.querySelector('meta[name="mobile-web-app-capable"]');
    if (!mobileWebAppCapable) {
      mobileWebAppCapable = document.createElement('meta');
      mobileWebAppCapable.setAttribute('name', 'mobile-web-app-capable');
      document.head.appendChild(mobileWebAppCapable);
    }
    mobileWebAppCapable.setAttribute('content', 'yes');

    // Application name
    let applicationName = document.querySelector('meta[name="application-name"]');
    if (!applicationName) {
      applicationName = document.createElement('meta');
      applicationName.setAttribute('name', 'application-name');
      document.head.appendChild(applicationName);
    }
    applicationName.setAttribute('content', 'JanArogya');

    // MSApplication
    let msApplicationTileColor = document.querySelector('meta[name="msapplication-TileColor"]');
    if (!msApplicationTileColor) {
      msApplicationTileColor = document.createElement('meta');
      msApplicationTileColor.setAttribute('name', 'msapplication-TileColor');
      document.head.appendChild(msApplicationTileColor);
    }
    msApplicationTileColor.setAttribute('content', '#2EB086');

    // Check if manifest link exists
    let manifestLink = document.querySelector('link[rel="manifest"]');
    if (!manifestLink) {
      manifestLink = document.createElement('link');
      manifestLink.setAttribute('rel', 'manifest');
      document.head.appendChild(manifestLink);
    }
    manifestLink.setAttribute('href', '/manifest.json');

    // Apple touch icon
    let appleTouchIcon = document.querySelector('link[rel="apple-touch-icon"]');
    if (!appleTouchIcon) {
      appleTouchIcon = document.createElement('link');
      appleTouchIcon.setAttribute('rel', 'apple-touch-icon');
      document.head.appendChild(appleTouchIcon);
    }
    appleTouchIcon.setAttribute('href', '/icons/app-icon.svg');

    // Regular favicon
    let favicon = document.querySelector('link[rel="icon"]');
    if (!favicon) {
      favicon = document.createElement('link');
      favicon.setAttribute('rel', 'icon');
      document.head.appendChild(favicon);
    }
    favicon.setAttribute('href', '/icons/app-icon.svg');
    favicon.setAttribute('type', 'image/svg+xml');

  }, [language, t.title, t.description]);

  return null; // This component only manages meta tags, no visible UI
}