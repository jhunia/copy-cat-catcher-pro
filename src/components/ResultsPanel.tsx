
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PlagiarismResult } from './PlagiarismChecker';
import { AlertTriangle, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface ResultsPanelProps {
  result: PlagiarismResult;
}

const ResultsPanel: React.FC<ResultsPanelProps> = ({ result }) => {
  const { plagiarismScore, matchedSources, highlightedText } = result;
  
  const getPlagiarismLevel = () => {
    if (plagiarismScore < 15) return { label: 'Low', color: 'green', icon: <CheckCircle className="h-5 w-5" /> };
    if (plagiarismScore < 40) return { label: 'Moderate', color: 'amber', icon: <AlertTriangle className="h-5 w-5" /> };
    return { label: 'High', color: 'red', icon: <AlertCircle className="h-5 w-5" /> };
  };
  
  const plagiarismLevel = getPlagiarismLevel();
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <h3 className="text-xl font-semibold">Plagiarism Score</h3>
          <p className="text-sm text-gray-500">Analysis results of your content</p>
        </div>
        <div className="flex items-center">
          <div className={`text-${plagiarismLevel.color}-600 mr-2`}>{plagiarismLevel.icon}</div>
          <div className="flex flex-col items-end">
            <span className={`text-2xl font-bold ${
              plagiarismScore < 15 ? 'text-green-600' : 
              plagiarismScore < 40 ? 'text-amber-600' : 
              'text-red-600'
            }`}>
              {plagiarismScore}%
            </span>
            <Badge className={`
              ${plagiarismScore < 15 ? 'bg-green-100 text-green-800' : 
                plagiarismScore < 40 ? 'bg-amber-100 text-amber-800' : 
                'bg-red-100 text-red-800'}
            `}>
              {plagiarismLevel.label} Plagiarism
            </Badge>
          </div>
        </div>
      </div>
      
      <Card>
        <CardHeader className="py-3">
          <CardTitle className="text-sm font-medium">Highlighted Content</CardTitle>
        </CardHeader>
        <CardContent className="p-4 bg-gray-50 rounded-b-lg">
          <ScrollArea className="h-[200px]">
            <div className="text-sm" dangerouslySetInnerHTML={{ __html: highlightedText }} />
          </ScrollArea>
        </CardContent>
      </Card>
      
      <div>
        <h3 className="text-lg font-semibold mb-2">Matched Sources ({matchedSources.length})</h3>
        <div className="space-y-3">
          {matchedSources.map((source, index) => (
            <Card key={index} className="overflow-hidden">
              <div className="flex items-center p-3 bg-gray-50">
                <div className="flex-1 truncate">
                  <a 
                    href={source.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center text-navy hover:underline font-medium"
                  >
                    {source.url.replace(/^https?:\/\//, '').split('/')[0]}
                    <ExternalLink className="ml-1 h-3 w-3" />
                  </a>
                </div>
                <div>
                  <Badge className="bg-navy">{source.confidence}% match</Badge>
                </div>
              </div>
              <div className="p-3 text-sm">
                <p className="italic text-gray-700">"{source.matchedText}"</p>
              </div>
            </Card>
          ))}
          
          {matchedSources.length === 0 && (
            <div className="text-center p-4 border rounded-lg bg-gray-50">
              <p className="text-gray-500">No matching sources found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResultsPanel;
