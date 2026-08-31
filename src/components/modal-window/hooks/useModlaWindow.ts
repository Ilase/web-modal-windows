import * as React from "react";
import {useRef} from "react";


type Corner = 'nw' | 'ne' | 'sw' | 'se';
const MIN_WIDTH = 150;
const MIN_HEIGHT = 100;


const useModlaWindow = () => {
    const [windowState, setWindowState] = React.useState({
        x: 100,
        y: 100,
        width: 300,
        height: 200,
    })

    const resizeData = useRef<{
        corner: Corner;
        startX: number;
        startY: number;
        x: number;
        y: number;
        width: number;
        height: number;
    } | null>(null)

    const dragData = useRef<{
        startX: number;
        startY: number;
        x: number;
        y: number;
    } | null>(null)


    function startResize(
        event: React.PointerEvent<HTMLDivElement>,
        corner: Corner,
    ) {
        event.stopPropagation();
        resizeData.current = {
            corner,
            startX: event.clientX,
            startY: event.clientY,
            ...windowState,
        }
        event.currentTarget.setPointerCapture(event.pointerId)
    }

    function resizeWindow(event: React.PointerEvent<HTMLDivElement>) {
        const data = resizeData.current;
        if (!data) return;
        const dx = event.clientX - data.startX;
        const dy = event.clientY - data.startY;

        let {x, y, width, height} = data;

        if (data.corner.includes('e')) {
            width = Math.max(MIN_WIDTH, data.width + dx);
        }

        if (data.corner.includes('s')) {
            height = Math.max(MIN_HEIGHT, data.height + dy);
        }

        if (data.corner.includes('w')) {
            width = Math.max(MIN_WIDTH, data.width - dx);
            x = data.x + data.width - width;
        }

        if (data.corner.includes('n')) {
            height = Math.max(MIN_HEIGHT, data.height - dy);
            y = data.y + data.height - height;
        }


        setWindowState({x, y, width, height});
    }

    function stopResize() {
        resizeData.current = null;
    }

    function startDragging(event: React.PointerEvent<HTMLDivElement>) {
        if ((event.target as HTMLElement).closest('button')) return;

        dragData.current = {
            startX: event.clientX,
            startY: event.clientY,
            x: windowState.x,
            y: windowState.y,
        };

        event.currentTarget.setPointerCapture(event.pointerId);
    }

    function moveWindow(event: React.PointerEvent<HTMLDivElement>) {
        const data = dragData.current;
        if (!data) return;

        setWindowState((current) => ({
            ...current,
            x: data.x + event.clientX - data.startX,
            y: data.y + event.clientY - data.startY,
        }));
    }

    function stopDragging() {
        dragData.current = null;
    }

    function stopPointerPropagation(event: React.PointerEvent<HTMLButtonElement>) {
        event.stopPropagation();
    }

    return {
        windowState,
        resizeData,
        dragData,
        startResize,
        resizeWindow,
        stopResize,
        moveWindow,
        startDragging,
        stopDragging,
        stopPointerPropagation
    }
}

export {
    useModlaWindow,
    type Corner
}