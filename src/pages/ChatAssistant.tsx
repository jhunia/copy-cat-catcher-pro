
import React from 'react';
import EducationalChatbot from '@/components/EducationalChatbot';

const ChatAssistant: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-gray-100">
      <header className="py-8 bg-navy text-white text-center">
        <h1 className="text-4xl font-bold mb-2">Educational Assistant</h1>
        <p className="text-xl text-gray-200 max-w-2xl mx-auto">
          Get help with academic writing, citations, and proper research techniques
        </p>
      </header>
      
      <main className="flex-1 container px-4 py-10">
        <EducationalChatbot />
      </main>
      
      <footer className="bg-navy text-white py-4 text-center text-sm">
        <p>© {new Date().getFullYear()} Copy Cat Catcher Pro | All Rights Reserved</p>
      </footer>
    </div>
  );
};

export default ChatAssistant;
