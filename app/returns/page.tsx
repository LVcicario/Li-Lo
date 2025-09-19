import { ArrowLeft, Package, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export default function ReturnsPage() {
  const returnProcess = [
    {
      step: 1,
      title: 'Initiate Return',
      description: 'Log into your account and select the item(s) you wish to return',
    },
    {
      step: 2,
      title: 'Print Label',
      description: 'Download and print your prepaid return shipping label',
    },
    {
      step: 3,
      title: 'Pack Items',
      description: 'Securely pack items in original packaging with all tags attached',
    },
    {
      step: 4,
      title: 'Ship Package',
      description: 'Drop off at any authorized shipping location',
    },
    {
      step: 5,
      title: 'Receive Refund',
      description: 'Refund processed within 5-7 business days of receipt',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <ArrowLeft className="w-12 h-12 text-black" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Returns & Exchanges</h1>
          <p className="text-lg text-gray-600">
            Easy returns within 14 days of delivery
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6">Return Policy</h2>

          <div className="prose max-w-none text-gray-600">
            <p className="mb-4">
              At Li-Lo, we want you to be completely satisfied with your purchase. If for any reason
              you're not happy with your order, we offer a hassle-free return policy.
            </p>

            <div className="grid md:grid-cols-2 gap-6 my-8">
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-green-900 mb-2">Eligible for Return</h3>
                    <ul className="text-sm text-green-800 space-y-1">
                      <li>• Unworn items with original tags attached</li>
                      <li>• Items in original packaging</li>
                      <li>• Returns initiated within 14 days of delivery</li>
                      <li>• Items with proof of purchase</li>
                      <li>• Regular-priced items</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <div className="flex items-start gap-3">
                  <XCircle className="w-6 h-6 text-red-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-red-900 mb-2">Not Eligible for Return</h3>
                    <ul className="text-sm text-red-800 space-y-1">
                      <li>• Worn or damaged items</li>
                      <li>• Items without original tags</li>
                      <li>• Limited edition collaborations (marked as final sale)</li>
                      <li>• Items purchased over 14 days ago</li>
                      <li>• Sale items marked as "Final Sale"</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6">Return Process</h2>

          <div className="space-y-4">
            {returnProcess.map((item) => (
              <div key={item.step} className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-bold">
                    {item.step}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6">Refund Information</h2>

          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Processing Time
              </h3>
              <p className="text-gray-600">
                Once we receive your return, please allow 3-5 business days for inspection.
                Refunds are processed within 5-7 business days after approval. The refund will
                be credited to your original payment method.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-3">Refund Amount</h3>
              <ul className="text-gray-600 space-y-2">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span><strong>Full refund:</strong> Items returned within 14 days in perfect condition</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span><strong>Shipping costs:</strong> Original shipping charges are non-refundable</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span><strong>Return shipping:</strong> Free for defective items, customer pays for change of mind</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6">Exchanges</h2>

          <p className="text-gray-600 mb-4">
            We don't offer direct exchanges. If you need a different size or color:
          </p>

          <ol className="list-decimal list-inside text-gray-600 space-y-2 mb-6">
            <li>Return the original item following our return process</li>
            <li>Place a new order for the desired item</li>
            <li>Contact customer service for expedited shipping on the new order</li>
          </ol>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Tip:</strong> To ensure availability of your preferred size/color, we recommend
              placing the new order before returning the original item.
            </p>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-8">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-amber-600 mt-1" />
            <div>
              <h3 className="font-bold text-lg mb-2 text-amber-900">International Returns</h3>
              <ul className="text-amber-800 space-y-2">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  International customers are responsible for return shipping costs
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  We recommend using a tracked shipping service
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  Any customs duties on returns are the customer's responsibility
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  International returns may take 14-21 days to process
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-gray-100 rounded-2xl p-8 text-center">
          <Package className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <h3 className="font-bold text-xl mb-3">Need to Return an Item?</h3>
          <p className="text-gray-600 mb-6">
            Start your return process now through your account dashboard
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="/account/orders"
              className="inline-block bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors"
            >
              Start Return
            </a>
            <a
              href="/contact"
              className="inline-block border border-black text-black px-8 py-3 rounded-lg hover:bg-white transition-colors"
            >
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}