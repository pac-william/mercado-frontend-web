"use server";

import { baseUrl } from "@/config/server";
import type { Suggestion, SuggestionCreateResponse } from "@/types/suggestion";

export async function createSuggestion(task: string): Promise<SuggestionCreateResponse> {
  try {
    const url = `${baseUrl}/api/v1/suggestions`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ task }),
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Erro ao criar sugestão: ${response.status}`);
    }

    const data: SuggestionCreateResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao criar sugestão:', error);
    throw error;
  }
}

export async function getSuggestionById(id: string): Promise<Suggestion> {
  try {
    const url = `${baseUrl}/api/v1/suggestions/${id}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Erro ao buscar sugestão: ${response.status}`);
    }

    const data: Suggestion = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao buscar sugestão:', error);
    throw error;
  }
}
