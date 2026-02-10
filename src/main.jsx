import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import './styles/styles.scss'
import GlobalProvider from './GlobalProvider.jsx'
import ModalWishlist from './components/Modal/ModalWishlist.jsx'
import ModalCart from './components/Modal/ModalCart.jsx'
import ModalQuickview from './components/Modal/ModalQuickview.jsx'
import { countdownTime } from './store/countdownTime'

const serverTimeLeft = countdownTime();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GlobalProvider>
      <App />
      <ModalWishlist />
      <ModalCart serverTimeLeft={serverTimeLeft} />
      <ModalQuickview />
    </GlobalProvider>
  </StrictMode>,
)
