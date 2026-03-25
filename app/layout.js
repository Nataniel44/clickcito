
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { OrderTrackerProvider } from "@/components/contexts/OrderTrackerContext";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { Suspense } from "react";
import PageTransitions from "./PageTransitions";

import CartConflictModal from "./components/CartConflictModal";
import OfflineNotice from "./components/OfflineNotice";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <link rel="icon" href="./c.png" type="image/x-icon" />

      <body
        className={`dark:bg-white max-w-screen mx-auto`}
      >


        <AuthProvider>
          <OfflineNotice />
          <Navbar />
          <CartProvider>
            <CartConflictModal />
            <OrderTrackerProvider >
              <Suspense fallback={null}>
                <PageTransitions>
                  {children}
                </PageTransitions>
              </Suspense>
              <Toaster position="top-center" />
            </OrderTrackerProvider>
          </CartProvider>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
