import {type Corner, useModlaWindow} from "../hooks/useModlaWindow.ts";
import {useManagedWindow} from "../model/windowManagerContext.ts";
import styles from './ModalWindow.module.css'

type ModalWindowProps = {
    title: string;
};

export function ModalWindow({title}: ModalWindowProps) {
    const modalWindow = useModlaWindow();
    const managedWindow = useManagedWindow(title);

    if (managedWindow.mode !== 'expanded') return null;

    return (
        <div
            className={styles.window}
            style={{
                left: modalWindow.windowState.x,
                top: modalWindow.windowState.y,
                width: modalWindow.windowState.width,
                height: modalWindow.windowState.height,
                zIndex: managedWindow.zIndex,
            }}
            onPointerDownCapture={managedWindow.activate}
        >
            {(['nw', 'ne', 'sw', 'se'] as Corner[]).map((corner) => (
                <div
                    key={corner}
                    className={`${styles.resizeHandle} ${styles[corner]}`}
                    onPointerDown={(event) => modalWindow.startResize(event, corner)}
                    onPointerUp={modalWindow.stopResize}
                    onPointerMove={modalWindow.resizeWindow}
                />
            ))}
            <div
                className={styles.windowHeader}
                onPointerDown={modalWindow.startDragging}
                onPointerMove={modalWindow.moveWindow}
                onPointerUp={modalWindow.stopDragging}
            >
                <span>{title}</span>
                <div>
                    <button
                        type="button"
                        onPointerDown={modalWindow.stopPointerPropagation}
                        onClick={managedWindow.minimize}
                    >
                        —
                    </button>
                    <button
                        type="button"
                        onPointerDown={modalWindow.stopPointerPropagation}
                        onClick={managedWindow.close}
                    >
                        X
                    </button>
                </div>
            </div>
            <div className={styles.windowContentBackface}>
                <div className={styles.windowContent}>
                    <p>Window Content</p>
                </div>
            </div>
        </div>
    )
}
