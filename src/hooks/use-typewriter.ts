import { useEffect, useState } from 'react';

interface UseTypewriterOptions {
  phrases: string[];
  typeSpeed?: number; // velocidade de digitação em ms
  deleteSpeed?: number; // velocidade de apagar em ms
  pauseTime?: number; // tempo de pausa entre frases em ms
  loop?: boolean; // se deve repetir o ciclo
}

export function useTypewriter({
  phrases,
  typeSpeed = 100,
  deleteSpeed = 50,
  pauseTime = 2000,
  loop = true
}: UseTypewriterOptions) {
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (phrases.length === 0) return;

    const currentPhrase = phrases[currentPhraseIndex];
    
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        // Digitando
        if (currentText.length < currentPhrase.length) {
          setCurrentText(currentPhrase.slice(0, currentText.length + 1));
        } else {
          // Terminou de digitar, espera e começa a apagar
          setTimeout(() => {
            setIsDeleting(true);
          }, pauseTime);
        }
      } else {
        // Apagando
        if (currentText.length > 0) {
          setCurrentText(currentText.slice(0, -1));
        } else {
          // Terminou de apagar, vai para próxima frase
          setIsDeleting(false);
          setCurrentPhraseIndex((prev) => {
            const nextIndex = prev + 1;
            if (nextIndex >= phrases.length) {
              return loop ? 0 : prev;
            }
            return nextIndex;
          });
        }
      }
    }, isDeleting ? deleteSpeed : typeSpeed);

    return () => clearTimeout(timeout);
  }, [currentText, currentPhraseIndex, isDeleting, phrases, typeSpeed, deleteSpeed, pauseTime, loop]);

  return currentText;
}

