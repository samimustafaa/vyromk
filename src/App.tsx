import { BrowserRouter, Link, Route, Routes, useLocation } from 'react-router-dom'
import './App.css'
import { AdminLayout } from './admin/AdminLayout'
import { AdminCategories } from './admin/AdminCategories'
import { AdminCustomers } from './admin/AdminCustomers'
import { AdminDashboard } from './admin/AdminDashboard'
import { AdminDiscounts } from './admin/AdminDiscounts'
import { AdminInventory } from './admin/AdminInventory'
import { AdminOrders } from './admin/AdminOrders'
import { AdminProducts } from './admin/AdminProducts'
import { AdminReviews } from './admin/AdminReviews'
import { AdminSales } from './admin/AdminSales'
import { AdminSettings } from './admin/AdminSettings'
import { CartDrawer } from './components/CartDrawer'
import { CheckoutModal } from './components/CheckoutModal'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { StoreProvider, useStore } from './context/StoreContext'
import { AboutPage } from './pages/AboutPage'
import { HomePage } from './pages/HomePage'
import { ProductDetailPage } from './pages/ProductDetailPage'
import { ShopPage } from './pages/ShopPage'
import { TrackOrderPage } from './pages/TrackOrderPage'

function NotFound() {
  return (
    <div className="empty-search container">
      <p>This page doesn&apos;t exist.</p>
      <Link to="/" className="btn btn-dark">
        Back to store
      </Link>
    </div>
  )
}

/** Storefront shell — header, footer, cart and checkout only. */
function StorefrontShell() {
  const location = useLocation()

  return (
    <div className="app-root">
      <Header />
      <main key={location.pathname} className="page-enter">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/product/:slug" element={<ProductDetailPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/track-order" element={<TrackOrderPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <CartDrawer />
      <CheckoutModal />
    </div>
  )
}

function Toast() {
  const { toast } = useStore()
  if (!toast) return null
  return (
    <div className="toast-banner" role="status" aria-live="polite">
      {toast}
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <StoreProvider>
        <Routes>
          {/* Separate admin console — no storefront chrome */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="sales" element={<AdminSales />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="inventory" element={<AdminInventory />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="discounts" element={<AdminDiscounts />} />
            <Route path="reviews" element={<AdminReviews />} />
            <Route path="customers" element={<AdminCustomers />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          <Route path="/*" element={<StorefrontShell />} />
        </Routes>
        <Toast />
      </StoreProvider>
    </BrowserRouter>
  )
}
