import { useState, useRef, useCallback, useEffect } from 'react';
import { Stage, Layer, Line, Rect, Circle, Line as KonvaLine } from 'react-konva';
import type Konva from 'konva';
import { CanvasToolbar, type Tool } from '../components/canvas/CanvasToolbar';
import '../components/canvas/canvas.css';

interface ShapeBase {
    id: string;
    stroke: string;
    strokeWidth: number;
}

interface PencilShape extends ShapeBase {
    type: 'pencil';
    points: number[];
}

interface RectShape extends ShapeBase {
    type: 'rect';
    x: number;
    y: number;
    width: number;
    height: number;
}

interface CircleShape extends ShapeBase {
    type: 'circle';
    x: number;
    y: number;
    radius: number;
}

interface LineShape extends ShapeBase {
    type: 'line';
    points: number[];
}

interface EraserShape extends ShapeBase {
    type: 'eraser';
    points: number[];
}

type DrawShape = PencilShape | RectShape | CircleShape | LineShape | EraserShape;

let shapeId = 0;
const nextId = () => `shape-${++shapeId}`;

export const CanvasPage = () => {
    const [tool, setTool] = useState<Tool>('pencil');
    const [strokeColor, setStrokeColor] = useState('#ffffff');
    const [strokeWidth, setStrokeWidth] = useState(3);
    const [shapes, setShapes] = useState<DrawShape[]>([]);
    const [isDrawing, setIsDrawing] = useState(false);
    const [stagePos, setStagePos] = useState({ x: 0, y: 0 });
    const [stageScale, setStageScale] = useState(1);
    const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });

    const currentShapeRef = useRef<DrawShape | null>(null);
    const stageRef = useRef<Konva.Stage>(null);

    useEffect(() => {
        const handleResize = () => {
            setDimensions({ width: window.innerWidth, height: window.innerHeight });
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Get pointer position relative to stage (accounting for pan/zoom)
    const getRelativePointerPosition = useCallback(() => {
        const stage = stageRef.current;
        if (!stage) return { x: 0, y: 0 };
        const pointer = stage.getPointerPosition();
        if (!pointer) return { x: 0, y: 0 };
        const transform = stage.getAbsoluteTransform().copy().invert();
        return transform.point(pointer);
    }, []);

    const handleMouseDown = useCallback(() => {
        if (tool === 'pan') return;
        setIsDrawing(true);
        const pos = getRelativePointerPosition();
        const id = nextId();

        let shape: DrawShape;
        switch (tool) {
            case 'pencil':
                shape = { id, type: 'pencil', points: [pos.x, pos.y], stroke: strokeColor, strokeWidth };
                break;
            case 'eraser':
                shape = { id, type: 'eraser', points: [pos.x, pos.y], stroke: '#0a0e1a', strokeWidth: strokeWidth * 3 };
                break;
            case 'rect':
                shape = { id, type: 'rect', x: pos.x, y: pos.y, width: 0, height: 0, stroke: strokeColor, strokeWidth };
                break;
            case 'circle':
                shape = { id, type: 'circle', x: pos.x, y: pos.y, radius: 0, stroke: strokeColor, strokeWidth };
                break;
            case 'line':
                shape = { id, type: 'line', points: [pos.x, pos.y, pos.x, pos.y], stroke: strokeColor, strokeWidth };
                break;
            default:
                return;
        }
        currentShapeRef.current = shape;
        setShapes((prev) => [...prev, shape]);
    }, [tool, strokeColor, strokeWidth, getRelativePointerPosition]);

    const handleMouseMove = useCallback(() => {
        if (!isDrawing || tool === 'pan') return;
        const pos = getRelativePointerPosition();
        const current = currentShapeRef.current;
        if (!current) return;

        let updated: DrawShape;
        switch (current.type) {
            case 'pencil':
            case 'eraser':
                updated = { ...current, points: [...current.points, pos.x, pos.y] };
                break;
            case 'rect':
                updated = { ...current, width: pos.x - current.x, height: pos.y - current.y };
                break;
            case 'circle': {
                const dx = pos.x - current.x;
                const dy = pos.y - current.y;
                updated = { ...current, radius: Math.sqrt(dx * dx + dy * dy) };
                break;
            }
            case 'line':
                updated = { ...current, points: [current.points[0], current.points[1], pos.x, pos.y] };
                break;
            default:
                return;
        }
        currentShapeRef.current = updated;
        setShapes((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
    }, [isDrawing, tool, getRelativePointerPosition]);

    const handleMouseUp = useCallback(() => {
        setIsDrawing(false);
        currentShapeRef.current = null;
    }, []);

    const handleWheel = useCallback((e: Konva.KonvaEventObject<WheelEvent>) => {
        e.evt.preventDefault();
        const stage = stageRef.current;
        if (!stage) return;

        const oldScale = stageScale;
        const pointer = stage.getPointerPosition();
        if (!pointer) return;

        const scaleBy = 1.08;
        const newScale = e.evt.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy;
        const clampedScale = Math.min(Math.max(newScale, 0.1), 10);

        const mousePointTo = {
            x: (pointer.x - stagePos.x) / oldScale,
            y: (pointer.y - stagePos.y) / oldScale,
        };

        setStageScale(clampedScale);
        setStagePos({
            x: pointer.x - mousePointTo.x * clampedScale,
            y: pointer.y - mousePointTo.y * clampedScale,
        });
    }, [stageScale, stagePos]);

    const handleUndo = useCallback(() => {
        setShapes((prev) => prev.slice(0, -1));
    }, []);

    const handleClear = useCallback(() => {
        setShapes([]);
    }, []);

    const renderShape = (shape: DrawShape) => {
        switch (shape.type) {
            case 'pencil':
            case 'eraser':
                return (
                    <Line
                        key={shape.id}
                        points={shape.points}
                        stroke={shape.stroke}
                        strokeWidth={shape.strokeWidth}
                        tension={0.5}
                        lineCap="round"
                        lineJoin="round"
                        globalCompositeOperation={shape.type === 'eraser' ? 'destination-out' : 'source-over'}
                    />
                );
            case 'rect':
                return (
                    <Rect
                        key={shape.id}
                        x={shape.x}
                        y={shape.y}
                        width={shape.width}
                        height={shape.height}
                        stroke={shape.stroke}
                        strokeWidth={shape.strokeWidth}
                        fillEnabled={false}
                    />
                );
            case 'circle':
                return (
                    <Circle
                        key={shape.id}
                        x={shape.x}
                        y={shape.y}
                        radius={shape.radius}
                        stroke={shape.stroke}
                        strokeWidth={shape.strokeWidth}
                        fillEnabled={false}
                    />
                );
            case 'line':
                return (
                    <KonvaLine
                        key={shape.id}
                        points={shape.points}
                        stroke={shape.stroke}
                        strokeWidth={shape.strokeWidth}
                        lineCap="round"
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div className="canvas-wrapper">
            <CanvasToolbar
                activeTool={tool}
                onToolChange={setTool}
                strokeColor={strokeColor}
                onColorChange={setStrokeColor}
                strokeWidth={strokeWidth}
                onStrokeWidthChange={setStrokeWidth}
                onUndo={handleUndo}
                onClear={handleClear}
                zoom={stageScale}
            />
            <Stage
                ref={stageRef}
                width={dimensions.width}
                height={dimensions.height}
                scaleX={stageScale}
                scaleY={stageScale}
                x={stagePos.x}
                y={stagePos.y}
                draggable={tool === 'pan'}
                onDragEnd={(e) => {
                    setStagePos({ x: e.target.x(), y: e.target.y() });
                }}
                onMouseDown={handleMouseDown}
                onMousemove={handleMouseMove}
                onMouseup={handleMouseUp}
                onTouchStart={handleMouseDown}
                onTouchMove={handleMouseMove}
                onTouchEnd={handleMouseUp}
                onWheel={handleWheel}
                style={{ cursor: tool === 'pan' ? 'grab' : 'crosshair' }}
            >
                <Layer>
                    {shapes.map(renderShape)}
                </Layer>
            </Stage>
        </div>
    );
};
