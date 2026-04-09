import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { SyllabusNode, NodeConnection } from '../types';
import { syllabusNodes, syllabusConnections } from '../data/syllabusData';
import * as api from '../api/client';

/* ──────────────────────────────────────────────────────────
   Node Store — API-backed with local fallback
   Manages syllabus node positions & drag state
   ────────────────────────────────────────────────────────── */

// Debounce helper for position updates
let positionUpdateTimer: ReturnType<typeof setTimeout> | null = null;

interface NodeState {
  nodes: SyllabusNode[];
  connections: NodeConnection[];
  draggedNodeId: string | null;
  dragOffset: { x: number; y: number };
  isMapPanning: boolean;
  isFullscreen: boolean;
  isSearchOpen: boolean;
  searchQuery: string;
  isLinkingMode: boolean;
  selectedLinkingNodeId: string | null;
  isBackendConnected: boolean;
  isLoading: boolean;

  fetchFromBackend: () => Promise<void>;
  startDrag: (id: string, offsetX: number, offsetY: number) => void;
  updateNodePosition: (id: string, x: number, y: number) => void;
  panMap: (dx: number, dy: number) => void;
  endDrag: () => void;
  toggleNodeStatus: (id: string) => void;
  addNode: (node: Omit<SyllabusNode, 'id'>, parentId?: string) => void;
  removeNode: (id: string) => void;
  toggleLinkingMode: () => void;
  executeLink: (targetId: string) => void;
  setFullscreen: (value: boolean) => void;
  setMapPanning: (value: boolean) => void;
  toggleFullscreen: () => void;
  setSearchOpen: (value: boolean) => void;
  toggleSearchOpen: () => void;
  setSearchQuery: (query: string) => void;
}

export const useNodeStore = create<NodeState>()(
  persist(
    (set, get) => ({
  nodes: syllabusNodes,
  connections: syllabusConnections,
  draggedNodeId: null,
  dragOffset: { x: 0, y: 0 },
  isMapPanning: false,
  isFullscreen: false,
  isSearchOpen: false,
  searchQuery: '',
  isLinkingMode: false,
  selectedLinkingNodeId: null,
  isBackendConnected: false,
  isLoading: false,

  fetchFromBackend: async () => {
    set({ isLoading: true });
    try {
      const data = await api.fetchNodes();
      set({
        nodes: data.nodes,
        connections: data.connections,
        isBackendConnected: true,
        isLoading: false,
      });
    } catch (error) {
      console.warn('⚠️ Backend unreachable for nodes, using local data:', error);
      set({ isBackendConnected: false, isLoading: false });
    }
  },

  startDrag: (id, offsetX, offsetY) => {
    set({ draggedNodeId: id, dragOffset: { x: offsetX, y: offsetY } });
  },

  updateNodePosition: (id, x, y) => {
    const { isBackendConnected } = get();

    // Immediate local update for smooth dragging
    set((state) => ({
      nodes: state.nodes.map((n) =>
        n.id === id ? { ...n, x, y } : n
      ),
    }));

    // Debounced sync to backend (avoid spamming during drag)
    if (isBackendConnected) {
      if (positionUpdateTimer) clearTimeout(positionUpdateTimer);
      positionUpdateTimer = setTimeout(() => {
        api.updateNode(id, { x, y }).catch(console.error);
      }, 500);
    }
  },

  panMap: (dx, dy) => {
    set((state) => ({
      nodes: state.nodes.map((n) => ({
        ...n,
        x: n.x + dx,
        y: n.y + dy,
      })),
    }));
  },

  endDrag: () => {
    set({ draggedNodeId: null, dragOffset: { x: 0, y: 0 } });
  },

  toggleNodeStatus: (id) => {
    const { isBackendConnected } = get();

    let newStatus: 'active' | 'completed' | 'locked' = 'active';
    const node = get().nodes.find((n) => n.id === id);
    if (node) {
      newStatus = node.status === 'completed'
        ? 'active'
        : node.status === 'active'
          ? 'completed'
          : 'active';
    }

    set((state) => ({
      nodes: state.nodes.map((n) =>
        n.id === id ? { ...n, status: newStatus } : n
      ),
    }));

    if (isBackendConnected) {
      api.updateNode(id, { status: newStatus }).catch(console.error);
    }
  },

  addNode: (node, parentId) => {
    const { isBackendConnected } = get();

    if (isBackendConnected) {
      api.createNode(node, parentId)
        .then((created) => {
          set((state) => {
            const newConnection = parentId ? { from: parentId, to: created.id } : null;
            return {
              nodes: [...state.nodes, created],
              connections: newConnection
                ? [...state.connections, newConnection]
                : state.connections,
            };
          });
        })
        .catch(console.error);
    } else {
      // Local-only fallback
      set((state) => {
        const newId = `node-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        const newConnection = parentId ? { from: parentId, to: newId } : null;

        return {
          nodes: [
            ...state.nodes,
            {
              ...node,
              id: newId,
            },
          ],
          connections: newConnection
            ? [...state.connections, newConnection]
            : state.connections,
        };
      });
    }
  },

  removeNode: (id) => {
    const { isBackendConnected } = get();

    set((state) => ({
      nodes: state.nodes.filter((n) => n.id !== id),
      connections: state.connections.filter((c) => c.from !== id && c.to !== id),
      selectedLinkingNodeId: state.selectedLinkingNodeId === id ? null : state.selectedLinkingNodeId,
    }));

    if (isBackendConnected) {
      api.deleteNode(id).catch(console.error);
    }
  },

  toggleLinkingMode: () => {
    set((state) => ({
      isLinkingMode: !state.isLinkingMode,
      selectedLinkingNodeId: null,
    }));
  },

  executeLink: (targetId) => {
    const state = get();
    const sourceId = state.selectedLinkingNodeId;

    if (!sourceId || sourceId === targetId) {
      // First click: select this as the source
      set({ selectedLinkingNodeId: targetId });
      return;
    }

    // Second click: create or remove the connection (toggle)
    const alreadyExists = state.connections.some(
      (c) => (c.from === sourceId && c.to === targetId) || (c.from === targetId && c.to === sourceId)
    );

    if (alreadyExists) {
      // Remove connection
      set({
        connections: state.connections.filter(
          (c) => !((c.from === sourceId && c.to === targetId) || (c.from === targetId && c.to === sourceId))
        ),
        selectedLinkingNodeId: null,
      });
      if (state.isBackendConnected) {
        api.deleteConnection(sourceId, targetId).catch(console.error);
      }
    } else {
      // Create connection
      set({
        connections: [...state.connections, { from: sourceId, to: targetId }],
        selectedLinkingNodeId: null,
      });
      if (state.isBackendConnected) {
        api.createConnection(sourceId, targetId).catch(console.error);
      }
    }
  },

  setFullscreen: (value) => set({ isFullscreen: value }),
  setMapPanning: (value) => set({ isMapPanning: value }),
  toggleFullscreen: () => set((state) => ({ isFullscreen: !state.isFullscreen })),
  setSearchOpen: (value) => set({ isSearchOpen: value }),
  toggleSearchOpen: () => set((state) => ({ isSearchOpen: !state.isSearchOpen })),
  setSearchQuery: (query) => set({ searchQuery: query }),
    }),
    {
      name: 'node-storage',
    }
  )
);
