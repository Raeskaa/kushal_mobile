interface Segment {
  id: string;
  label: string;
}

interface MobileSegmentedControlProps {
  segments: Segment[];
  activeSegment: string;
  onSegmentChange: (segmentId: string) => void;
}

export function MobileSegmentedControl({ 
  segments, 
  activeSegment, 
  onSegmentChange 
}: MobileSegmentedControlProps) {
  return (
    <div className="inline-flex bg-gray-100 rounded-lg p-0.5 w-full">
      {segments.map((segment) => {
        const isActive = activeSegment === segment.id;
        return (
          <button
            key={segment.id}
            onClick={() => onSegmentChange(segment.id)}
            className={`flex-1 px-2 py-1.5 rounded-md text-xs transition-all active:scale-95 ${
              isActive
                ? 'bg-white text-gray-900 border border-gray-200'
                : 'text-gray-600'
            }`}
          >
            <span className="whitespace-nowrap">{segment.label}</span>
          </button>
        );
      })}
    </div>
  );
}