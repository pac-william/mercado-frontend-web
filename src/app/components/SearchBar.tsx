"use client";

import { createTrascribe } from "@/actions/trascribe.actions";
import { MultiStepLoaderSearch } from "@/components/MultiStepLoader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useTypewriter } from "@/hooks/use-typewriter";
import { Loader2, Mic, Pause, Play, Send, Sparkles, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface SearchAiBarProps {
    className?: string;
    particles?: boolean;
}

export default function SearchAiBar({ className, particles }: SearchAiBarProps) {
    const [isRecording, setIsRecording] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [recordedAudio, setRecordedAudio] = useState<Blob | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isTranscribing, setIsTranscribing] = useState(false);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Array de frases para o placeholder
    const placeholderPhrases = [
        "O que gostaria de fazer hoje?",
        "Encontre os melhores produtos...",
        "Compare preços entre mercados",
        "Descubra ofertas incríveis",
        "Faça sua lista de compras",
        "Encontre produtos por voz"
    ];

    // Hook do typewriter
    const typewriterText = useTypewriter({
        phrases: placeholderPhrases,
        typeSpeed: 20,
        deleteSpeed: 20,
        pauseTime: 2000,
        loop: true
    });

    // Configurar áudio quando recordedAudio mudar
    useEffect(() => {
        if (recordedAudio && audioRef.current) {
            const audioUrl = URL.createObjectURL(recordedAudio);
            audioRef.current.src = audioUrl;
            audioRef.current.load();

            // Limpar URL quando componente for desmontado
            return () => {
                URL.revokeObjectURL(audioUrl);
            };
        }
    }, [recordedAudio]);


    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm;codecs=opus' });
                setRecordedAudio(audioBlob);
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorder.start();
            setIsRecording(true);
        } catch (error) {
            console.error('Erro ao acessar microfone:', error);
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    const handleMicClick = () => {
        if (isRecording) {
            stopRecording();
        } else {
            startRecording();
        }
    };

    const handlePlayPause = async () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
                setIsPlaying(false);
            } else {
                try {
                    await audioRef.current.play();
                    setIsPlaying(true);
                } catch (error) {
                    console.error('Erro ao reproduzir áudio:', error);
                }
            }
        }
    };

    const handleAudioEnded = () => {
        setIsPlaying(false);
    };

    const handleCancelRecording = () => {
        setRecordedAudio(null);
        setIsPlaying(false);
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
    };

    const handleSendRecording = async () => {
        if (recordedAudio) {
            setIsTranscribing(true);
            try {
                // Converter para WAV para a API
                const audioFile = new File([recordedAudio], 'recording.wav', { type: 'audio/wav' });
                const transcription = await createTrascribe(audioFile);
                if (typeof transcription === 'string') {
                    setSearchText(transcription);
                }
                setRecordedAudio(null);
                setIsPlaying(false);
            } catch (error) {
                console.error('Erro ao transcrever áudio:', error);
            } finally {
                setIsTranscribing(false);
            }
        }
    };

    return (
        <div className="flex flex-col space-y-2">
            {particles && <h1 className="text-2xl font-bold text-card-foreground">O que você gostaria de fazer hoje?</h1>}
            <div className={`${className} relative`}>
                <Card className="flex flex-row items-center shadow-md bg-card border-border min-w-[700px]">
                    <Button variant="ghost" size="icon_lg" className="rounded-none hover:bg-accent hover:text-accent-foreground" type="button">
                        <Sparkles size={24} className="text-violet-400" />
                    </Button>
                    <Input
                        type="text"
                        placeholder={particles ? typewriterText : "Pergunte alguma coisa"}
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        className="h-12 rounded-none border border-y-0 bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary"
                    />
                    <Button
                        variant="ghost"
                        size="icon_lg"
                        className={`rounded-none hover:bg-accent hover:text-accent-foreground ${isRecording ? 'bg-red-100 text-red-600' : ''}`}
                        type="button"
                        onClick={handleMicClick}
                    >
                        <Mic size={24} className={isRecording ? "text-red-600" : "text-muted-foreground"} />
                    </Button>
                    <Separator orientation="vertical" className="bg-border" />
                    <MultiStepLoaderSearch inputValue={searchText} />
                </Card>

                <div className="w-[40rem] absolute">
                    {/* Gradients */}
                    <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent dark:via-indigo-500 via-indigo-500/50 to-transparent h-[2px] w-3/4 blur-sm" />
                    <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent dark:via-indigo-500 via-indigo-500/50 to-transparent h-px w-3/4" />
                    <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent dark:via-sky-500 via-sky-500/50 to-transparent h-[5px] w-1/4 blur-sm" />
                    <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent dark:via-sky-500 via-sky-500/50 to-transparent h-px w-1/4" />
                </div>



                {recordedAudio && (
                    <Card className="p-0 shadow-md bg-card/10 border-border absolute top-0 left-0 right-0 mt-20 backdrop-blur-xs">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <audio
                                    ref={audioRef}
                                    onEnded={handleAudioEnded}
                                    onLoadStart={() => console.log('Áudio carregando...')}
                                    onCanPlay={() => console.log('Áudio pronto para reproduzir')}
                                    onError={(e) => console.error('Erro no áudio:', e)}
                                    preload="metadata"
                                    controls={false}
                                />
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={handlePlayPause}
                                    className="hover:bg-accent hover:text-accent-foreground"
                                >
                                    {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                                </Button>
                                <span className="text-sm text-muted-foreground">
                                    {isPlaying ? "Reproduzindo..." : "Áudio gravado"}
                                </span>
                            </div>
                            <div className="flex items-center">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={handleCancelRecording}
                                    className="hover:bg-accent hover:text-accent-foreground"
                                >
                                    <X size={16} />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={handleSendRecording}
                                    disabled={isTranscribing}
                                    className="hover:bg-accent hover:text-accent-foreground"
                                >
                                    {isTranscribing ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                            <Loader2 size={16} className="mr-2" />
                                        </>
                                    ) : (
                                        <>
                                            <Send size={16} className="mr-2" />
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </Card>
                )}
            </div>
        </div>
    )
}