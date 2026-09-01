import type {Icon} from "../model/icon.ts";
import styles from './DesktopGrid.module.css'

const desktopIcons: Icon[] = [
    {
        key: 'explorer',
        label: 'Explorer',
        icon: 'icons.svg',
    },
    {
        key: 'computer',
        label: 'Computer',
        icon: 'icons.svg',
    },
    {
        key: 'trash',
        label: 'Trash',
        icon: 'icons.svg',
    },
];

export function DesktopGrid() {
    return (
        <div
            className={styles.iconGrid}
        >
            {desktopIcons.map((item)=> (
                <button
                    key={item.key}
                    type="button"
                    className={styles.desktopIcon}
                >
                    <img src={item.icon} height={90} width={90} alt={''} />
                    <span>{item.label}</span>
                </button>
            ))}
        </div>
    )
}