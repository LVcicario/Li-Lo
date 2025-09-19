import { Ruler, Info, AlertCircle } from 'lucide-react';

export default function SizeGuidePage() {
  const sizeCharts = {
    men: {
      title: "Men's Sizes",
      sizes: [
        { us: '6', eu: '38.5', uk: '5.5', cm: '24' },
        { us: '6.5', eu: '39', uk: '6', cm: '24.5' },
        { us: '7', eu: '40', uk: '6.5', cm: '25' },
        { us: '7.5', eu: '40.5', uk: '7', cm: '25.5' },
        { us: '8', eu: '41', uk: '7.5', cm: '26' },
        { us: '8.5', eu: '42', uk: '8', cm: '26.5' },
        { us: '9', eu: '42.5', uk: '8.5', cm: '27' },
        { us: '9.5', eu: '43', uk: '9', cm: '27.5' },
        { us: '10', eu: '44', uk: '9.5', cm: '28' },
        { us: '10.5', eu: '44.5', uk: '10', cm: '28.5' },
        { us: '11', eu: '45', uk: '10.5', cm: '29' },
        { us: '11.5', eu: '45.5', uk: '11', cm: '29.5' },
        { us: '12', eu: '46', uk: '11.5', cm: '30' },
        { us: '13', eu: '47.5', uk: '12.5', cm: '31' },
      ]
    },
    women: {
      title: "Women's Sizes",
      sizes: [
        { us: '5', eu: '35.5', uk: '2.5', cm: '22' },
        { us: '5.5', eu: '36', uk: '3', cm: '22.5' },
        { us: '6', eu: '36.5', uk: '3.5', cm: '23' },
        { us: '6.5', eu: '37.5', uk: '4', cm: '23.5' },
        { us: '7', eu: '38', uk: '4.5', cm: '24' },
        { us: '7.5', eu: '38.5', uk: '5', cm: '24.5' },
        { us: '8', eu: '39', uk: '5.5', cm: '25' },
        { us: '8.5', eu: '40', uk: '6', cm: '25.5' },
        { us: '9', eu: '40.5', uk: '6.5', cm: '26' },
        { us: '9.5', eu: '41', uk: '7', cm: '26.5' },
        { us: '10', eu: '42', uk: '7.5', cm: '27' },
        { us: '10.5', eu: '42.5', uk: '8', cm: '27.5' },
        { us: '11', eu: '43', uk: '8.5', cm: '28' },
      ]
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <Ruler className="w-12 h-12 text-black" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Size Guide</h1>
          <p className="text-lg text-gray-600">
            Find your perfect fit with our comprehensive size chart
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-1">How to Measure</h3>
                <ol className="text-sm text-blue-800 space-y-1">
                  <li>1. Place your foot on a piece of paper</li>
                  <li>2. Mark the tip of your longest toe and the back of your heel</li>
                  <li>3. Measure the distance between the marks in centimeters</li>
                  <li>4. Use the chart below to find your size</li>
                </ol>
              </div>
            </div>
          </div>

          {Object.entries(sizeCharts).map(([key, chart]) => (
            <div key={key} className="mb-8">
              <h2 className="text-2xl font-bold mb-4">{chart.title}</h2>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 px-4 py-2 text-left">US</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">EU</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">UK</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">CM</th>
                    </tr>
                  </thead>
                  <tbody>
                    {chart.sizes.map((size, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-4 py-2 font-medium">{size.us}</td>
                        <td className="border border-gray-300 px-4 py-2">{size.eu}</td>
                        <td className="border border-gray-300 px-4 py-2">{size.uk}</td>
                        <td className="border border-gray-300 px-4 py-2">{size.cm}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}

          <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-amber-900 mb-1">Important Notes</h3>
                <ul className="text-sm text-amber-800 space-y-1">
                  <li>• Sizes may vary between different brands and models</li>
                  <li>• If you're between sizes, we recommend sizing up</li>
                  <li>• For wide feet, consider going half a size up</li>
                  <li>• All our sneakers come with detailed sizing information</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-xl font-bold mb-4">Brand-Specific Sizing</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-4 border border-gray-200 rounded-lg">
                <h4 className="font-semibold mb-2">Nike / Jordan</h4>
                <p className="text-sm text-gray-600">
                  Generally true to size. Air Jordan 1s tend to run slightly large,
                  while Air Max models run small.
                </p>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg">
                <h4 className="font-semibold mb-2">Adidas / Yeezy</h4>
                <p className="text-sm text-gray-600">
                  Adidas runs large. Yeezy 350 V2s run small - go half size up.
                  Yeezy 700s are true to size.
                </p>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg">
                <h4 className="font-semibold mb-2">New Balance</h4>
                <p className="text-sm text-gray-600">
                  Generally true to size with a wider fit. Made in USA/UK models
                  may run slightly larger.
                </p>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg">
                <h4 className="font-semibold mb-2">Balenciaga</h4>
                <p className="text-sm text-gray-600">
                  Runs small. We recommend going one full size up for Triple S
                  and Speed Trainer models.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <p className="text-gray-600 mb-4">
            Still unsure about your size? Our customer service team is here to help!
          </p>
          <a
            href="/contact"
            className="inline-block bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Contact Us
          </a>
        </div>
      </div>
    </div>
  );
}