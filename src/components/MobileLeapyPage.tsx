import { useState, useRef, useEffect } from 'react';
import { MobileLeapy } from './MobileLeapy';

interface MobileLeapyPageProps {
  previousPage: 'home' | 'communities' | 'courses' | 'events' | 'settings' | 'marketplace';
  context?: 'community' | 'course' | 'event' | 'general';
  contextData?: {
    title?: string;
    type?: string;
  };
  onClose?: () => void;
}

export function MobileLeapyPage({ previousPage, context, contextData, onClose }: MobileLeapyPageProps) {
  // Determine user type based on context
  const userType = context === 'community' || context === 'course' ? 'creator' : 'learner';

  return (
    <MobileLeapy 
      userType={userType} 
      isOpen={true}
      onClose={onClose}
    />
  );
}