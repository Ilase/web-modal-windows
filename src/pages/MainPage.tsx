import {ModalWindow} from "../components/modal-window/ui/ModalWindow.tsx";
import {BottomBar} from "../components/navigation-bar/ui/BottomBar.tsx";
import styles from './MainPage.module.css'
import {DesktopGrid} from "../components/desktop-grid/ui/DesktopGrid.tsx";

const windows = [
    'Explorer',
    'Explorer',
    'Explorer',
    'Explorer',

];

export function MainPage() {
    return (
        <main>
            <DesktopGrid/>
            <div className={styles.desktop}>
                {windows.map((title) => (
                    <ModalWindow key={title} title={title}/>
                ))}
            </div>
            <BottomBar/>
        </main>
    )
}
