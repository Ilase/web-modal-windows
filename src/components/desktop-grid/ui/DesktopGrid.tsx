import type {Icon} from "../model/icon.ts";
import styles from './DesktopGrid.module.css'
import {useRef, useState, type PointerEvent} from 'react';

type Position = {
    x: number;
    y: number;
};

const GRID_STEP = 98; // 90px размер иконки + 8px расстояние

const desktopIcons: Icon[] = [
    {
        key: 'explorer',
        label: 'Explorer',
        icon: 'windows_vista/vista_book_1.ico',

    },
    {
        key: 'computer',
        label: 'Computer',
        icon: 'windows_vista/vista_book_1.ico',
    },
    {
        key: 'trash',
        label: 'Trash',
        icon: 'windows_vista/vista_book_1.ico',

    },
];

export function DesktopGrid() {
    const [positions, setPositions] = useState<Record<string, Position>>({
        explorer: {x: 0, y: 0},
        computer: {x: 0, y: 98},
        trash: {x: 0, y: 196},
    });

    const dragData = useRef<{
        key: string;
        startX: number;
        startY: number;
        startLeft: number;
        startTop: number;
        maxX: number;
        maxY: number;
        currentX: number;
        currentY: number;
    } | null>(null);

    function startDragging(
        event: PointerEvent<HTMLButtonElement>,
        item: Icon,
    ) {
        const grid = event.currentTarget.parentElement;
        if (!grid) return;

        const currentPosition = positions[item.key] ?? {x: 0, y: 0};

        dragData.current = {
            key: item.key,
            startX: event.clientX,
            startY: event.clientY,
            startLeft: currentPosition.x,
            startTop: currentPosition.y,
            maxX: Math.max(0, grid.clientWidth - event.currentTarget.offsetWidth),
            maxY: Math.max(0, grid.clientHeight - event.currentTarget.offsetHeight),
            currentX: currentPosition.x,
            currentY: currentPosition.y,
        };

        event.currentTarget.setPointerCapture(event.pointerId);
    }

    function moveIcon(event: PointerEvent<HTMLButtonElement>) {
        const data = dragData.current;
        if (!data) return;

        const x = Math.min(
            data.maxX,
            Math.max(0, data.startLeft + event.clientX - data.startX),
        );
        const y = Math.min(
            data.maxY,
            Math.max(0, data.startTop + event.clientY - data.startY),
        );

        data.currentX = x;
        data.currentY = y;

        setPositions((current) => ({
            ...current,
            [data.key]: {x, y},
        }));
    }

    function findFreePosition(
        key: string,
        targetX: number,
        targetY: number,
        maxX: number,
        maxY: number,
    ): Position {
        const maxColumn = Math.floor(maxX / GRID_STEP);
        const maxRow = Math.floor(maxY / GRID_STEP);
        const targetColumn = Math.round(targetX / GRID_STEP);
        const targetRow = Math.round(targetY / GRID_STEP);

        const occupiedCells = new Set(
            Object.entries(positions)
                .filter(([itemKey]) => itemKey !== key)
                .map(([, position]) => {
                    const column = Math.round(position.x / GRID_STEP);
                    const row = Math.round(position.y / GRID_STEP);
                    return `${column}:${row}`;
                }),
        );

        let nearest: {position: Position; distance: number} | null = null;

        for (let row = 0; row <= maxRow; row += 1) {
            for (let column = 0; column <= maxColumn; column += 1) {
                if (occupiedCells.has(`${column}:${row}`)) continue;

                const distance =
                    Math.abs(column - targetColumn) +
                    Math.abs(row - targetRow);

                if (!nearest || distance < nearest.distance) {
                    nearest = {
                        position: {
                            x: column * GRID_STEP,
                            y: row * GRID_STEP,
                        },
                        distance,
                    };
                }
            }
        }

        return nearest?.position ?? {x: 0, y: 0};
    }

    function stopDragging(event: PointerEvent<HTMLButtonElement>) {
        const data = dragData.current;
        if (!data) return;

        const snappedX = Math.min(
            data.maxX,
            Math.max(0, Math.round(data.currentX / GRID_STEP) * GRID_STEP),
        );
        const snappedY = Math.min(
            data.maxY,
            Math.max(0, Math.round(data.currentY / GRID_STEP) * GRID_STEP),
        );

        const {x, y} = findFreePosition(
            data.key,
            snappedX,
            snappedY,
            data.maxX,
            data.maxY,
        );

        setPositions((current) => ({
            ...current,
            [data.key]: {x, y},
        }));

        event.currentTarget.releasePointerCapture(event.pointerId);
        dragData.current = null;
    }

    return (
        <div
            className={styles.iconGrid}
        >
            {desktopIcons.map((item) => (
                <button
                    key={item.key}
                    type="button"
                    className={styles.desktopIcon}
                    style={{
                        left: positions[item.key]?.x ?? 0,
                        top: positions[item.key]?.y ?? 0,
                    }}
                    onPointerDown={(event) => startDragging(event, item)}
                    onPointerMove={moveIcon}
                    onPointerUp={stopDragging}
                    onPointerCancel={() => {
                        dragData.current = null;
                    }}
                >
                    <img
                        src={item.icon}
                        className={styles.iconImage}
                        height={90}
                        width={90}
                        aria-hidden="true"
                        alt=""
                        draggable={false}
                        onDragStart={(event) => event.preventDefault()}
                    />
                    <span>{item.label}</span>
                </button>
            ))}
        </div>
    )
}
