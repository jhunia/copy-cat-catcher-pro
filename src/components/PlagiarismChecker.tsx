
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import ResultsPanel from './ResultsPanel';
import { CheckCircle, AlertCircle, FileQuestion, RefreshCw } from 'lucide-react';
import { detectPlagiarism, generateReport } from '@/lib/plagiarismUtils';

export interface PlagiarismResult {
  originalText: string;
  plagiarismScore: number;
  matchedSources: Array<{
    url: string;
    matchedText: string;
    confidence: number;
  }>;
  highlightedText: string;
}

const PlagiarismChecker: React.FC = () => {
  const [text, setText] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<PlagiarismResult | null>(null);
  const [activeTab, setActiveTab] = useState('input');
  
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const handleCheck = async () => {
    if (!text.trim()) {
      toast.error("Please enter text to check for plagiarism.");
      return;
    }

    setIsChecking(true);
    setProgress(0);
    setActiveTab('input');
    
    // Simulate progress updates
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + Math.floor(Math.random() * 10) + 5;
      });
    }, 500);

    try {
      // In a real app, this would make an API call to a plagiarism detection service
      const plagiarismResult = await detectPlagiarism(text);
      
      setTimeout(() => {
        setResult(plagiarismResult);
        setProgress(100);
        setIsChecking(false);
        setActiveTab('results');
        clearInterval(progressInterval);
        toast.success("Plagiarism check completed!");
      }, 3000);
    } catch (error) {
      console.error("Error detecting plagiarism:", error);
      toast.error("Failed to complete plagiarism check. Please try again.");
      setIsChecking(false);
      clearInterval(progressInterval);
    }
  };

  const handleReset = () => {
    setText('');
    setResult(null);
    setActiveTab('input');
  };

  const handleDownloadReport = () => {
    if (!result) return;
    
    try {
      const reportBlob = generateReport(result);
      const url = URL.createObjectURL(reportBlob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `plagiarism-report-${new Date().toISOString().slice(0, 10)}.pdf`;
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success("Report downloaded successfully!");
    } catch (error) {
      console.error("Error generating report:", error);
      toast.error("Failed to download report. Please try again.");
    }
  };

  const textLength = text.length;
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card className="shadow-lg border-navy/10">
        <CardHeader className="bg-navy text-white rounded-t-lg">
          <CardTitle className="flex items-center text-2xl">
            <FileQuestion className="mr-2" size={28} />
            Copy Cat Catcher Pro
          </CardTitle>
          <CardDescription className="text-gray-200">
            Check your content for plagiarism and ensure your work is original.
          </CardDescription>
        </CardHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="px-6 pt-4">
            <TabsList className="w-full grid grid-cols-2">
              <TabsTrigger value="input" disabled={isChecking}>Text Input</TabsTrigger>
              <TabsTrigger value="results" disabled={!result}>Results</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="input">
            <CardContent className="pt-4 pb-0">
              <div className="space-y-4">
                <Textarea 
                  placeholder="Paste your text here to check for plagiarism..."
                  className="min-h-[300px] resize-y"
                  value={text}
                  onChange={handleTextChange}
                  disabled={isChecking}
                />
                
                <div className="flex justify-between text-sm text-gray-500">
                  <span>{wordCount} words</span>
                  <span>{textLength} characters</span>
                </div>
                
                {isChecking && (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Checking for plagiarism...</span>
                      <span className="text-sm">{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                )}
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-between pt-4">
              <Button
                variant="outline"
                onClick={handleReset}
                disabled={isChecking || !text}
              >
                Clear
              </Button>
              <Button
                onClick={handleCheck}
                disabled={isChecking || !text.trim()}
                className="bg-navy hover:bg-navy/90"
              >
                {isChecking ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Checking...
                  </>
                ) : (
                  'Check for Plagiarism'
                )}
              </Button>
            </CardFooter>
          </TabsContent>
          
          <TabsContent value="results">
            {result && (
              <CardContent className="space-y-4 pt-4">
                <ResultsPanel result={result} />
                
                <Separator />
                
                <div className="flex justify-end">
                  <Button
                    variant="outline"
                    className="mr-2"
                    onClick={handleReset}
                  >
                    Check New Text
                  </Button>
                  <Button 
                    onClick={handleDownloadReport}
                    className="bg-navy hover:bg-navy/90"
                  >
                    Download Report
                  </Button>
                </div>
              </CardContent>
            )}
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default PlagiarismChecker;
