import { useRef, useEffect, useCallback } from "react";

export function useNarrator(enabled = true) {
  const voiceRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis);

  useEffect(() => {
    function pickVoice() {
      const voices = synthRef.current.getVoices();
      if (!voices.length) return;
      const preferred = ["Google UK English Male","Microsoft George","Microsoft David","Alex","Daniel","Fred"];
      let picked = null;
      for (const name of preferred) { picked = voices.find(v => v.name === name); if (picked) break; }
      if (!picked) picked = voices.find(v => v.lang.startsWith("en") && v.name.toLowerCase().includes("male"));
      if (!picked) picked = voices.find(v => v.lang.startsWith("en"));
      if (!picked) picked = voices[0];
      voiceRef.current = picked;
    }
    pickVoice();
    synthRef.current.addEventListener("voiceschanged", pickVoice);
    return () => synthRef.current.removeEventListener("voiceschanged", pickVoice);
  }, []);

  const speak = useCallback((text) => {
    if (!enabled || !synthRef.current) return;
    synthRef.current.cancel();
    const clean = text
      .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, "")
      .replace(/…/g, ".").replace(/\n/g, ". ").trim();
    if (!clean) return;
    const u = new SpeechSynthesisUtterance(clean);
    u.voice = voiceRef.current; u.rate = 0.8; u.pitch = 0.8; u.volume = 1;
    synthRef.current.speak(u);
  }, [enabled]);

  const stop = useCallback(() => synthRef.current?.cancel(), []);
  return { speak, stop };
}