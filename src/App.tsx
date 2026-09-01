import {BrowserRouter, Route, Routes} from "react-router-dom";
import {MainPage} from "./pages/MainPage.tsx";
import {WindowManagerProvider} from "./components/modal-window/model/WindowManagerProvider.tsx";
import './styles/index.css'

function App() {
  return (
    <BrowserRouter>
      <WindowManagerProvider>
        <Routes>
          <Route path={'/'} element={<MainPage/>}/>
        </Routes>
      </WindowManagerProvider>
    </BrowserRouter>
  )
}

export default App
