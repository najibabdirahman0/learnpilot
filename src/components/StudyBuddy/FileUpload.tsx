import { useState, useRef } from 'react';
import { Upload, FileText, Book, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FileUploadProps {
  onUpload: (content: string) => void;
}

export default function FileUpload({ onUpload }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [customContent, setCustomContent] = useState('');
  const [activeTab, setActiveTab] = useState<'file' | 'book' | 'custom'>('custom');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && (file.type === 'application/pdf' || file.type.includes('word') || file.type === 'text/plain')) {
      setFile(file);
      // Simulate file processing
      onUpload(`Content from uploaded file: ${file.name}\n\nThis is sample content that would be extracted from your uploaded file. In a real implementation, we would process PDF, Word, or text files and extract their content for study.`);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
      // Simulate file processing
      onUpload(`Content from selected file: ${file.name}\n\nThis is sample content that would be extracted from your uploaded file. In a real implementation, we would process PDF, Word, or text files and extract their content for study.`);
    }
  };

  const handleCustomSubmit = () => {
    if (customContent.trim()) {
      onUpload(customContent);
    }
  };

  const handleBookSelect = (bookTitle: string) => {
    const sampleContent = `# ${bookTitle}\n\nThis is sample content from ${bookTitle}. In a real implementation, this would contain actual textbook content or chapters that you could study with your AI assistant.\n\n## Key Concepts\n- Concept 1: Important foundational knowledge\n- Concept 2: Advanced applications\n- Concept 3: Real-world examples\n\n## Practice Questions\n1. What are the main principles?\n2. How do these apply in practice?\n3. What are common misconceptions?`;
    
    onUpload(sampleContent);
  };

  const sampleBooks = [
    'Introduction to Computer Science',
    'Data Structures and Algorithms',
    'Machine Learning Fundamentals',
    'Business Strategy',
    'Digital Marketing',
    'Psychology 101'
  ];

  return (
    <div className="space-y-6">
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setActiveTab('custom')}
          className={`flex-1 py-3 px-4 rounded-lg flex items-center justify-center gap-2 ${
            activeTab === 'custom'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <MessageSquare className="w-5 h-5" />
          Custom Input
        </button>
        <button
          onClick={() => setActiveTab('file')}
          className={`flex-1 py-3 px-4 rounded-lg flex items-center justify-center gap-2 ${
            activeTab === 'file'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <FileText className="w-5 h-5" />
          Upload File
        </button>
        <button
          onClick={() => setActiveTab('book')}
          className={`flex-1 py-3 px-4 rounded-lg flex items-center justify-center gap-2 ${
            activeTab === 'book'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Book className="w-5 h-5" />
          Select Book
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'custom' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white p-6 rounded-xl shadow-sm"
          >
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter your study material
              </label>
              <p className="text-sm text-gray-500 mb-4">
                Paste text, notes, or questions you'd like to study with your AI assistant.
              </p>
            </div>
            <textarea
              value={customContent}
              onChange={(e) => setCustomContent(e.target.value)}
              placeholder="Enter your study material, notes, or questions here...

Example:
# Machine Learning Basics
Machine learning is a subset of artificial intelligence that enables computers to learn and make decisions from data without being explicitly programmed for every task.

## Key Concepts:
- Supervised Learning
- Unsupervised Learning  
- Neural Networks"
              className="w-full h-48 p-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
            <button
              onClick={handleCustomSubmit}
              disabled={!customContent.trim()}
              className="mt-4 w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Start Studying
            </button>
          </motion.div>
        )}

        {activeTab === 'file' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white p-6 rounded-xl shadow-sm"
          >
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors"
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
            >
              {file ? (
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <FileText className="w-6 h-6 text-blue-600 mr-3" />
                    <div className="text-left">
                      <span className="text-sm font-medium text-gray-900">{file.name}</span>
                      <p className="text-xs text-gray-500">Ready to process</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setFile(null)}
                    className="text-gray-400 hover:text-gray-500 ml-4"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div>
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg font-medium text-gray-900 mb-2">Upload your study material</p>
                  <p className="text-gray-600 mb-4">Drag and drop your file here, or click to browse</p>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                  >
                    Choose File
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <p className="text-xs text-gray-500 mt-3">
                    Supports PDF, Word documents, and text files
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {activeTab === 'book' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white p-6 rounded-xl shadow-sm"
          >
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Textbook</h3>
              <p className="text-sm text-gray-500">Choose from our library of educational content</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sampleBooks.map((book, index) => (
                <button
                  key={index}
                  onClick={() => handleBookSelect(book)}
                  className="p-4 text-left border border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors"
                >
                  <div className="flex items-center">
                    <Book className="w-8 h-8 text-blue-600 mr-3" />
                    <div>
                      <h4 className="font-medium text-gray-900">{book}</h4>
                      <p className="text-sm text-gray-500">Sample content available</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}