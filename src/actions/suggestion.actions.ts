"use server";

import { baseUrl } from "@/config/server";
import { auth0 } from "@/lib/auth0";
import type { Suggestion, SuggestionCreateResponse } from "@/types/suggestion";

export async function createSuggestion(task: string): Promise<SuggestionCreateResponse> {
  try {
    const session = await auth0.getSession();
    if (!session) {
      throw new Error('Usuário não autenticado');
    }

    const url = `${baseUrl}/api/v1/suggestions`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.tokenSet.idToken}`,
      },
      body: JSON.stringify({ task }),
      cache: 'no-store',
    });

    console.log(response);

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
    const session = await auth0.getSession();
    if (!session) {
      throw new Error('Usuário não autenticado');
    }
    const url = `${baseUrl}/api/v1/suggestions/${id}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
        'Authorization': `Bearer ${session.tokenSet.idToken}`,
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

export async function getUserSuggestions(page: number = 1, size: number = 10): Promise<{
  suggestions: { id: string }[];
  meta: {
    page: number;
    size: number;
    total: number;
    totalPages: number;
    totalItems: number;
  };
}> {
  try {
    const session = await auth0.getSession();
    if (!session) {
      throw new Error('Usuário não autenticado');
    }
    const url = `${baseUrl}/api/v1/suggestions?page=${page}&size=${size}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
        'Authorization': `Bearer ${session.tokenSet.idToken}`,
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Erro ao buscar histórico de sugestões: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao buscar histórico de sugestões:', error);
    throw error;
  }
}
