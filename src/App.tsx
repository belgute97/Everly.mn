import { useCallback, useState } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import AdBanner from './components/AdBanner'
import ChatWidget from './components/ChatWidget'
import ContactInfo from './components/ContactInfo'
import Header from './components/Header'
import SideMenu from './components/SideMenu'
import Toast, { type ToastData } from './components/Toast'
import { products } from './data/products'
import { useCart } from './hooks/useCart'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import GamesPage from './pages/GamesPage'
import HelpPage from './pages/HelpPage'
import HoroscopePage from './pages/HoroscopePage'
import NotFoundPage from './pages/NotFoundPage'
import ProductDetailPage from './pages/ProductDetailPage'
import ProductCollectionPage from './pages/ProductCollectionPage'
import ProductsPage from './pages/ProductsPage'
import ProfilePage from './pages/ProfilePage'
import WalletPage from './pages/WalletPage'
import { isPromo } from './utils/promo'

const saleCount = products.filter(isPromo).length

function App() {
  const cart = useCart()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const closeMenu = useCallback(() => setMenuOpen(false), [])
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

  const productsPage = (saleOnly: boolean) => (
    <ProductsPage getQty={cart.quantityOf} onAdd={handleAdd} onSetQuantity={cart.setQuantity} saleOnly={saleOnly} />
  )

  return (
    <div className="shell">
      <SideMenu open={menuOpen} onClose={closeMenu} saleCount={saleCount} />
      <main className="app">
        <AdBanner />
        <Header count={cart.count} onMenu={() => setMenuOpen(true)} />
        {/* key нь хуудас солигдох бүрт fade-up animation-ыг дахин ажиллуулна */}
        <div className="page" key={location.pathname}>
          <Routes location={location}>
            <Route path="/" element={productsPage(false)} />
            <Route path="/sale" element={productsPage(true)} />
            <Route path="/products/:id" element={<ProductDetailPage getQty={cart.quantityOf} onAdd={handleAdd} />} />
            <Route
              path="/cart"
              element={
                <CartPage items={cart.items} maxFor={cart.maxFor} onSetQuantity={cart.setQuantity} onRemove={handleRemove} />
              }
            />
            <Route path="/checkout" element={<CheckoutPage items={cart.items} onClear={cart.clear} />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/saved" element={<ProductCollectionPage kind="saved" getQty={cart.quantityOf} onAdd={handleAdd} onSetQuantity={cart.setQuantity} />} />
            <Route path="/viewed" element={<ProductCollectionPage kind="viewed" getQty={cart.quantityOf} onAdd={handleAdd} onSetQuantity={cart.setQuantity} />} />
            <Route path="/wallet" element={<WalletPage />} />
            <Route path="/help" element={<HelpPage />} />
            <Route path="/horoscope" element={<HoroscopePage />} />
            <Route path="/games" element={<GamesPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
        <footer className="site-footer">
          <strong>Everly</strong>
          <p>Хүнс, хувцас, гал тогоо, цахилгаан бараа, технологи нэг дор. Туршилтын дэлгүүр: жинхэнэ төлбөр авахгүй.</p>
          <ContactInfo heading="h3" />
        </footer>
        <Toast toast={toast} onClose={closeToast} />
        <ChatWidget />
      </main>
    </div>
  )
}

export default App
