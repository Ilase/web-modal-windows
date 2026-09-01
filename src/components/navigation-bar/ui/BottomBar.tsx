import styles from './BottomBar.module.css'
import {useWindowManager} from '../../modal-window/model/windowManagerContext.ts';
import {useEffect, useRef, useState} from 'react';

export function BottomBar() {
    const manager = useWindowManager();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isMenuOpen) return;

        function closeMenu(event: PointerEvent) {
            if (!menuRef.current?.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        }

        document.addEventListener('pointerdown', closeMenu);
        return () => document.removeEventListener('pointerdown', closeMenu);
    }, [isMenuOpen]);

    function openExplorer() {
        const explorer = manager.windows.find(
            (window) => window.title === 'Explorer',
        );

        if (explorer) {
            manager.activateWindow(explorer.id);
        }

        setIsMenuOpen(false);
    }

    return (
        <div className={styles.bottomBar}>
            <button
                type="button"
                className={styles.bottomBarMenuButton}
                aria-label="Открыть меню программ"
                aria-expanded={isMenuOpen}
                onClick={() => setIsMenuOpen((current) => !current)}
            >
                <img
                    width={25}
                    height={25}
                    src={'/windows_vista/vista_warning.ico'}
                    alt={'menu'}
                />
            </button>

            {isMenuOpen && (
                <div ref={menuRef} className={styles.programMenu}>
                    <div className={styles.programMenuTitle}>Программы</div>
                    <button
                        type="button"
                        className={styles.programButton}
                        onClick={openExplorer}
                    >
                        Explorer
                    </button>
                </div>
            )}

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
