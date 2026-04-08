import { useState, useEffect } from 'react';
import { Sparkles, RotateCcw, ArrowRight, Check, Loader2, Wand2 } from 'lucide-react';
import { Button } from './ui/button';
import { CommunityData } from '../types';

interface CommunityGenerationPreviewProps {
  communityData: Partial<CommunityData>;
  onComplete: () => void;
}

const GENERATION_STEPS = [
  'Analyzing your community vision...',
  'Generating custom header design...',
  'Setting up member spaces...',
  'Configuring community features...',
  'Personalizing your dashboard...',
  'Almost ready...',
];

export function CommunityGenerationPreview({ 
  communityData, 
  onComplete 
}: CommunityGenerationPreviewProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isGenerating, setIsGenerating] = useState(true);
  const [headerVersion, setHeaderVersion] = useState(1);
  const [isRegeneratingHeader, setIsRegeneratingHeader] = useState(false);

  useEffect(() => {
    if (isGenerating && currentStep < GENERATION_STEPS.length) {
      const timer = setTimeout(() => {
        setCurrentStep(currentStep + 1);
      }, 800);
      return () => clearTimeout(timer);
    } else if (currentStep >= GENERATION_STEPS.length) {
      setIsGenerating(false);
    }
  }, [currentStep, isGenerating]);

  const handleRegenerateHeader = () => {
    setIsRegeneratingHeader(true);
    setTimeout(() => {
      setHeaderVersion(headerVersion + 1);
      setIsRegeneratingHeader(false);
    }, 1500);
  };

  const handleContinue = () => {
    onComplete();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-4xl w-full">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            {isGenerating ? (
              <div className="size-12 bg-[#420D74] rounded-full flex items-center justify-center">
                <Loader2 className="size-6 text-white animate-spin" />
              </div>
            ) : (
              <div className="size-12 bg-green-500 rounded-full flex items-center justify-center">
                <Check className="size-6 text-white" />
              </div>
            )}
          </div>
          <h1 className="text-gray-900 text-3xl mb-3">
            {isGenerating ? 'Creating your community...' : 'Now for the magical part'}
          </h1>
          <p className="text-gray-600 text-lg">
            {isGenerating 
              ? 'Hang tight while we set everything up for you' 
              : `Awesome! We now have everything we need to help you set up ${communityData.title}.`
            }
          </p>
        </div>

        {/* Loading Steps */}
        {isGenerating && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-200">
            <div className="space-y-3">
              {GENERATION_STEPS.map((step, index) => {
                const isComplete = index < currentStep;
                const isActive = index === currentStep;
                const isPending = index > currentStep;

                return (
                  <div 
                    key={index} 
                    className={`flex items-center gap-3 transition-all duration-300 ${
                      isPending ? 'opacity-40' : 'opacity-100'
                    }`}
                  >
                    <div className={`size-6 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                      isComplete ? 'bg-green-500' :
                      isActive ? 'bg-[#420D74] animate-pulse' :
                      'bg-gray-200'
                    }`}>
                      {isComplete && <Check className="size-4 text-white" />}
                      {isActive && <Loader2 className="size-3 text-white animate-spin" />}
                    </div>
                    <span className={`text-gray-900 ${isActive ? 'font-medium' : ''}`}>
                      {step}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Preview Section (shows after generation) */}
        {!isGenerating && (
          <div className="space-y-4">
            {/* Community Preview Card */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
              {/* Header Image */}
              <div className="relative h-64 bg-gradient-to-br from-gray-200 via-gray-300 to-gray-400 flex items-center justify-center overflow-hidden">
                {/* Placeholder pattern for header */}
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute inset-0" style={{
                    backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(0,0,0,.05) 35px, rgba(0,0,0,.05) 70px)',
                  }} />
                </div>
                
                {/* Community Name Overlay */}
                <div className="relative z-10 text-center px-6">
                  <h2 className="text-white text-4xl font-bold drop-shadow-lg mb-2">
                    {communityData.title}
                  </h2>
                  <p className="text-white/90 text-lg drop-shadow-md">
                    {communityData.description?.split('.')[0]}.
                  </p>
                </div>

                {/* Regenerate Button Overlay */}
                <div className="absolute top-4 right-4">
                  <Button
                    onClick={handleRegenerateHeader}
                    disabled={isRegeneratingHeader}
                    size="sm"
                    className="bg-white hover:bg-gray-50 text-gray-900 shadow-lg"
                  >
                    {isRegeneratingHeader ? (
                      <>
                        <Loader2 className="size-3 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <RotateCcw className="size-3 mr-2" />
                        Regenerate Header
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Community Info Section */}
              <div className="p-6 bg-white">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">
                      Welcome to {communityData.title}!
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {communityData.description}
                    </p>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="flex gap-6 py-4 border-t border-gray-200">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">0</div>
                    <div className="text-sm text-gray-500">Members</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">0</div>
                    <div className="text-sm text-gray-500">Posts</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">0</div>
                    <div className="text-sm text-gray-500">Events</div>
                  </div>
                </div>

                {/* Join Button Mockup */}
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex gap-2">
                    <div className="flex-1 px-4 py-2.5 bg-[#420D74] text-white text-center rounded-lg opacity-50 cursor-not-allowed">
                      Join Community
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Customization Options */}
            <div className="bg-purple-50 border border-purple-100 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="size-10 bg-[#420D74] rounded-lg flex items-center justify-center flex-shrink-0">
                  <Wand2 className="size-5 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="text-gray-900 font-medium mb-1">Personalization Tips</h4>
                  <p className="text-gray-600 text-sm mb-3">
                    Your community is ready! You can customize colors, add more details, and configure settings once you enter the dashboard.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <div className="px-3 py-1 bg-white border border-purple-200 rounded-full text-gray-700 text-xs">
                      Brand Colors
                    </div>
                    <div className="px-3 py-1 bg-white border border-purple-200 rounded-full text-gray-700 text-xs">
                      Member Permissions
                    </div>
                    <div className="px-3 py-1 bg-white border border-purple-200 rounded-full text-gray-700 text-xs">
                      Custom Sections
                    </div>
                    <div className="px-3 py-1 bg-white border border-purple-200 rounded-full text-gray-700 text-xs">
                      Welcome Messages
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Continue Button */}
            <div className="flex justify-center pt-4">
              <Button
                onClick={handleContinue}
                size="lg"
                className="bg-[#420D74] text-white hover:bg-[#5a1294] px-8 text-lg h-12 shadow-lg"
              >
                Continue to Dashboard
                <ArrowRight className="size-5 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* Bottom Text */}
        {isGenerating && (
          <div className="text-center mt-8">
            <p className="text-gray-500 text-sm">
              This usually takes about 10-15 seconds
            </p>
          </div>
        )}
      </div>
    </div>
  );
}