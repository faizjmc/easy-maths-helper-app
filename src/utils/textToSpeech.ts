
export function speakText(text: string, enabled: boolean = true): void {
  if (!enabled || !window.speechSynthesis) {
    return;
  }
  
  // Cancel any ongoing speech
  window.speechSynthesis.cancel();
  
  // Create a new speech synthesis utterance
  const utterance = new SpeechSynthesisUtterance(text);
  
  // Set speech properties
  utterance.lang = 'en-US';
  utterance.volume = 1; // Range: 0-1
  utterance.rate = 1; // Range: 0.1-10
  utterance.pitch = 1; // Range: 0-2
  
  // Speak the text
  window.speechSynthesis.speak(utterance);
}
