
import React, { useState, useEffect, useRef } from 'react';
import { generateReadingTest } from '../services/geminiService';
import { ReadingTestContent, TestResult } from '../types';
import { Loader2, Timer, CheckCircle, ArrowRight, Play, Square } from 'lucide-react';

interface SpeedReadingTestProps {
  onTestComplete: (result: TestResult) => void;
  age: number;
}

const SpeedReadingTest: React.FC<SpeedReadingTestProps> = ({ onTestComplete, age }) => {
  const [step, setStep] = useState<'loading' | 'prepare' | 'reading' | 'quiz' | 'result'>('loading');
  const [content, setContent] = useState<ReadingTestContent | null>(null);
  const [startTime, setStartTime] = useState<number>(0);
  const [endTime, setEndTime] = useState<number>(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [score, setScore] = useState<number>(0);
  const [wpm, setWpm] = useState<number>(0);

  useEffect(() => {
    loadTest();
  }, []);

  const loadTest = async () => {
    setStep('loading');
    try {
      const data = await generateReadingTest(age);
      setContent(data);
      setStep('prepare');
    } catch (err) {
      console.error(err);
    }
  };

  const handleStartReading = () => {
    setStartTime(Date.now());
    setStep('reading');
  };

  const handleStopReading = () => {
    setEndTime(Date.now());
  };

  const handleCalculateAndGoToQuiz = () => {
    if (!content || !startTime || !endTime) return;
    const durationSeconds = (endTime - startTime) / 1000;
    const wordCount = content.text.split(/\s+/).length;
    const calculatedWpm = Math.round((wordCount / durationSeconds) * 60);
    setWpm(calculatedWpm);
    setStep('quiz');
  };

  const handleQuizSubmit = () => {
    if (!content) return;
    let correctCount = 0;
    content.questions.forEach((q, idx) => {
      if (answers[idx] === q.correctAnswer) correctCount++;
    });
    const comprehensionScore = Math.round((correctCount / content.questions.length) * 100);
    setScore(comprehensionScore);
    setStep('result');
    onTestComplete({ wpm, comprehension: comprehensionScore, timestamp: Date.now() });
  };

  if (step === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <Loader2 className="animate-spin text-indigo-600 mb-4" size={48} />
        <h3 className="text-xl font-semibold">Przygotowywanie tekstu...</h3>
        <p className="text-slate-500">Generujemy treść dostosowaną do wieku {age} lat.</p>
      </div>
    );
  }

  if (step === 'prepare') {
    return (
      <div className="bg-white rounded-3xl p-12 shadow-sm border border-slate-100 text-center">
        <h2 className="text-2xl font-bold mb-4">Gotowy do testu?</h2>
        <p className="text-slate-500 mb-8">Tekst został dostosowany do Twojego wieku ({age} lat). Kliknij START, aby rozpocząć.</p>
        <button 
          onClick={handleStartReading}
          className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-bold text-xl flex items-center gap-3 mx-auto shadow-xl hover:bg-indigo-700"
        >
          <Play fill="currentColor" size={24} /> Rozpocznij Czytanie
        </button>
      </div>
    );
  }

  if (step === 'reading' && content) {
    const isFinished = endTime > 0;
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-slate-100 max-w-3xl mx-auto relative overflow-hidden">
           {isFinished && <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center z-20">
              <div className="bg-white p-8 rounded-3xl shadow-2xl border border-slate-100 text-center animate-in zoom-in">
                <h3 className="text-xl font-bold text-slate-900 mb-2">Czas zatrzymany!</h3>
                <p className="text-slate-500 mb-6">Czytanie zakończone. Możesz teraz obliczyć WPM i przejść do pytań.</p>
                <button 
                  onClick={handleCalculateAndGoToQuiz}
                  className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 mx-auto hover:bg-indigo-700"
                >
                  Oblicz WPM i Rozpocznij Quiz <ArrowRight size={20} />
                </button>
              </div>
           </div>}

          <div className="flex justify-between items-center mb-8 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2 text-indigo-600 font-bold">
              <Timer size={20} />
              <span>TEST W TOKU</span>
            </div>
            {!isFinished && (
              <button 
                onClick={handleStopReading}
                className="bg-red-50 text-red-600 px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-red-100 border border-red-200"
              >
                <Square size={16} fill="currentColor" /> STOP CZYTANIA
              </button>
            )}
          </div>
          
          <div className="prose prose-slate max-w-none leading-relaxed text-xl text-slate-800 font-light">
            {content.text.split('\n').map((para, idx) => (
              <p key={idx} className="mb-6">{para}</p>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (step === 'quiz' && content) {
    return (
      <div className="space-y-6">
        <div className="bg-indigo-600 text-white p-10 rounded-3xl shadow-xl flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">Quiz Zrozumienia</h2>
            <p className="opacity-80">Twój wynik WPM: <span className="font-bold underline">{wpm}</span>. Teraz sprawdźmy ile zapamiętałeś.</p>
          </div>
          <div className="hidden md:block bg-white/20 p-4 rounded-2xl backdrop-blur-md">
            <div className="text-center">
              <p className="text-xs uppercase font-bold opacity-70">Postęp</p>
              <p className="text-2xl font-black">{answers.filter(a => a !== undefined).length}/10</p>
            </div>
          </div>
        </div>

        {content.questions.map((q, idx) => (
          <div key={idx} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:border-indigo-200 transition-colors">
            <p className="font-bold text-xl mb-6 text-slate-900">{idx + 1}. {q.question}</p>
            <div className="grid grid-cols-1 gap-3">
              {q.options.map((opt, optIdx) => (
                <button
                  key={optIdx}
                  onClick={() => {
                    const newAnswers = [...answers];
                    newAnswers[idx] = optIdx;
                    setAnswers(newAnswers);
                  }}
                  className={`p-4 rounded-xl text-left border-2 transition-all ${
                    answers[idx] === optIdx 
                      ? 'bg-indigo-50 border-indigo-600 text-indigo-700 font-bold' 
                      : 'border-slate-100 hover:bg-slate-50 text-black'
                  }`}
                >
                  <span className="inline-block w-8 h-8 rounded-lg bg-slate-100 text-slate-500 font-bold text-center leading-8 mr-3">
                    {String.fromCharCode(65 + optIdx)}
                  </span>
                  {opt}
                </button>
              ))}
            </div>
          </div>
        ))}

        <button 
          onClick={handleQuizSubmit}
          disabled={answers.filter(a => a !== undefined).length < 10}
          className="w-full bg-emerald-600 text-white py-6 rounded-3xl font-black text-2xl shadow-xl hover:bg-emerald-700 disabled:opacity-30 disabled:grayscale transition-all"
        >
          OBLICZ % ZROZUMIENIA
        </button>
      </div>
    );
  }

  if (step === 'result') {
    return (
      <div className="text-center bg-white p-16 rounded-[40px] shadow-2xl border border-slate-100 animate-in zoom-in duration-500">
        <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8 ring-8 ring-emerald-50">
          <CheckCircle size={56} />
        </div>
        <h2 className="text-4xl font-black text-slate-900 mb-4">Wyniki Analizy</h2>
        <p className="text-slate-500 mb-12 text-lg">Twój profil czytelniczy z tej sesji:</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-indigo-50 p-10 rounded-[32px] border border-indigo-100 group hover:scale-105 transition-transform">
            <p className="text-sm text-indigo-600 font-bold uppercase tracking-widest mb-2">Prędkość (WPM)</p>
            <p className="text-6xl font-black text-indigo-700 mb-1">{wpm}</p>
            <p className="text-sm text-indigo-400">słów na minutę</p>
          </div>
          <div className="bg-emerald-50 p-10 rounded-[32px] border border-emerald-100 group hover:scale-105 transition-transform">
            <p className="text-sm text-emerald-600 font-bold uppercase tracking-widest mb-2">Zrozumienie</p>
            <p className="text-6xl font-black text-emerald-700 mb-1">{score}%</p>
            <p className="text-sm text-emerald-400">poprawnych odpowiedzi</p>
          </div>
        </div>

        <button 
          onClick={() => window.location.reload()}
          className="px-12 py-5 bg-slate-900 text-white font-bold rounded-2xl hover:bg-black transition-all shadow-xl"
        >
          Zakończ Sesję
        </button>
      </div>
    );
  }

  return null;
};

export default SpeedReadingTest;
