import type { ReactNode } from 'react';
import './canvas.css';

// SVG Icons as components
const PencilIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
        <path d="m15 5 4 4" />
    </svg>
);

const RectIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" />
    </svg>
);

const CircleIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
    </svg>
);

const LineIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="5" y1="19" x2="19" y2="5" />
    </svg>
);

const EraserIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21" />
        <path d="M22 21H7" />
        <path d="m5 11 9 9" />
    </svg>
);

const MoveIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 9l-3 3 3 3" />
        <path d="M9 5l3-3 3 3" />
        <path d="M15 19l-3 3-3-3" />
        <path d="M19 9l3 3-3 3" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <line x1="12" y1="2" x2="12" y2="22" />
    </svg>
);

export type Tool = 'pencil' | 'rect' | 'circle' | 'line' | 'eraser' | 'pan';

interface CanvasToolbarProps {
    activeTool: Tool;
    onToolChange: (tool: Tool) => void;
    strokeColor: string;
    onColorChange: (color: string) => void;
    strokeWidth: number;
    onStrokeWidthChange: (width: number) => void;
    onUndo: () => void;
    onClear: () => void;
    zoom: number;
}

const PALETTE = ['#ffffff', '#ef4444', '#f59e0b', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899'];

const tools: { id: Tool; icon: ReactNode; label: string }[] = [
    { id: 'pan', icon: <MoveIcon />, label: 'Pan' },
    { id: 'pencil', icon: <PencilIcon />, label: 'Pencil' },
    { id: 'line', icon: <LineIcon />, label: 'Line' },
    { id: 'rect', icon: <RectIcon />, label: 'Rectangle' },
    { id: 'circle', icon: <CircleIcon />, label: 'Circle' },
    { id: 'eraser', icon: <EraserIcon />, label: 'Eraser' },
];

export const CanvasToolbar = ({
    activeTool,
    onToolChange,
    strokeColor,
    onColorChange,
    strokeWidth,
    onStrokeWidthChange,
    onUndo,
    onClear,
    zoom,
}: CanvasToolbarProps) => {
    return (
        <>
            {/* Side toolbar */}
            <div className="canvas-toolbar">
                {tools.map((tool, i) => (
                    <span key={tool.id}>
                        {i === 1 && <div className="toolbar-divider" />}
                        <button
                            className={`tool-btn ${activeTool === tool.id ? 'active' : ''}`}
                            onClick={() => onToolChange(tool.id)}
                            title={tool.label}
                        >
                            {tool.icon}
                        </button>
                    </span>
                ))}
            </div>

            {/* Bottom controls */}
            <div className="toolbar-controls">
                <div className="color-palette">
                    {PALETTE.map((color) => (
                        <div
                            key={color}
                            className={`color-swatch ${strokeColor === color ? 'active' : ''}`}
                            style={{ background: color }}
                            onClick={() => onColorChange(color)}
                        />
                    ))}
                    <input
                        type="color"
                        className="color-custom"
                        value={strokeColor}
                        onChange={(e) => onColorChange(e.target.value)}
                        title="Custom color"
                    />
                </div>
                <div className="stroke-control">
                    <span>{strokeWidth}px</span>
                    <input
                        type="range"
                        className="stroke-slider"
                        min="1"
                        max="20"
                        value={strokeWidth}
                        onChange={(e) => onStrokeWidthChange(Number(e.target.value))}
                    />
                </div>
            </div>

            {/* Top action bar */}
            <div className="canvas-topbar">
                <button className="topbar-btn" onClick={onUndo}>Undo</button>
                <button className="topbar-btn danger" onClick={onClear}>Clear All</button>
            </div>

            {/* Zoom indicator */}
            <div className="zoom-indicator">{Math.round(zoom * 100)}%</div>
        </>
    );
};
