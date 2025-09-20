"use server"

export const createTrascribe = async (audio: File) => {
    const formData = new FormData();
    formData.append('audio', audio);

    const response = await fetch(`http://localhost:5000/transcribe`, {
        method: "POST",
        body: formData
    })
    
    if (!response.ok) {
        throw new Error('Erro ao transcrever áudio');
    }
    
    const data = await response.json() as { success: boolean; text: string; language: string; filename: string; file_size: number };
    return data.text;
}