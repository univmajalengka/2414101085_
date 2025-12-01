import React, { useState } from 'react';
import { ShoppingCart, Percent, Tag } from 'lucide-react';

const DiscountCalculator = () => {
  const [price, setPrice] = useState('');
  const [discount, setDiscount] = useState('');

  // Logika Diskon
  const calculateDiscount = () => {
    const originalPrice = parseFloat(price) || 0;
    const discountPercent = parseFloat(discount) || 0;
    
    const discountAmount = (originalPrice * discountPercent) / 100;
    const finalPrice = originalPrice - discountAmount;
    const savings = discountAmount;
    
    return {
      originalPrice,
      discountPercent,
      discountAmount,
      finalPrice,
      savings
    };
  };

  const result = calculateDiscount();

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-gray-100 rounded-3xl p-8 w-full max-w-md">
        <div className="flex items-center justify-center mb-6">
          <ShoppingCart className="w-12 h-12 text-blue-600" />
        </div>
        
        <h1 className="text-3xl font-bold text-center mb-2 text-gray-800">
          Hitung Diskon Belanja
        </h1>
        <p className="text-center text-gray-500 mb-8">Hemat lebih banyak!</p>

        <div className="space-y-6">
          <div className="bg-gray-100 rounded-2xl p-4 border-2 border-gray-200">
            <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">
              Harga Produk
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full bg-transparent text-2xl font-bold text-gray-800 focus:outline-none"
              placeholder="0"
            />
          </div>

          <div className="bg-gray-100 rounded-2xl p-4 border-2 border-gray-200">
            <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">
              Persentase Diskon
            </label>
            <div className="flex items-center">
              <input
                type="number"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                className="w-full bg-transparent text-2xl font-bold text-gray-800 focus:outline-none"
                placeholder="0"
              />
              <Percent className="w-6 h-6 text-blue-600 ml-2" />
            </div>
          </div>

          {result.originalPrice > 0 && (
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Tag className="w-5 h-5" />
                  <span>Hemat</span>
                </div>
                <span className="text-xl font-bold">
                  Rp {result.savings.toLocaleString('id-ID')}
                </span>
              </div>
              
              <div className="border-t border-blue-400 pt-4">
                <div className="text-sm opacity-90 mb-1">Total Bayar</div>
                <div className="text-3xl font-bold">
                  Rp {result.finalPrice.toLocaleString('id-ID')}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DiscountCalculator;