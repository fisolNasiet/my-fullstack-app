import { apiClient } from './client';
import type { Note } from './types';

export async function getNotes(): Promise<Note[]> {
  const response = await apiClient.get<Note[]>('/notes');
  return response.data;
}

export async function createNote(note: Omit<Note, 'id'>): Promise<Note> {
  const response = await apiClient.post<Note>('/notes', note);
  return response.data;
}

export async function deleteNote(id: number): Promise<void> {
  await apiClient.delete(`/notes/${id}`);
}
