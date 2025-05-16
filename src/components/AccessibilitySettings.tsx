
import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';

interface AccessibilitySettingsProps {
  textToSpeech: boolean;
  setTextToSpeech: (value: boolean) => void;
  symbolSize: number;
  setSymbolSize: (value: number) => void;
  highContrast: boolean;
  setHighContrast: (value: boolean) => void;
}

export const AccessibilitySettings: React.FC<AccessibilitySettingsProps> = ({
  textToSpeech,
  setTextToSpeech,
  symbolSize,
  setSymbolSize,
  highContrast,
  setHighContrast
}) => {
  return (
    <div className={`border-t pt-4 mt-6 ${highContrast ? 'border-gray-600' : ''}`}>
      <h3 className={`text-lg font-medium mb-4 ${highContrast ? 'text-white' : 'text-gray-700'}`}>
        Accessibility Settings
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex items-center justify-between">
          <span className={`text-sm ${highContrast ? 'text-gray-300' : 'text-gray-600'}`}>Text-to-Speech</span>
          <Switch checked={textToSpeech} onCheckedChange={setTextToSpeech} />
        </div>
        
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <span className={`text-sm ${highContrast ? 'text-gray-300' : 'text-gray-600'}`}>Symbol Size</span>
            <span className={`text-sm font-medium ${highContrast ? 'text-white' : ''}`}>{symbolSize}px</span>
          </div>
          <Slider 
            value={[symbolSize]}
            min={12}
            max={32}
            step={1}
            onValueChange={(value) => setSymbolSize(value[0])}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <span className={`text-sm ${highContrast ? 'text-gray-300' : 'text-gray-600'}`}>High Contrast</span>
          <Switch checked={highContrast} onCheckedChange={setHighContrast} />
        </div>
      </div>
    </div>
  );
};
