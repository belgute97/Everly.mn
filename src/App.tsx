import { Route, Routes } from 'react-router-dom'
import ChatWidget from './components/ChatWidget'
import ProductDetailPage from './pages/ProductDetailPage'
import ProductsPage from './pages/ProductsPage'

function App() {
  return (
    <main className="app">
      <h1>Everly</h1>
      <Routes>
        <Route path="/" element={<ProductsPage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route path="*" element={<p className="empty">Бараа олдсонгүй</p>} />
      </Routes>
      <ChatWidget />
    </main>
  )
}

export default App
