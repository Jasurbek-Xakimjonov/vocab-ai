/**
 * Web Speech API wrapper for pronouncing English vocabulary words.
 */

let selectedVoice: SpeechSynthesisVoice | null = null;

function loadVoices(): Promise<SpeechSynthesisVoice[]> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      resolve([]);
      return;
    }

    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      resolve(voices);
      return;
    }

    window.speechSynthesis.onvoiceschanged = () => {
      resolve(window.speechSynthesis.getVoices());
    };

    // Fallback if voiceschanged never fires
    setTimeout(() => {
      resolve(window.speechSynthesis.getVoices());
    }, 500);
  });
}

export function isSpeechSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

export async function speakWord(text: string, rate: number = 0.9): Promise<void> {
  if (!isSpeechSupported()) {
    console.warn('Web Speech API is not supported in this browser.');
    return;
  }

  try {
    // Cancel any pending speech
    window.speechSynthesis.cancel();

    if (!selectedVoice) {
      const voices = await loadVoices();
      // Look for natural English US or GB voice
      selectedVoice =
        voices.find(
          (v) =>
            (v.lang === 'en-US' || v.lang === 'en-GB') &&
            (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Samantha') || v.name.includes('Karen'))
        ) ||
        voices.find((v) => v.lang.startsWith('en')) ||
        null;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
    utterance.lang = 'en-US';
    utterance.rate = rate;
    utterance.pitch = 1.0;

    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.error('Speech synthesis error:', err);
  }
}
