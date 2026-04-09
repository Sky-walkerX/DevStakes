import { useState } from 'react';
import { FileText, Wand2, Loader2, AlertTriangle, Gamepad2, BrainCircuit } from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';

// Provided Groq Key
const GROQ_API_KEY = "Use your GROQ KEY Here";

export function AIGenerator({ addQuizzes, addFlashcards, setCurrentView }) {
  const [textMode, setTextMode] = useState(true);
  const [inputText, setInputText] = useState("");
  const [fileName, setFileName] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorStatus, setErrorStatus] = useState("");

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== "text/plain") {
      setErrorStatus("Only .txt files are supported for notes payload MVP.");
      return;
    }

    setFileName(file.name);
    setErrorStatus("");

    const reader = new FileReader();
    reader.onload = (e) => {
      setInputText(e.target.result);
    };
    reader.readAsText(file);
  };

  const generateContent = async (type) => {
    if (!inputText.trim()) {
      setErrorStatus("Please provide some study material first!");
      return;
    }

    setIsGenerating(true);
    setErrorStatus("");

    try {
      let prompt = "";
      if (type === 'quiz') {
        prompt = `Based on the following notes, generate 5 multiple-choice questions. 
Respond ONLY with a valid JSON array of objects. Do not include markdown formatting or \`\`\`json blocks.
Format each object EXACTLY like this:
{ "question": "Question text here", "options": ["Option A", "Option B", "Option C", "Option D"], "answerIndex": 0 }

Notes:
${inputText}`;
      } else {
        prompt = `Based on the following notes, generate 5 study flashcards. 
Respond ONLY with a valid JSON array of objects. Do not include markdown formatting or \`\`\`json blocks.
Format each object EXACTLY like this:
{ "term": "Concept Name", "definition": "Brief definition of the concept" }

Notes:
${inputText}`;
      }

      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant", // Fast and reliable open-source model through Groq
          messages: [{ role: "user", content: prompt }],
          temperature: 0.2 // Reduced temperature for strict JSON determinism
        })
      });

      if (!response.ok) {
        throw new Error(`Groq API Error -> [Status ${response.status}]`);
      }

      const data = await response.json();
      const responseText = data.choices[0].message.content;

      console.log("Raw AI Response:", responseText); // For debugging locally

      // Extract the JSON array robustly ignoring conversational wrappers
      const jsonMatch = responseText.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        throw new Error("AI did not return a valid JSON array format.");
      }

      const parsedData = JSON.parse(jsonMatch[0]);

      if (!Array.isArray(parsedData)) throw new Error("Expected an array from AI");

      if (type === 'quiz') {
        const mappedQuizzes = parsedData.map((q, idx) => ({
          id: Date.now() + idx,
          question: q.question || "Invalid Question Generated",
          options: q.options || ["A", "B", "C", "D"],
          answerIndex: q.answerIndex !== undefined ? q.answerIndex : 0
        }));
        addQuizzes(mappedQuizzes);
        setCurrentView('quiz');
      } else {
        const mappedCards = parsedData.map((c, idx) => ({
          id: Date.now() + idx,
          term: c.term || "Invalid Term Generated",
          definition: c.definition || "No def provided."
        }));
        addFlashcards(mappedCards);
        setCurrentView('flashcards');
      }

    } catch (err) {
      console.error(err);
      setErrorStatus("AI Error: " + (err.message || "Failed to parse generation."));
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto mt-4">
      <div className="bg-gradient-to-r from-primary-600/20 to-accent/20 border border-primary-500/30 rounded-2xl p-6 md:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/20 blur-[100px] rounded-full pointer-events-none" />
        <div className="flex items-center space-x-3 mb-2 relative z-10">
          <Wand2 className="w-8 h-8 text-primary-400" />
          <h2 className="text-2xl md:text-3xl font-bold text-white">Generate with AI</h2>
        </div>
        <p className="text-gray-400 max-w-lg text-base relative z-10">
          Paste your notes or upload a text file, and our Gemini-powered AI will automatically craft custom Daily Quizzes or Smart Flashcards for you!
        </p>
      </div>

      <div className="flex space-x-4">
        <Button variant={textMode ? "primary" : "secondary"} onClick={() => setTextMode(true)}>
          Paste Text
        </Button>
        <Button variant={!textMode ? "primary" : "secondary"} onClick={() => setTextMode(false)}>
          Upload .TXT File
        </Button>
      </div>

      <Card className="min-h-[300px] flex flex-col justify-between">
        {textMode ? (
          <textarea
            className="w-full h-48 bg-cardBorder/50 rounded-lg p-4 text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-primary-500 resize-none border border-cardBorder"
            placeholder="Paste your study notes here..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
        ) : (
          <div className="h-48 border-2 border-dashed border-cardBorder rounded-xl flex flex-col items-center justify-center p-8 bg-cardBorder/20 relative hover:border-primary-500/50 transition-colors">
            <input
              type="file"
              accept=".txt"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={handleFileUpload}
            />
            <FileText className="w-12 h-12 text-primary-400 mb-4" />
            <h3 className="text-xl font-bold mb-2">Upload Notes</h3>
            <p className="text-gray-400 text-center text-sm">Drag and drop a .txt file here, or click to browse</p>
            {fileName && <p className="mt-4 text-green-400 font-medium">Ready: {fileName}</p>}
          </div>
        )}

        {errorStatus && (
          <div className="mt-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg flex items-center space-x-3 text-red-200">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <span className="text-sm">{errorStatus}</span>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 mt-6">
          <Button
            className="flex-1 flex items-center justify-center space-x-2"
            disabled={isGenerating}
            onClick={() => generateContent('quiz')}
          >
            {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Gamepad2 className="w-5 h-5" />}
            <span>Generate Quiz</span>
          </Button>

          <Button
            variant="outline"
            className="flex-1 flex items-center justify-center space-x-2 border-accent text-accent focus:ring-accent hover:bg-accent/10"
            disabled={isGenerating}
            onClick={() => generateContent('flashcards')}
          >
            {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <BrainCircuit className="w-5 h-5" />}
            <span>Generate Flashcards</span>
          </Button>
        </div>
      </Card>
    </div>
  );
}
