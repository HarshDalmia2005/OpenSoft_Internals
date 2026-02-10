import { Move, Pencil, Minus, Square, Circle, Eraser } from 'lucide-react';
import type { ReactNode } from 'react';
import './canvas.css';

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
    { id: 'pan', icon: <Move size={18} />, label: 'Pan' },
    { id: 'pencil', icon: <Pencil size={18} />, label: 'Pencil' },
    { id: 'line', icon: <Minus size={18} />, label: 'Line' },
    { id: 'rect', icon: <Square size={18} />, label: 'Rectangle' },
    { id: 'circle', icon: <Circle size={18} />, label: 'Circle' },
    { id: 'eraser', icon: <Eraser size={18} />, label: 'Eraser' },
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
