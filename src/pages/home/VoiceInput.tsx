/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prettier/prettier */
import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import {
  Mic,
  MicOff,
  CheckCircle,
  RotateCcw,
  Sparkles,
  BrainCircuit,
  Trophy,
  Timer,
} from "lucide-react";

import image from "../../assets/images/only.png"
const SpeechRecognition =
  (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

const VoiceInput = () => {
  const [isListening, setIsListening] = useState(false);
  const [foundIndices, setFoundIndices] = useState<number[]>([]);
  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const recognitionRef = useRef<any>(null);

  // Refs to keep track of state without triggering re-runs of the recognition effect
  const foundIndicesRef = useRef<number[]>([]);
  const transcriptRef = useRef("");

  // State for immediate feedback
  const [feedback, setFeedback] = useState<{ text: string; status: "correct" | "wrong" | null }>({
    text: "",
    status: null,
  });

  useEffect(() => {
    foundIndicesRef.current = foundIndices;
  }, [foundIndices]);

  useEffect(() => {
    transcriptRef.current = transcript;
  }, [transcript]);

  // Fuzzy matching helper (Word-overlap based for sentence support)
  const isSimiliarEnough = (input: string, target: string) => {
    const s = input.toLowerCase().trim();
    const t = target.toLowerCase().trim();

    // Direct match or substring
    if (s.includes(t) || t.includes(s)) return true;

    const sWords = s.split(/\s+/).filter((w) => w.length > 2);
    const tWords = t.split(/\s+/).filter((w) => w.length > 2);

    if (tWords.length === 0) return false;

    // Check how many target words are represented in the input sentence
    const matches = tWords.filter((tw) =>
      sWords.some((sw) => sw.includes(tw) || tw.includes(sw)),
    );

    const score = matches.length / tWords.length;
    return score >= 0.8;
  };

  const question = "What skills matter more than grades for data & AI freshers?";

  const skillCriteria = useMemo(
    () => [
      {
        answer: "Learning Agility",
        similar: [
          "adaptability",
          "continuous learning",
          "growth mindset",
          "learn fast",
          "willingness to learn",
          "quick learner",
          "rapid learning",
          "flexible learner",
          "learning mindset",
          "agile learner",
          "keep learning",
          "adaptive learning",
        ],
      },
      {
        answer: "Problem Thinking",
        similar: [
          "critical thinking",
          "logical reasoning",
          "analytical",
          "structured thinking",
          "problem solving",
          "logical thinking",
          "rational thinking",
          "analysis skills",
          "cognitive thinking",
          "troubleshooting",
          "solution oriented",
        ],
      },
      {
        answer: "Communication Clarity",
        similar: [
          "articulation",
          "expression",
          "clarity",
          "speaking",
          "presentation",
          "verbal skills",
          "effective communication",
          "clear speaking",
          "talk well",
          "dialogue skills",
          "interpersonal communication",
        ],
      },
      {
        answer: "Ownership Mindset",
        similar: [
          "accountability",
          "responsibility",
          "initiative",
          "proactive",
          "self driven",
          "taking charge",
          "responsible attitude",
          "ownership",
          "self managed",
          "independent worker",
          "taking lead",
        ],
      },
      {
        answer: "Comfort with Ambiguity",
        similar: [
          "uncertainty",
          "flexible",
          "changing environments",
          "handling unknown",
          "dealing with change",
          "adaptable to change",
          "thriving in chaos",
          "managing uncertainty",
          "flexible mindset",
        ],
      },
      {
        answer: "Collaboration",
        similar: [
          "teamwork",
          "people skills",
          "empathy",
          "cooperation",
          "team player",
          "working together",
          "joint effort",
          "collective work",
          "group work",
          "cooperative",
          "synergy",
        ],
      },
      {
        answer: "Ethics & Trust",
        similar: [
          "integrity",
          "trustworthy",
          "professionalism",
          "honesty",
          "ethical",
          "moral",
          "reliable",
          "reliability",
          "faithful",
          "conscientious",
          "moral values",
        ],
      },
      {
        answer: "Business Curiosity",
        similar: [
          "acumen",
          "commercial awareness",
          "business sense",
          "curious about business",
          "market awareness",
          "business logic",
          "understanding business",
          "enterprise thinking",
          "strategy awareness",
        ],
      },
      {
        answer: "Resilience & Grit",
        similar: [
          "perseverance",
          "toughness",
          "hard work",
          "persistent",
          "determination",
          "endurance",
          "staying power",
          "mental strength",
          "resolve",
          "persistence",
        ],
      },
      {
        answer: "Professionalism",
        similar: [
          "discipline",
          "etiquette",
          "work ethic",
          "conduct",
          "professional conduct",
          "punctuality",
          "workplace manners",
          "office etiquette",
          "corporate behavior",
        ],
      },
    ],
    [],
  );

  // Voice setup with enhanced phrase-tracking and TTS
  useEffect(() => {
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    // Text-to-Speech helper
    const speakResult = (text: string) => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.2;
      window.speechSynthesis.speak(utterance);
    };

    recognition.onstart = () => {
      console.log("🎤 Mode Active: Continuous Listening...");
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      let finalStr = "";
      let interimStr = "";

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) finalStr += event.results[i][0].transcript;
        else interimStr += event.results[i][0].transcript;
      }

      if (interimStr) {
        setInterimTranscript(interimStr);
      }

      if (finalStr) {
        const cleanedPhrase = finalStr.trim().toLowerCase();
        setTranscript((prev) => (prev + " " + finalStr).trim());
        setInterimTranscript("");

        // Check for incomplete phrases first (only if the whole transcript is just one of these)
        const incompletePhrases = ["values", "sense", "awareness", "clarity", "mindset"];
        if (incompletePhrases.includes(cleanedPhrase)) {
          speakResult("Please complete the word");
          setFeedback({ text: `"${cleanedPhrase}" - Please complete the word`, status: "wrong" });
          setTimeout(
            () =>
              setFeedback((prev) => (prev.status === "wrong" ? { text: "", status: null } : prev)),
            3000,
          );
          return;
        }

        const newMatchIndices: number[] = [];
        const alreadyFoundNames: string[] = [];

        skillCriteria.forEach((item, index) => {
          const isMatch =
            isSimiliarEnough(cleanedPhrase, item.answer) ||
            item.similar.some((s) => isSimiliarEnough(cleanedPhrase, s));

          if (isMatch) {
            if (foundIndicesRef.current.includes(index)) {
              alreadyFoundNames.push(item.answer);
            } else {
              newMatchIndices.push(index);
            }
          }
        });

        if (newMatchIndices.length > 0) {
          // Identify all new skills found in this sentence
          const matchedNames = newMatchIndices.map((idx) => skillCriteria[idx].answer);
          setFoundIndices((prev) => [...new Set([...prev, ...newMatchIndices])]);

          speakResult(
            `Correct! ${newMatchIndices.length > 1 ? "Found: " : ""}${matchedNames.join(", ")}`,
          );
          setFeedback({ text: `Matched: ${matchedNames.join(", ")}`, status: "correct" });
        } else if (alreadyFoundNames.length > 0) {
          const name = alreadyFoundNames[0];
          speakResult(`${name} was already answered`);
          setFeedback({ text: `"${name}" - Already answered`, status: "wrong" });
          setTimeout(
            () =>
              setFeedback((prev) => (prev.status === "wrong" ? { text: "", status: null } : prev)),
            3000,
          );
        } else {
          setFeedback({ text: `"${cleanedPhrase}" - Try another keyword`, status: "wrong" });
          setTimeout(
            () =>
              setFeedback((prev) => (prev.status === "wrong" ? { text: "", status: null } : prev)),
            3000,
          );
        }
      }
    };

    recognition.onend = () => {
      if (isListening) recognition.start();
    };

    recognition.onerror = (e: any) => {
      console.error("⚠️ Recognition Error:", e.error);
      if (e.error === "network") {
        alert("Network error. Please check your internet connection.");
        setIsListening(false);
      }
    };

    recognitionRef.current = recognition;
    if (isListening) recognition.start();

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.onend = null;
        recognitionRef.current.stop();
      }
    };
  }, [isListening, skillCriteria]);

  const toggleVoice = () => {
    if (isListening) {
      setIsListening(false);
      recognitionRef.current?.stop();
    } else {
      setIsListening(true);
      setTranscript("");
      setInterimTranscript("");
      setFeedback({ text: "", status: null });
    }
  };

  const resetGame = () => {
    setFoundIndices([]);
    setTranscript("");
    setInterimTranscript("");
    setFeedback({ text: "", status: null });
    setIsListening(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 md:p-8 font-sans overflow-x-hidden">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="bg-white rounded-2xl md:rounded-3xl p-5 md:p-8 shadow-xl border border-slate-100 relative">
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 mb-6">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0 overflow-hidden border border-slate-100">
              <img src={image} alt="GWC Logo" className="w-full h-full object-contain p-1.5" />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-sm md:text-base font-medium leading-snug text-slate-700">
                What skills matter more than grades for freshers in data & AI companies like GWC,
                beyond good grades?
              </h1>
            </div>
            <div className="bg-[#4889C8] rounded-xl px-4 py-2 md:px-5 md:py-3 text-white flex-shrink-0">
              <span className="text-xl md:text-2xl font-black">{foundIndices.length}</span>
              <span className="text-xs md:text-sm opacity-30 ml-1">/ 10</span>
            </div>
          </div>

          {/* Feedback Indicator */}
          <div
            className={`h-8 md:h-10 flex items-center justify-center transition-all ${feedback.status ? "opacity-100" : "opacity-0"}`}
          >
            <span
              className={`px-3 py-1 md:px-4 md:py-1 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wider shadow-sm text-center ${
                feedback.status === "correct"
                  ? "bg-[#FD7E14] text-white"
                  : "bg-rose-100 text-rose-600"
              }`}
            >
              {feedback.status === "correct" ? "✓ Match Found!" : feedback.text}
            </span>
          </div>

          {/* Slots Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 md:gap-x-10 gap-y-3 mt-4">
            {skillCriteria.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 h-10">
                <div
                  className={`w-7 h-7 md:w-8 md:h-8 rounded-lg flex items-center justify-center text-[10px] font-bold border flex-shrink-0 ${
                    foundIndices.includes(idx)
                      ? "bg-[#6e2b8b] text-white border-[#6e2b8b]"
                      : "bg-slate-50 text-slate-400 border-slate-100"
                  }`}
                >
                  {idx + 1}
                </div>
                <div className="flex-1 relative h-6 flex items-end pb-1">
                  {foundIndices.includes(idx) ? (
                    <div className="w-full px-3 py-1 bg-[#6e2b8b]/10 rounded-lg md:rounded-xl border border-[#6e2b8b]/20 animate-in fade-in duration-300 mb-[-4px]">
                      <span className="text-[11px] md:text-xs font-bold text-[#6e2b8b]">
                        {item.answer}
                      </span>
                    </div>
                  ) : (
                    <>
                      <div className="h-[2px] w-full bg-slate-200 absolute bottom-0 rounded-full opacity-60"></div>
                      <span className="text-[8px] md:text-[9px] font-bold text-slate-300  ml-1 mb-[2px]">
                        Pending
                      </span>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Victory Message */}
        {foundIndices.length === 10 && (
          <div className="p-4 bg-[#FD7E14] text-white rounded-2xl text-center text-sm md:text-base font-bold animate-bounce shadow-lg">
            CONGRATULATIONS! You found all 10 skills! 🎉
          </div>
        )}

        {/* Voice Controls and Transcript Area */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          <div className="flex items-center justify-center gap-3 sm:gap-4">
            <button
              onClick={toggleVoice}
              className={`w-14 h-14 md:w-16 md:h-16 rounded-xl md:rounded-2xl flex items-center justify-center transition-all shadow-lg flex-shrink-0 relative ${
                isListening ? "bg-[#FD7E14] text-white" : "bg-[#6e2b8b] text-white"
              }`}
            >
              {isListening ? (
                <>
                  <MicOff size={24} />
                  <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FD7E14] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                  </span>
                </>
              ) : (
                <Mic size={24} />
              )}
            </button>
            
          </div>
          {/* Transcript Area */}
          <div className="flex-1 bg-white rounded-2xl md:rounded-3xl p-4 md:p-5 shadow-inner border border-slate-100 min-h-[70px] flex items-center">
            <p className="text-xs md:text-sm text-slate-500 leading-relaxed italic">
              {transcript}
              <span className="text-[#FD7E14] font-medium"> {interimTranscript}</span>
              {!isListening && !transcript && "Tap the microphone to start answering by voice."}
            </p>
          </div>
          <button
              onClick={resetGame}
              className="w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-white border border-slate-100 text-slate-400 flex items-center justify-center shadow-sm hover:bg-slate-50 transition-colors"
              title="Reset"
            >
              <RotateCcw size={18} />
            </button>
        </div>
      </div>
    </div>
  );
};

export default VoiceInput;
