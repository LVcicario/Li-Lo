import { Shield, CheckCircle, Search, Fingerprint, Award, AlertTriangle } from 'lucide-react';

export default function AuthenticityPage() {
  const verificationSteps = [
    {
      icon: Search,
      title: 'Expert Inspection',
      description: 'Every sneaker undergoes a comprehensive 100-point inspection by our certified authenticators',
    },
    {
      icon: Fingerprint,
      title: 'Advanced Technology',
      description: 'We use cutting-edge technology including UV light, microscopic analysis, and material testing',
    },
    {
      icon: Shield,
      title: 'Multi-Layer Verification',
      description: 'Cross-referencing with manufacturer databases and proprietary authentication systems',
    },
    {
      icon: Award,
      title: 'Certificate of Authenticity',
      description: 'Each verified item comes with a unique certificate and authentication tag',
    },
  ];

  const authenticationPoints = [
    'Box label and production dates',
    'Material quality and stitching',
    'Logo placement and embossing',
    'Colorway accuracy',
    'Insole and outsole patterns',
    'Size tag and internal labels',
    'Lace quality and aglets',
    'Smell and material composition',
    'Weight and dimensions',
    'UV reactive elements',
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <Shield className="w-12 h-12 text-black" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Authenticity Guarantee</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Every sneaker sold on Li-Lo is 100% authentic. We stake our reputation on it.
          </p>
        </div>

        <div className="bg-gradient-to-r from-black to-gray-800 text-white rounded-2xl p-8 mb-12">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Our Promise</h2>
            <p className="text-lg mb-6">
              We guarantee the authenticity of every item we sell. If any item purchased from Li-Lo
              is found to be counterfeit, we will provide a full refund plus an additional 10% compensation.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span>100% Authentic</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span>Money Back Guarantee</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span>Lifetime Support</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold text-center mb-8">Our Verification Process</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {verificationSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="bg-white rounded-xl shadow-sm p-6">
                  <Icon className="w-10 h-10 text-black mb-4" />
                  <h3 className="font-bold text-lg mb-2">{step.title}</h3>
                  <p className="text-gray-600 text-sm">{step.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold mb-6">100-Point Inspection Checklist</h2>
          <p className="text-gray-600 mb-6">
            Our expert authenticators examine every detail of each sneaker. Here are some of the key points we check:
          </p>

          <div className="grid md:grid-cols-2 gap-4 mb-8">
            {authenticationPoints.map((point, index) => (
              <div key={index} className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                <span className="text-gray-700">{point}</span>
              </div>
            ))}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-bold text-blue-900 mb-3">Industry-Leading Standards</h3>
            <p className="text-blue-800">
              Our authentication team consists of experts with over 50+ years of combined experience.
              We continuously update our processes to stay ahead of counterfeiters and ensure
              the highest level of accuracy.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-xl font-bold mb-4">Authentication Partners</h3>
            <p className="text-gray-600 mb-4">
              We work with industry-leading authentication services:
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <Shield className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="font-semibold">StockX Authentication</p>
                  <p className="text-sm text-gray-600">Cross-verification for high-value items</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <Shield className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="font-semibold">Legitmark Technology</p>
                  <p className="text-sm text-gray-600">AI-powered image recognition</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <Shield className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="font-semibold">Entrupy Certification</p>
                  <p className="text-sm text-gray-600">Microscopic material analysis</p>
                </div>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-xl font-bold mb-4">Your Protection</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-semibold">Lifetime Authenticity Guarantee</p>
                  <p className="text-sm text-gray-600">Valid for as long as you own the item</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-semibold">Free Re-Authentication</p>
                  <p className="text-sm text-gray-600">If you ever have doubts, we'll verify again</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-semibold">Authentication Certificate</p>
                  <p className="text-sm text-gray-600">Digital and physical certificates provided</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-semibold">Resale Support</p>
                  <p className="text-sm text-gray-600">Authentication transfers to new owners</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-12">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-amber-600 mt-1" />
            <div>
              <h3 className="font-bold text-lg mb-2 text-amber-900">Report Suspicious Items</h3>
              <p className="text-amber-800 mb-3">
                If you ever receive an item that you believe may not be authentic, please contact us immediately.
                Our team will investigate and resolve the issue within 24 hours.
              </p>
              <a
                href="/contact"
                className="inline-block bg-amber-600 text-white px-6 py-2 rounded-lg hover:bg-amber-700 transition-colors"
              >
                Report an Issue
              </a>
            </div>
          </div>
        </div>

        <div className="text-center">
          <div className="inline-flex items-center gap-3 mb-4">
            <Award className="w-8 h-8 text-yellow-500" />
            <span className="text-2xl font-bold">Trusted by 100,000+ Collectors Worldwide</span>
          </div>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust Li-Lo for authentic luxury sneakers.
            Our commitment to authenticity is unwavering.
          </p>
          <a
            href="/sneakers"
            className="inline-block bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Shop with Confidence
          </a>
        </div>
      </div>
    </div>
  );
}