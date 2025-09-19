import { Truck, Globe, Clock, Package, Shield, MapPin } from 'lucide-react';

export default function ShippingPage() {
  const shippingZones = [
    {
      region: 'France (Metropolitan)',
      standard: { time: '2-3 business days', cost: '€15', free: '€150' },
      express: { time: '1 business day', cost: '€25', free: '€300' },
    },
    {
      region: 'European Union',
      standard: { time: '3-5 business days', cost: '€20', free: '€200' },
      express: { time: '1-2 business days', cost: '€35', free: '€400' },
    },
    {
      region: 'United Kingdom',
      standard: { time: '4-6 business days', cost: '€25', free: '€250' },
      express: { time: '2-3 business days', cost: '€45', free: '€500' },
    },
    {
      region: 'United States',
      standard: { time: '5-7 business days', cost: '€30', free: '€300' },
      express: { time: '2-3 business days', cost: '€60', free: '€600' },
    },
    {
      region: 'Rest of World',
      standard: { time: '7-14 business days', cost: '€40', free: '€400' },
      express: { time: '3-5 business days', cost: '€80', free: '€800' },
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <Truck className="w-12 h-12 text-black" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Shipping Information</h1>
          <p className="text-lg text-gray-600">
            Fast, secure, and worldwide delivery for your luxury sneakers
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-xl shadow-sm p-6 text-center">
            <Globe className="w-10 h-10 text-black mx-auto mb-3" />
            <h3 className="font-bold text-lg mb-2">Worldwide Shipping</h3>
            <p className="text-gray-600">
              We ship to over 100 countries with trusted carriers
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 text-center">
            <Shield className="w-10 h-10 text-black mx-auto mb-3" />
            <h3 className="font-bold text-lg mb-2">Insured Delivery</h3>
            <p className="text-gray-600">
              All orders are fully insured against loss or damage
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 text-center">
            <Package className="w-10 h-10 text-black mx-auto mb-3" />
            <h3 className="font-bold text-lg mb-2">Premium Packaging</h3>
            <p className="text-gray-600">
              Double-boxed with protective materials for safe delivery
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6">Shipping Rates & Times</h2>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3">Region</th>
                  <th className="text-left py-3">Standard Shipping</th>
                  <th className="text-left py-3">Express Shipping</th>
                </tr>
              </thead>
              <tbody>
                {shippingZones.map((zone) => (
                  <tr key={zone.region} className="border-b border-gray-100">
                    <td className="py-4">
                      <p className="font-semibold">{zone.region}</p>
                    </td>
                    <td className="py-4">
                      <div className="flex items-start gap-2">
                        <Clock className="w-4 h-4 text-gray-400 mt-0.5" />
                        <div>
                          <p className="text-sm">{zone.standard.time}</p>
                          <p className="text-sm font-medium">{zone.standard.cost}</p>
                          <p className="text-xs text-gray-500">Free over {zone.standard.free}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4">
                      <div className="flex items-start gap-2">
                        <Clock className="w-4 h-4 text-gray-400 mt-0.5" />
                        <div>
                          <p className="text-sm">{zone.express.time}</p>
                          <p className="text-sm font-medium">{zone.express.cost}</p>
                          <p className="text-xs text-gray-500">Free over {zone.express.free}</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6">Important Information</h2>

          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Processing Time
              </h3>
              <p className="text-gray-600">
                Orders are processed within 1-2 business days. Orders placed after 2 PM CET or on weekends
                will be processed the next business day. During sale periods, processing may take an additional 1-2 days.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Tracking
              </h3>
              <p className="text-gray-600">
                Once your order ships, you'll receive a tracking number via email. You can track your order
                status in your account dashboard or directly with the carrier.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-3">Customs & Import Duties</h3>
              <ul className="text-gray-600 space-y-2">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  International customers may be subject to customs duties and taxes
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  These charges are the responsibility of the customer
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  Li-Lo is not responsible for delays due to customs clearance
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  We declare the actual value of items for customs purposes
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-3">Shipping Restrictions</h3>
              <p className="text-gray-600 mb-2">
                We currently do not ship to the following locations:
              </p>
              <ul className="text-gray-600 space-y-1">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  P.O. Boxes (signature required for all deliveries)
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  APO/FPO addresses
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  Countries under international trade sanctions
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-3">Delivery Signature</h3>
              <p className="text-gray-600">
                For security reasons, all orders over €500 require a signature upon delivery.
                The carrier may request valid ID matching the name on the order.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="font-bold text-lg mb-3 text-blue-900">Need Help?</h3>
          <p className="text-blue-800 mb-4">
            If you have questions about shipping or need to change your delivery address,
            please contact us within 1 hour of placing your order.
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href="/contact"
              className="inline-block bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors"
            >
              Contact Support
            </a>
            <a
              href="/returns"
              className="inline-block border border-black text-black px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              View Return Policy
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}