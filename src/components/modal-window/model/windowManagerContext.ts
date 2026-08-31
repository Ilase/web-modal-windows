import {createContext, useCallback, useContext, useEffect, useId,} from 'react';

export type WindowMode = 'expanded' | 'minimized' | 'closed';

export type ManagedWindow = {
    id: string;
    title: string;
    mode: WindowMode;
};

export type WindowManagerContextValue = {
    windows: ManagedWindow[];
    activeWindowId: string | null;
    registerWindow: (id: string, title: string) => void;
    unregisterWindow: (id: string) => void;
    activateWindow: (id: string) => void;
    minimizeWindow: (id: string) => void;
    restoreWindow: (id: string) => void;
    closeWindow: (id: string) => void;
    toggleWindow: (id: string) => void;
};

const Z_INDEX_START = 100;

export const WindowManagerContext = createContext<WindowManagerContextValue | null>(null);

export function useWindowManager() {
    const context = useContext(WindowManagerContext);

    if (!context) {
        throw new Error('useWindowManager must be used inside WindowManagerProvider');
    }

    return context;
}

export function useManagedWindow(title: string) {
    const id = useId();
    const {
        windows,
        activeWindowId,
        registerWindow,
        unregisterWindow,
        activateWindow,
        minimizeWindow,
        restoreWindow,
        closeWindow,
    } = useWindowManager();

    useEffect(() => {
        registerWindow(id, title);
        return () => unregisterWindow(id);
    }, [id, title, registerWindow, unregisterWindow]);

    const index = windows.findIndex((window) => window.id === id);
    const window = windows[index];

    const activate = useCallback(
        () => activateWindow(id),
        [id, activateWindow],
    );
    const minimize = useCallback(
        () => minimizeWindow(id),
        [id, minimizeWindow],
    );
    const restore = useCallback(
        () => restoreWindow(id),
        [id, restoreWindow],
    );

    const close = useCallback(
        () => closeWindow(id),
        [id, closeWindow],
    );

    return {
        id,
        zIndex: Z_INDEX_START + Math.max(index, 0),
        mode: window?.mode ?? 'expanded',
        isActive: activeWindowId === id,
        activate,
        minimize,
        restore,
        close
    };
}
