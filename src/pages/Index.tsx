
import PlagiarismChecker from "@/components/PlagiarismChecker";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { MessageSquare } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-gray-100">
      <header className="py-8 bg-navy text-white text-center">
        <h1 className="text-4xl font-bold mb-2">Copy Cat Catcher Pro</h1>
        <p className="text-xl text-gray-200 max-w-2xl mx-auto">
          The professional tool for detecting plagiarism in academic papers, articles, and content
        </p>
        <div className="mt-4">
          <Link to="/chat">
            <Button variant="outline" className="text-white border-white hover:bg-white/10">
              <MessageSquare className="mr-2 h-4 w-4" />
              Talk to Educational Assistant
            </Button>
          </Link>
        </div>
      </header>
      
      <main className="flex-1 container px-4 py-10">
        <PlagiarismChecker />
        
        <div className="mt-16 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-6 text-navy">How It Works</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-12 h-12 bg-navy/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-navy font-bold text-xl">1</span>
              </div>
              <h3 className="font-semibold mb-2 text-navy">Paste Your Content</h3>
              <p className="text-gray-600 text-sm">Enter or paste the text you want to check for plagiarism</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-12 h-12 bg-navy/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-navy font-bold text-xl">2</span>
              </div>
              <h3 className="font-semibold mb-2 text-navy">We Analyze It</h3>
              <p className="text-gray-600 text-sm">Our system compares your text against billions of web sources</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-12 h-12 bg-navy/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-navy font-bold text-xl">3</span>
              </div>
              <h3 className="font-semibold mb-2 text-navy">Get Results</h3>
              <p className="text-gray-600 text-sm">View your plagiarism score, highlighted matches, and download reports</p>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="bg-navy text-white py-4 text-center text-sm">
        <p>© {new Date().getFullYear()} Copy Cat Catcher Pro | All Rights Reserved</p>
      </footer>
    </div>
  );
};

export default Index;
