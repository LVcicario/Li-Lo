'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { useAuthStore } from '@/lib/auth-store';
import { useCartStore } from '@/lib/cart-store';

export default function WishlistPage() {
  const router = useRouter();
  const { user, checkUser } = useAuthStore();
  const { addItem } = useCartStore();
  const [loading, setLoading] = useState(true);
  const [wishlistItems, setWishlistItems] = useState([
    {
      id: '1',
      name: 'Air Jordan 1 Retro High',
      brand: 'Nike',
      price: 459,
      image: '/api/placeholder/300/300',
      inStock: true,
    },
    {
      id: '2',
      name: 'Yeezy Boost 350 V2',
      brand: 'Adidas',
      price: 789,
      image: '/api/placeholder/300/300',
      inStock: false,
    },
  ]);

  useEffect(() => {
    checkUser().then(() => {
      if (!user) {
        router.push('/auth/login');
      }
      setLoading(false);
    });
  }, []);

  const removeFromWishlist = (id: string) => {
    setWishlistItems(items => items.filter(item => item.id !== id));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            href="/account/dashboard"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-black"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </Link>
        </div>

        <h1 className="text-3xl font-bold mb-8">My Wishlist ({wishlistItems.length})</h1>

        {wishlistItems.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Your wishlist is empty</h2>
            <p className="text-gray-600 mb-6">
              Save your favorite sneakers here for quick access later.
            </p>
            <Link
              href="/sneakers"
              className="inline-block bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800"
            >
              Discover Sneakers
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlistItems.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-sm overflow-hidden"
              >
                <div className="aspect-square bg-gray-100 relative">
                  <button
                    onClick={() => removeFromWishlist(item.id)}
                    className="absolute top-4 right-4 p-2 bg-white rounded-full shadow hover:bg-red-50"
                  >
                    <Trash2 className="w-5 h-5 text-red-500" />
                  </button>
                </div>
                <div className="p-6">
                  <p className="text-sm text-gray-600">{item.brand}</p>
                  <h3 className="font-semibold text-lg mb-2">{item.name}</h3>
                  <p className="font-bold text-xl mb-4">€{item.price}</p>
                  {item.inStock ? (
                    <button
                      onClick={() => {
                        addItem({
                          id: item.id,
                          name: item.name,
                          price: item.price,
                          size: '10',
                          quantity: 1,
                          image: item.image,
                        });
                      }}
                      className="w-full flex items-center justify-center gap-2 bg-black text-white py-3 rounded-lg hover:bg-gray-800"
                    >
                      <ShoppingBag className="w-5 h-5" />
                      Add to Cart
                    </button>
                  ) : (
                    <button disabled className="w-full py-3 bg-gray-100 text-gray-400 rounded-lg cursor-not-allowed">
                      Out of Stock
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}