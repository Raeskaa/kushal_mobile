import { useState, useRef, useEffect } from 'react';
import { X, Smartphone } from 'lucide-react';

interface MobileOTPVerificationProps {
  onClose?: () => void;
  phoneNumber?: string;
}

export function MobileOTPVerification({ onClose, phoneNumber = '+1 (555) 000-0000' }: MobileOTPVerificationProps) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return; // Only allow single digit
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    const newOtp = [...otp];
    
    pastedData.split('').forEach((char, index) => {
      if (index < 6 && /^\d$/.test(char)) {
        newOtp[index] = char;
      }
    });
    
    setOtp(newOtp);
    
    // Focus last filled input or next empty
    const lastFilledIndex = newOtp.findIndex(val => !val);
    const focusIndex = lastFilledIndex === -1 ? 5 : lastFilledIndex;
    inputRefs.current[focusIndex]?.focus();
  };

  return (
    <div className="fixed inset-0 z-50 bg-white">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-4">
        <div className="flex items-center justify-between">
          <button 
            onClick={onClose}
            className="text-gray-700 active:text-gray-900 transition-colors active:scale-95"
          >
            <X className="size-6" />
          </button>
          <div className="w-6" />
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
        {/* Logo */}
        <div className="mb-8">
          <h1 className="text-2xl text-[#420D74] mb-2">LeapSpace</h1>
        </div>

        {/* Icon */}
        <div className="size-20 bg-[#420D74]/10 rounded-full flex items-center justify-center mb-6">
          <Smartphone className="size-10 text-[#420D74]" />
        </div>

        {/* Title */}
        <h2 className="text-2xl text-gray-900 mb-3">Verify your phone</h2>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-8 max-w-sm">
          We've sent a 6-digit code to{' '}
          <span className="text-gray-900">{phoneNumber}</span>
        </p>

        {/* OTP Input */}
        <div className="flex gap-3 mb-8" onPaste={handlePaste}>
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="size-12 text-center text-xl bg-gray-50 border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#420D74] focus:border-transparent"
            />
          ))}
        </div>

        {/* Resend Button */}
        <button className="text-sm text-[#420D74] mb-8">
          Didn't receive the code? Resend
        </button>

        {/* Verify Button */}
        <button 
          className="w-full py-3 bg-[#420D74] text-white rounded-xl text-sm active:bg-[#350960] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={otp.some(digit => !digit)}
        >
          Verify
        </button>

        {/* Change Number */}
        <button 
          onClick={onClose}
          className="text-sm text-gray-600 mt-4"
        >
          Change phone number
        </button>
      </div>
    </div>
  );
}
