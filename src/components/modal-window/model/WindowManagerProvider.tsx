import {
    type ReactNode,
    useCallback,
    useMemo,
    useState,
} from 'react';
import {
    type ManagedWindow,
    WindowManagerContext,
} from './windowManagerContext.ts';

function findActiveWindowId(windows: ManagedWindow[]) {
    for (let index = windows.length - 1; index >= 0; index -= 1) {
        if (windows[index].mode === 'expanded') return windows[index].id;
    }

    return null;
}

export function WindowManagerProvider({children}: {children: ReactNode}) {
    // Порядок элементов в массиве одновременно является порядком слоёв.
    // Последнее развёрнутое окно находится выше остальных.
    const [windows, setWindows] = useState<ManagedWindow[]>([]);

    const registerWindow = useCallback((id: string, title: string) => {
        setWindows((current) => {
            const existingWindow = current.find((window) => window.id === id);

            if (!existingWindow) {
                return [...current, {id, title, mode: 'expanded'}];
            }

            if (existingWindow.title === title) return current;

            return current.map((window) =>
                window.id === id ? {...window, title} : window,
            );
        });
    }, []);

    const unregisterWindow = useCallback((id: string) => {
        setWindows((current) => current.filter((window) => window.id !== id));
    }, []);

    const activateWindow = useCallback((id: string) => {
        setWindows((current) => {
            const target = current.find((window) => window.id === id);
            if (!target) return current;

            return [
                ...current.filter((window) => window.id !== id),
                {...target, mode: 'expanded'},
            ];
        });
    }, []);

    const minimizeWindow = useCallback((id: string) => {
        setWindows((current) => current.map((window) =>
            window.id === id ? {...window, mode: 'minimized'} : window,
        ));
    }, []);

    const restoreWindow = useCallback((id: string) => {
        setWindows((current) => {
            const target = current.find((window) => window.id === id);
            if (!target) return current;

            return [
                ...current.filter((window) => window.id !== id),
                {...target, mode: 'expanded'},
            ];
        });
    }, []);

    const closeWindow = useCallback((id: string) => {
        setWindows((current) => current.map((window) =>
            window.id === id ? {...window, mode: 'closed'} : window,
        ));
    }, []);

    const toggleWindow = useCallback((id: string) => {
        setWindows((current) => {
            const target = current.find((window) => window.id === id);
            if (!target) return current;

            const activeWindowId = findActiveWindowId(current);

            if (target.mode === 'minimized') {
                return [
                    ...current.filter((window) => window.id !== id),
                    {...target, mode: 'expanded'},
                ];
            }

            if (activeWindowId === id) {
                return current.map((window) =>
                    window.id === id ? {...window, mode: 'minimized'} : window,
                );
            }

            return [
                ...current.filter((window) => window.id !== id),
                target,
            ];
        });
    }, []);

    const activeWindowId = findActiveWindowId(windows);

    const value = useMemo(() => ({
        windows,
        activeWindowId,
        registerWindow,
        unregisterWindow,
        activateWindow,
        minimizeWindow,
        restoreWindow,
        closeWindow,
        toggleWindow,
    }), [
        windows,
        activeWindowId,
        registerWindow,
        unregisterWindow,
        activateWindow,
        minimizeWindow,
        restoreWindow,
        closeWindow,
        toggleWindow,
    ]);

    return (
        <WindowManagerContext.Provider value={value}>
            {children}
        </WindowManagerContext.Provider>
    );
}
