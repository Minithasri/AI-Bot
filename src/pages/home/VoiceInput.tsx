/* eslint-disable no-empty */
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

import image from "../../assets/images/only.png";
const SpeechRecognition =
  (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

const VoiceInput = () => {
  const [isListening, setIsListening] = useState(false);
  const [foundIndices, setFoundIndices] = useState<number[]>([]);
  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const recognitionRef = useRef<any>(null);
  const isBotSpeakingRef = useRef(false);

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

  // Word-to-Keyword matching engine (Returns a score based on Core words)
  const calculateMatchScore = (inputWords: string[], target: string) => {
    const t = target.toLowerCase().replace(/[.,:!?]/g, "").trim();
    
    const genericWords = new Set([
      "thinking", "learning", "ability", "skills", "sense", "mindset", 
      "conduct", "etiquette", "attitude", "level", "basic", "quality",
      "oriented", "orientation", "thought", "power", "staying", "clear",
      "fast", "quick", "well", "good", "better", "best", "personality"
    ]);

    const stopWords = new Set(["a", "an", "the", "i", "by", "is", "of", "with", "at", "on", "in", "and", "but", "or", "my", "me", "it", "this", "that", "for", "are", "they", "their", "be", "been", "showing", "show"]);
    
    const tWords = t.split(/\s+/).filter((w) => w.length >= 2 && !stopWords.has(w));
    if (tWords.length === 0) return 0;

    const matchedTWords = tWords.filter((tw) =>
      inputWords.some((iw) => iw === tw || (iw.length > 5 && tw.length > 5 && (iw.includes(tw) || tw.includes(iw))))
    );

    if (matchedTWords.length === 0) return 0;

    const coreMatches = matchedTWords.filter(mw => !genericWords.has(mw)).length;
    const totalMatches = matchedTWords.length;

    // Logic: 
    // - Core words are worth 10 points
    // - Generic words are worth 1 point ONLY if a core word also matches
    // - If ONLY generic words match, they must match the whole target to get even 1 point
    if (coreMatches > 0) {
      return (coreMatches * 10) + (totalMatches - coreMatches);
    } else if (totalMatches === tWords.length) {
      return 1;
    }
    
    return 0;
  };

  const question = "What skills matter more than grades for data & AI freshers?";

  const skillCriteria = useMemo(
    () => [
      {
        answer: "Learning Agility",
        similar: [
          "adaptability",
          "willingness to learn",
          "growth mindset",
          "fast learner",
          "continuous learning ability",
          "agile learning",
        ],
      },
      {
        answer: "Problem Thinking",
        similar: [
          "analytical thinking",
          "critical thinking",
          "structured thinking",
          "solution orientation",
          "logical reasoning",
          "problem solving",
          "analytics",
          "analytical",
        ],
      },
      {
        answer: "Communication Clarity",
        similar: [
          "articulation skills",
          "effective communication",
          "expression ability",
          "presentation skills",
          "clarity of thought",
          "communication",
        ],
      },
      {
        answer: "Ownership Mindset",
        similar: [
          "accountability",
          "responsibility",
          "initiative",
          "proactiveness",
          "ownership",
          "self driven attitude",
        ],
      },
      {
        answer: "Comfort with Ambiguity",
        similar: [
          "tolerance for uncertainty",
          "tolerance",
          "uncertainty",
          "ambiguity",
          "adaptability to change",
          "flexibility",
          "open ended thinking",
          "situational handling",
        ],
      },
      {
        answer: "Collaboration & Team Sense",
        similar: [
          "teamwork",
          "interpersonal skills",
          "people skills",
          "cross functional collaboration",
          "functional collaboration",
          "cooperative attitude",
        ],
      },
      {
        answer: "Ethics & Trustworthiness",
        similar: [
          "integrity",
          "professional ethics",
          "reliability",
          "moral responsibility",
          "credibility",
          "ethics",
          "trust",
        ],
      },
      {
        answer: "Curiosity About Business",
        similar: [
          "business acumen",
          "commercial awareness",
          "commercial",
          "customer orientation",
          "value thinking",
          "outcome orientation",
        ],
      },
      {
        answer: "Resilience & Grit",
        similar: [
          "perseverance",
          "mental toughness",
          "emotional strength",
          "stress management",
          "persistence",
        ],
      },
      {
        answer: "Basic Professionalism",
        similar: [
          "workplace etiquette",
          "workplace",
          "professional conduct",
          "discipline",
          "reliability",
          "Work Ethics",
        ],
      },
    ],
    [],
  );

  // Voice setup with enhanced phrase-tracking and TTS
  // useEffect(() => {
  //   if (!SpeechRecognition) return;

  //   const recognition = new SpeechRecognition();
  //   recognition.continuous = true;
  //   recognition.interimResults = true;
  //   recognition.lang = "en-US";

  //   // Text-to-Speech helper
  //   const speakResult = (text: string) => {
  //     isBotSpeakingRef.current = true;
  //     window.speechSynthesis.cancel();

  //     const utterance = new SpeechSynthesisUtterance(text);
  //     utterance.rate = 1.1;

  //     utterance.onend = () => {
  //       // Longer cooldown to allow audio buffers to clear
  //       setTimeout(() => {
  //         isBotSpeakingRef.current = false;
  //       }, 1000);
  //     };

  //     utterance.onerror = () => {
  //       isBotSpeakingRef.current = false;
  //     };

  //     window.speechSynthesis.speak(utterance);
  //   };

  //   recognition.onstart = () => {
  //     console.log("🎤 Mode Active: Continuous Listening...");
  //     setIsListening(true);
  //   };

  //   recognition.onresult = (event: any) => {
  //     if (isBotSpeakingRef.current) return;

  //     let finalStr = "";
  //     let interimStr = "";

  //     for (let i = event.resultIndex; i < event.results.length; ++i) {
  //       if (event.results[i].isFinal) finalStr += event.results[i][0].transcript;
  //       else interimStr += event.results[i][0].transcript;
  //     }

  //     const lowerFinal = finalStr.toLowerCase();
  //     // Heuristic: If the input looks like the bot's own feedback, ignore it
  //     const botKeywords = [
  //       "correct answer",
  //       "already answered",
  //       "try another keyword",
  //       "found:",
  //       "matched:",
  //     ];
  //     if (botKeywords.some((kw) => lowerFinal.includes(kw))) {
  //       return;
  //     }

  //     if (interimStr) {
  //       setInterimTranscript(interimStr);
  //     }

  //     if (finalStr) {
  //       setTranscript((prev) => (prev + " " + finalStr).trim());
  //       setInterimTranscript("");

  //       // 1. Process User Sentence into meaningful keywords
  //       const stopWords = new Set([
  //         "a", "an", "the", "i", "by", "is", "am", "are", "was", "were", "be", "been", "being",
  //         "have", "has", "had", "do", "does", "did", "to", "for", "of", "with", "at", "on", "in",
  //         "and", "but", "or", "even", "when", "how", "why", "who", "which", "my", "me", "your",
  //         "our", "it", "this", "that", "these", "those", "can", "could", "will", "would", "shall",
  //         "should", "show", "showed", "showing", "helps", "help", "stay", "stayed", "staying",
  //         "tasks", "become", "feel", "feeling", "manage", "use", "using", "allows", "come",
  //         "important", "importance", "like", "actually", "just", "very", "more", "now", "here"
  //       ]);

  //       const cleanedPhrase = finalStr.trim().toLowerCase();
  //       const sentences = finalStr.split(/[.!?]+/).filter((s) => s.trim().length > 0);

  //       // 2. Process each sentence to find exactly ONE new match
  //       let matchedIndex = -1;
  //       let isAlreadyFound = false;
  //       let matchedSomething = false;

  //       for (const sentence of sentences) {
  //         const userMeaningfulWords = sentence
  //           .toLowerCase()
  //           .trim()
  //           .split(/[\s,.;!?]+/)
  //           .filter((w) => w.length >= 2 && !stopWords.has(w)); // Length 2 for words like "AI"

  //         if (userMeaningfulWords.length === 0) continue;

  //         let bestScore = 0;
  //         let bestIndexForMatch = -1;

  //         for (let i = 0; i < skillCriteria.length; i++) {
  //           const item = skillCriteria[i];
            
  //           // Calculate scores for answer and all similar phrases
  //           const scores = [
  //             calculateMatchScore(userMeaningfulWords, item.answer),
  //             ...item.similar.map(s => calculateMatchScore(userMeaningfulWords, s))
  //           ];
            
  //           const maxScore = Math.max(...scores);

  //           if (maxScore > 0) {
  //             matchedSomething = true;
  //             if (foundIndicesRef.current.includes(i)) {
  //               isAlreadyFound = true;
  //             } else if (maxScore > bestScore) {
  //               bestScore = maxScore;
  //               bestIndexForMatch = i;
  //             }
  //           }
  //         }
          
  //         if (bestIndexForMatch !== -1) {
  //           matchedIndex = bestIndexForMatch;
  //           break; 
  //         }
  //       }

  //       if (matchedIndex !== -1) {
  //         const name = skillCriteria[matchedIndex].answer;
  //         setFoundIndices((prev) => [...new Set([...prev, matchedIndex])]);
  //         speakResult(`${name} is correct answer`);
  //         setFeedback({ text: `Matched: ${name}`, status: "correct" });
  //       } else if (isAlreadyFound) {
  //         // Only report "already answered" if we didn't find ANY new matches in the whole chunk
  //         speakResult(`That was already answered`);
  //         setFeedback({ text: `Already answered`, status: "wrong" });
  //         setTimeout(
  //           () =>
  //             setFeedback((prev) => (prev.status === "wrong" ? { text: "", status: null } : prev)),
  //           3000,
  //         );
  //       } else if (!matchedSomething) {
  //         // Optional: handle "Try another keyword" only if we didn't match anything at all
  //         setFeedback({ text: `Try another keyword`, status: "wrong" });
  //         setTimeout(
  //           () =>
  //             setFeedback((prev) => (prev.status === "wrong" ? { text: "", status: null } : prev)),
  //           3000,
  //         );
  //       }
  //     }
  //   };

  //   recognition.onend = () => {
  //     if (isListening) {
  //       // If we were speaking, the restart will happen via onend/timeout,
  //       // but this acts as a backup to keep the mic alive.
  //       setTimeout(() => {
  //         if (isListening && !isBotSpeakingRef.current) {
  //           try {
  //             recognition.start();
  //           } catch (e) {}
  //         }
  //       }, 300);
  //     }
  //   };

  //   recognition.onerror = (e: any) => {
  //     console.error("⚠️ Recognition Error:", e.error);
  //     if (e.error === "network") {
  //       alert("Network error. Please check your internet connection.");
  //       setIsListening(false);
  //     }
  //   };

  //   recognitionRef.current = recognition;
  //   if (isListening) recognition.start();

  //   return () => {
  //     window.speechSynthesis.cancel();
  //     if (recognitionRef.current) {
  //       recognitionRef.current.onend = null;
  //       recognitionRef.current.stop();
  //     }
  //   };
  // }, [isListening, skillCriteria]);
useEffect(() => {
  if (typeof window === "undefined") return;

  const SpeechRecognition =
    (window as any).SpeechRecognition ||
    (window as any).webkitSpeechRecognition;

  if (!SpeechRecognition) return;

  const recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = "en-US";

  // Text-to-Speech helper
  const speakResult = (text: string) => {
    isBotSpeakingRef.current = true;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.1;

    utterance.onend = () => {
      setTimeout(() => {
        isBotSpeakingRef.current = false;
      }, 1000);
    };

    utterance.onerror = () => {
      isBotSpeakingRef.current = false;
    };

    window.speechSynthesis.speak(utterance);
  };

  recognition.onstart = () => {
    setIsListening(true);
  };

  recognition.onresult = (event: any) => {
    if (isBotSpeakingRef.current) return;

    let finalStr = "";
    let interimStr = "";

    for (let i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal)
        finalStr += event.results[i][0].transcript;
      else interimStr += event.results[i][0].transcript;
    }

    if (interimStr) setInterimTranscript(interimStr);

    if (finalStr) {
      setTranscript((prev) => (prev + " " + finalStr).trim());
      setInterimTranscript("");
      // 👉 your existing matching logic stays exactly the same
    }
  };

  recognition.onend = () => {
    if (isListening && !isBotSpeakingRef.current) {
      try {
        recognition.start();
      } catch {}
    }
  };

  recognition.onerror = () => {
    setIsListening(false);
  };

  recognitionRef.current = recognition;

  if (isListening) recognition.start();

  return () => {
    window.speechSynthesis.cancel();
    recognition.stop();
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
            CONGRATULATIONS!🎉
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
