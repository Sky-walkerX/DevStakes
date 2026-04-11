/**
 * API Client — Typed fetch wrappers for FastAPI backend
 * 
 * Defaults to /api (proxied via Vite in dev) or the full backend URL.
 * Falls back gracefully if the backend is unreachable.
 */

import type { Session, SyllabusNode, NodeConnection } from '../types';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

/* ─── Helpers ───────────────────────────────────────────── */

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE}${path}`;
  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers || {}),
    },
    ...options,
  });

  if (!res.ok) {
    const errorBody = await res.text().catch(() => '');
    throw new Error(`API Error ${res.status}: ${errorBody}`);
  }

  // For 204 No Content
  if (res.status === 204) return undefined as T;

  return res.json();
}

/* ─── Session Endpoints ─────────────────────────────────── */

export async function fetchSessions(): Promise<Session[]> {
  return request<Session[]>('/sessions');
}

export async function createSession(session: Omit<Session, 'id'>): Promise<Session> {
  return request<Session>('/sessions', {
    method: 'POST',
    body: JSON.stringify(session),
  });
}

export async function updateSession(id: string, update: Partial<Session>): Promise<Session> {
  return request<Session>(`/sessions/${id}`, {
    method: 'PUT',
    body: JSON.stringify(update),
  });
}

export async function deleteSession(id: string): Promise<void> {
  return request<void>(`/sessions/${id}`, {
    method: 'DELETE',
  });
}

export async function recalculateSessions(): Promise<{
  sessions: Session[];
  burnoutRisk: number;
  efficiency: number;
}> {
  return request('/sessions/recalculate', { method: 'POST' });
}

export async function fetchDashboardStats(): Promise<{
  burnoutRisk: number;
  efficiency: number;
  dayStreak: number;
  peakOutput: string;
  totalSessions: number;
  completedSessions: number;
  missedSessions: number;
  pendingSessions: number;
}> {
  return request('/sessions/stats');
}

/* ─── Node Endpoints ────────────────────────────────────── */

export async function fetchNodes(): Promise<{
  nodes: SyllabusNode[];
  connections: NodeConnection[];
}> {
  return request('/nodes');
}

export async function createNode(
  node: Omit<SyllabusNode, 'id'>,
  parentId?: string
): Promise<SyllabusNode> {
  return request<SyllabusNode>('/nodes', {
    method: 'POST',
    body: JSON.stringify({ ...node, parentId }),
  });
}

export async function updateNode(
  id: string,
  update: Partial<SyllabusNode>
): Promise<SyllabusNode> {
  return request<SyllabusNode>(`/nodes/${id}`, {
    method: 'PUT',
    body: JSON.stringify(update),
  });
}

export async function deleteNode(id: string): Promise<void> {
  return request<void>(`/nodes/${id}`, {
    method: 'DELETE',
  });
}

export async function createConnection(fromId: string, toId: string): Promise<void> {
  return request<void>('/nodes/connections', {
    method: 'POST',
    body: JSON.stringify({ fromId, toId }),
  });
}

export async function deleteConnection(fromId: string, toId: string): Promise<void> {
  return request<void>(`/nodes/connections?fromId=${fromId}&toId=${toId}`, {
    method: 'DELETE',
  });
}

/* ─── AI Endpoints ──────────────────────────────────────── */

export async function generateDescription(
  taskName: string,
  priority: string = 'medium',
  context: string = ''
): Promise<string> {
  const res = await request<{ generatedText: string }>('/ai/generate-description', {
    method: 'POST',
    body: JSON.stringify({ taskName, priority, context }),
  });
  return res.generatedText;
}

/* ─── Health Check ──────────────────────────────────────── */

export async function checkBackendHealth(): Promise<boolean> {
  try {
    await request('/health');
    return true;
  } catch {
    return false;
  }
}
