import React, { useRef, useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Link, X, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { useEvidenceConnections } from '../hooks/useEvidenceConnections';

export function EvidenceBoardCanvas() {
  const {
    currentCase,
    boardItems,
    connections,
    updateBoardItemPosition,
    removeFromBoard,
  } = useGameStore();

  const {
    pendingFrom,
    startConnection,
    finishConnection,
    cancelConnection,
    deleteConnection,
    getItemCenter,
  } = useEvidenceConnections();

  const svgRef = useRef(null);
  const boardRef = useRef(null);
  const [draggingId, setDraggingId] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  const getBoardPos = useCallback((clientX, clientY) => {
    const rect = boardRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    return {
      x: (clientX - rect.left) / zoom,
      y: (clientY - rect.top)  / zoom,
    };
  }, [zoom]);

  const onMouseMove = useCallback(
    (e) => {
      const pos = getBoardPos(e.clientX, e.clientY);
      setMousePos(pos);

      if (draggingId) {
        updateBoardItemPosition(
          draggingId,
          pos.x - dragOffset.x,
          pos.y - dragOffset.y
        );
      }
    },
    [draggingId, dragOffset, getBoardPos, updateBoardItemPosition]
  );

  const onMouseUp = useCallback(() => {
    setDraggingId(null);
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [onMouseMove, onMouseUp]);

  const startDrag = (e, boardItemId) => {
    e.preventDefault();
    const item = boardItems.find((i) => i.id === boardItemId);
    if (!item) return;
    const pos = getBoardPos(e.clientX, e.clientY);
    setDragOffset({ x: pos.x - item.x, y: pos.y - item.y });
    setDraggingId(boardItemId);
  };

  const handleNodeClick = (e, boardItemId) => {
    if (draggingId) return; 
    e.stopPropagation();

    if (pendingFrom) {
      finishConnection(boardItemId);
    } else {
      startConnection(boardItemId);
    }
  };

  const renderConnections = () =>
    connections.map((conn) => {
      const from = getItemCenter(conn.from);
      const to   = getItemCenter(conn.to);
      if (!from || !to) return null;

      const fromBoardItem = boardItems.find((i) => i.id === conn.from);
      const toBoardItem   = boardItems.find((i) => i.id === conn.to);
      const fromEvidence  = currentCase?.evidence.find((e) => e.id === fromBoardItem?.evidenceId);
      const isValid       = fromEvidence?.connectsTo?.includes(toBoardItem?.evidenceId);

      return (
        <g key={conn.id}>
          <line
            x1={from.x} y1={from.y}
            x2={to.x}   y2={to.y}
            stroke={isValid ? '#10b981' : '#8b5cf6'}
            strokeWidth={isValid ? 2 : 1.5}
            strokeDasharray={isValid ? 'none' : '6 4'}
            strokeOpacity={0.7}
          />
          <circle
            cx={(from.x + to.x) / 2}
            cy={(from.y + to.y) / 2}
            r={6}
            fill="#1a2234"
            stroke={isValid ? '#10b981' : '#8b5cf6'}
            strokeWidth={1}
            className="canvas-conn-delete-circle"
            onClick={() => deleteConnection(conn.id)}
          />
          <text
            x={(from.x + to.x) / 2}
            y={(from.y + to.y) / 2 + 4}
            textAnchor="middle"
            fill="#ef4444"
            fontSize={9}
            className="canvas-conn-delete-text"
          >
            ×
          </text>
        </g>
      );
    });

  const renderNodes = () =>
    boardItems.map((item) => {
      const evidence = currentCase?.evidence.find((e) => e.id === item.evidenceId);
      if (!evidence) return null;
      const isConnecting = pendingFrom === item.id;
      const isDragging   = draggingId === item.id;

      return (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{
            position: 'absolute',
            left: item.x,
            top:  item.y,
            width: 120,
            zIndex: isDragging ? 20 : 10,
            transform: isDragging ? 'scale(1.06)' : 'scale(1)',
          }}
          className={`evidence-node glass-card-elevated ${isConnecting ? 'connecting' : ''}`}
        >
          <div
            onMouseDown={(e) => startDrag(e, item.id)}
            className="canvas-node-drag"
          >
            <div className="canvas-node-icon">{evidence.icon}</div>
          </div>

          <div
            onClick={(e) => handleNodeClick(e, item.id)}
            className="canvas-node-clickable"
          >
            <p className="canvas-node-title">
              {evidence.title}
            </p>
            <TypeDot type={evidence.type} />
          </div>

          <button
            onClick={(e) => { e.stopPropagation(); removeFromBoard(item.id); }}
            className="canvas-node-remove"
          >
            <X size={9} className="remove-icon" />
          </button>
        </motion.div>
      );
    });

  const noItems = boardItems.length === 0;

  return (
    <div className="canvas-container">
      {/* Toolbar */}
      <div className="canvas-toolbar">
        <div className="canvas-toolbar-left">
          <span className="canvas-toolbar-title">Investigation Board</span>
          <span className="canvas-toolbar-stats">
            {boardItems.length} items · {connections.length} connections
          </span>
        </div>
        <div className="canvas-toolbar-right">
          {pendingFrom && (
            <button
              onClick={cancelConnection}
              className="canvas-btn-cancel"
            >
              <X size={10} />
              Cancel Link
            </button>
          )}
          <button onClick={() => setZoom((z) => Math.min(z + 0.2, 2))} className="canvas-btn-tool"><ZoomIn size={13} /></button>
          <button onClick={() => setZoom((z) => Math.max(z - 0.2, 0.5))} className="canvas-btn-tool"><ZoomOut size={13} /></button>
          <button onClick={() => setZoom(1)} className="canvas-btn-tool"><RotateCcw size={13} /></button>
        </div>
      </div>

      {pendingFrom && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="canvas-instruction-banner"
        >
          <Link size={11} />
          Click another evidence node to connect, or press Cancel Link.
        </motion.div>
      )}

      <div
        ref={boardRef}
        className="canvas-board evidence-board scanlines"
        onClick={() => pendingFrom && cancelConnection()}
      >
        <svg
          ref={svgRef}
          className="canvas-svg"
          style={{ transform: `scale(${zoom})`, transformOrigin: '0 0' }}
        >
          {renderConnections()}
          {pendingFrom && (() => {
            const from = getItemCenter(pendingFrom);
            return (
              <line
                x1={from.x} y1={from.y}
                x2={mousePos.x} y2={mousePos.y}
                stroke="#8b5cf6"
                strokeWidth={1.5}
                strokeDasharray="5 4"
                strokeOpacity={0.6}
              />
            );
          })()}
        </svg>

        <div
          className="canvas-nodes-layer"
          style={{ transform: `scale(${zoom})`, transformOrigin: '0 0' }}
        >
          {renderNodes()}
        </div>

        {noItems && (
          <div className="canvas-empty">
            <motion.div
              animate={{ opacity: [0.4, 0.7, 0.4] }}
              transition={{ repeat: Infinity, duration: 2.5 }}
              className="canvas-empty-icon"
            >
              📌
            </motion.div>
            <p className="canvas-empty-title">Investigation board is empty</p>
            <p className="canvas-empty-desc">
              Open evidence from the hub and click "Pin to Board"
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function TypeDot({ type }) {
  const typeClass = `type-dot-color-${type}`;
  return (
    <span className={`canvas-type-dot ${typeClass}`} />
  );
}
