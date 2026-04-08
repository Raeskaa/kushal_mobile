import { useState } from 'react';
import { CopilotAwareInput } from './CopilotAwareInput';
import { Button } from './ui/button';
import { Sparkles, Users, MessageSquare, Calendar } from 'lucide-react';

export function CopilotShowcase() {
  const [communityName, setCommunityName] = useState('');
  const [description, setDescription] = useState('');
  const [targetAudience, setTargetAudience] = useState('');

  return (
    <div className="max-w-3xl mx-auto p-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Sparkles className="size-6 text-purple-600" />
          <h1 className="text-2xl font-bold text-gray-900">AI Copilot Showcase</h1>
        </div>
        <p className="text-gray-600">
          Try focusing on different fields to see the AI copilot provide contextual suggestions and help!
        </p>
      </div>

      <div className="space-y-6 bg-white rounded-lg border border-gray-200 p-6">
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Community Name
          </label>
          <CopilotAwareInput
            fieldName="Community Name"
            value={communityName}
            onChange={(e) => setCommunityName(e.target.value)}
            placeholder="Enter your community name..."
            className="w-full"
          />
          <p className="text-xs text-gray-500 mt-1">
            💡 Focus here to see naming suggestions and best practices
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Description
          </label>
          <CopilotAwareInput
            type="textarea"
            fieldName="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your community..."
            rows={4}
            className="w-full"
          />
          <p className="text-xs text-gray-500 mt-1">
            💡 Focus here to see engaging description templates
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Target Audience
          </label>
          <CopilotAwareInput
            fieldName="Target Audience"
            value={targetAudience}
            onChange={(e) => setTargetAudience(e.target.value)}
            placeholder="Who is this community for?"
            className="w-full"
          />
          <p className="text-xs text-gray-500 mt-1">
            💡 Focus here to get audience targeting help
          </p>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="justify-start">
              <Users className="size-4 mr-2" />
              Add Members
            </Button>
            <Button variant="outline" className="justify-start">
              <MessageSquare className="size-4 mr-2" />
              Create Channels
            </Button>
            <Button variant="outline" className="justify-start">
              <Calendar className="size-4 mr-2" />
              Schedule Event
            </Button>
            <Button variant="outline" className="justify-start">
              <Sparkles className="size-4 mr-2" />
              AI Generate
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
        <h3 className="text-sm font-medium text-purple-900 mb-2">How to use the AI Copilot:</h3>
        <ul className="text-xs text-purple-800 space-y-1">
          <li>• <strong>Builder Mode:</strong> Get smart suggestions and templates based on what you're editing</li>
          <li>• <strong>Helper Mode:</strong> Ask questions and get guidance in natural language</li>
          <li>• <strong>Analyst Mode:</strong> View metrics, predictions, and insights about your community</li>
          <li>• The copilot automatically detects which field you're focused on and provides relevant help</li>
          <li>• Click "Apply" on any suggestion to use it instantly</li>
        </ul>
      </div>
    </div>
  );
}
