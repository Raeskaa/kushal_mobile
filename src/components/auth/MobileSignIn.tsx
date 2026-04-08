import { MobileProfile } from '../MobileProfile';

interface MobileSignInProps {
  onClose?: () => void;
  onSwitchToRegister?: () => void;
  onMagicLinkSent?: (email: string) => void;
  onOTPSent?: (phone: string) => void;
  onForgotPassword?: () => void;
  onSignInSuccess?: (email: string) => void;
}

export function MobileSignIn({ 
  onClose, 
  onSignInSuccess
}: MobileSignInProps) {
  return (
    <MobileProfile 
      isOpen={true} 
      onClose={onClose || (() => {})} 
      isLoggedIn={false} 
      onSignInClick={onSignInSuccess} 
    />
  );
}
