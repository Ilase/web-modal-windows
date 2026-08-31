import {ModalWindow} from "../components/modal-window/ui/ModalWindow.tsx";
import {BottomBar} from "../components/navigation-bar/ui/BottomBar.tsx";

const windows = [
    'Explorer',

];

export function MainPage() {
    return (
        <main>
            {windows.map((title) => (
                <ModalWindow key={title} title={title}/>
            ))}

            <BottomBar/>
        </main>
    )
}
