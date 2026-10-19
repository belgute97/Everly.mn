import { useCallback, useState } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import ChatWidget from './components/ChatWidget'
import Header from './components/Header'
import Toast, { type ToastData } from './components/Toast'
import { products } from './data/products'
import { useCart } from './hooks/useCart'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import NotFoundPage from './pages/NotFoundPage'
import ProductDetailPage from './pages/ProductDetailPage'
import ProductsPage from './pages/ProductsPage'

function App() {
  const cart = useCart()
  const location = useLocation()
  const [toast, setToast] = useState<ToastData | null>(null)
  const closeToast = useCallback(() => setToast(null), [])
  const show = (t: Omit<ToastData, 'id'>) => setToast({ ...t, id: Date.now() })

  const handleAdd = (productId: string, size: string) => {
    const product = products.find((p) => p.id === productId)
    if (!product) return
    const result = cart.add(productId, size)
    if (result === 'added') {
      show({ message: `${product.name}${product.sizes.length > 1 ? ` (${size})` : ''} сагсанд нэмэгдлээ`, link: { to: '/cart', label: 'Сагс харах' } })
    } else if (result === 'soldout') {
      show({ message: `${product.name} дууссан байна` })
    } else {
      show({ message: `Үлдэгдэл ${product.stock} ширхэг байгаа тул нэмэх боломжгүй` })
    }
  }

  const handleRemove = (productId: string, size: string) => {
    const item = cart.items.find((i) => i.productId === productId && i.size === size)
    cart.remove(productId, size)
    if (item) show({ message: 'Бараа сагснаас устгагдлаа', action: { label: 'Буцаах', onClick: () => cart.restore(item) } })
  }

  return (
    <main className="app">
      <Header count={cart.count} />
      {/* key нь хуудас солигдох бүрт fade-up animation-ыг дахин ажиллуулна */}
      <div className="page" key={location.pathname}>
        <Routes location={location}>
          <Route
            path="/"
            element={<ProductsPage getQty={cart.quantityOf} onAdd={handleAdd} onSetQuantity={cart.setQuantity} />}
          />
          <Route path="/products/:id" element={<ProductDetailPage getQty={cart.quantityOf} onAdd={handleAdd} />} />
          <Route
            path="/cart"
            element={
              <CartPage items={cart.items} maxFor={cart.maxFor} onSetQuantity={cart.setQuantity} onRemove={handleRemove} />
            }
          />
          <Route path="/checkout" element={<CheckoutPage items={cart.items} onClear={cart.clear} />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
      <footer className="site-footer">
        <strong>Everly</strong>
        <p>Хүнс, хувцас, гал тогооны хэрэгсэл нэг дор. Туршилтын дэлгүүр: жинхэнэ төлбөр авахгүй.</p>
      </footer>
      <Toast toast={toast} onClose={closeToast} />
      <ChatWidget />
    </main>
  )
}

export default App
