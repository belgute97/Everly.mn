import { Route, Routes } from 'react-router-dom'
import ChatWidget from './components/ChatWidget'
import Header from './components/Header'
import { useCart } from './hooks/useCart'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import ProductDetailPage from './pages/ProductDetailPage'
import ProductsPage from './pages/ProductsPage'

function App() {
  const cart = useCart()

  return (
    <main className="app">
      <Header count={cart.count} />
      <Routes>
        <Route path="/" element={<ProductsPage onAdd={cart.add} />} />
        <Route path="/products/:id" element={<ProductDetailPage onAdd={cart.add} />} />
        <Route
          path="/cart"
          element={<CartPage items={cart.items} onSetQuantity={cart.setQuantity} onRemove={cart.remove} />}
        />
        <Route path="/checkout" element={<CheckoutPage items={cart.items} onClear={cart.clear} />} />
        <Route path="*" element={<p className="empty">Бараа олдсонгүй</p>} />
      </Routes>
      <ChatWidget />
    </main>
  )
}

export default App
