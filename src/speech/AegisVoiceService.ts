import { LanguageCode } from "../types/aegis";

// Speech Recognition type declarations for browsers
interface IWindow extends Window {
  SpeechRecognition?: any;
  webkitSpeechRecognition?: any;
}

export class AegisVoiceService {
  private recognition: any = null;
  private isListening: boolean = false;
  private currentLanguage: LanguageCode = "en";
  private audioStream: MediaStream | null = null;
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;

  constructor() {
    const win = window as unknown as IWindow;
    const SpeechRec = win.SpeechRecognition || win.webkitSpeechRecognition;
    if (SpeechRec) {
      this.recognition = new SpeechRec();
      this.recognition.continuous = false;
      this.recognition.interimResults = true;
      this.recognition.lang = "en-US";
    }
  }

  public setLanguage(lang: LanguageCode) {
    this.currentLanguage = lang;
    if (this.recognition) {
      this.recognition.lang = lang === "ml" ? "ml-IN" : "en-US";
    }
  }

  public getLanguage(): LanguageCode {
    return this.currentLanguage;
  }

  public async startListening(
    onResult: (text: string, isFinal: boolean) => void,
    onError: (err: string) => void
  ): Promise<boolean> {
    if (!this.recognition) {
      onError("Speech recognition is not supported in this browser. You can still type your message!");
      return false;
    }

    try {
      this.audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.audioContext = new AudioCtx();
      const source = this.audioContext.createMediaStreamSource(this.audioStream);
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 64;
      source.connect(this.analyser);

      this.recognition.onresult = (event: any) => {
        let interimText = "";
        let finalText = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalText += event.results[i][0].transcript;
          } else {
            interimText += event.results[i][0].transcript;
          }
        }
        if (finalText) {
          onResult(finalText.trim(), true);
        } else if (interimText) {
          onResult(interimText.trim(), false);
        }
      };

      this.recognition.onerror = (e: any) => {
        console.warn("Speech recognition error:", e.error);
        onError(e.error || "Recognition error");
        this.stopListening();
      };

      this.recognition.onend = () => {
        this.isListening = false;
      };

      this.recognition.start();
      this.isListening = true;
      return true;
    } catch (err: any) {
      console.warn("Microphone access error:", err);
      onError("Could not access microphone.");
      return false;
    }
  }

  public stopListening() {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch { /* ignore */ }
    }
    this.isListening = false;
    if (this.audioStream) {
      this.audioStream.getTracks().forEach(track => track.stop());
      this.audioStream = null;
    }
    if (this.audioContext && this.audioContext.state !== "closed") {
      this.audioContext.close().catch(() => {});
      this.audioContext = null;
    }
    this.analyser = null;
  }

  public getAnalyserData(): Uint8Array | null {
    if (!this.analyser) return null;
    const data = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(data);
    return data;
  }

  public getIsListening(): boolean {
    return this.isListening;
  }

  // Synthesize Speech with calm, deep superhero tone
  public speak(
    text: string,
    lang: LanguageCode = "en",
    onStart?: () => void,
    onEnd?: () => void
  ) {
    if (!("speechSynthesis" in window)) {
      if (onEnd) onEnd();
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === "ml" ? "ml-IN" : "en-US";
    utterance.rate = 0.92; // Deliberate, calm pacing
    utterance.pitch = 0.82; // Deeper superhero register

    const voices = window.speechSynthesis.getVoices();
    if (lang === "ml") {
      const mlVoice = voices.find(v => v.lang.startsWith("ml") || v.name.toLowerCase().includes("malayalam"));
      if (mlVoice) utterance.voice = mlVoice;
    } else {
      const enVoice = voices.find(v => (v.name.includes("Male") || v.name.includes("Natural") || v.name.includes("David") || v.name.includes("Guy")) && v.lang.startsWith("en"));
      if (enVoice) utterance.voice = enVoice;
    }

    if (onStart) utterance.onstart = onStart;
    utterance.onend = () => {
      if (onEnd) onEnd();
    };
    utterance.onerror = () => {
      if (onEnd) onEnd();
    };

    window.speechSynthesis.speak(utterance);
  }

  public stopSpeaking() {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  }
}

export const aegisVoice = new AegisVoiceService();
