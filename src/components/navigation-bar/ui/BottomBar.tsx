import styles from './BottomBar.module.css'
import {useWindowManager} from '../../modal-window/model/windowManagerContext.ts';

export function BottomBar(){
    const manager = useWindowManager();

    return (
        <div className={styles.bottomBar}>
            <button type="button">
                Menu
            </button>
            <div className={styles.windows}>
                {manager.windows
                    .filter((window) => window.mode !== 'closed')
                    .map((window) => {
                    const isActive = manager.activeWindowId === window.id;
                    const className = [
                        styles.windowButton,
                        isActive ? styles.active : '',
                        window.mode === 'minimized' ? styles.minimized : '',
                    ].filter(Boolean).join(' ');

                    return (
                        <button
                            key={window.id}
                            type="button"
                            className={className}
                            onClick={() => manager.toggleWindow(window.id)}
                        >
                            {window.title}
                        </button>
                    );
                    })}
            </div>
        </div>
    )
}
