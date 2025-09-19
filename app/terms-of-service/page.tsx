import { FileText } from 'lucide-react';

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          <div className="flex items-center gap-4 mb-8">
            <FileText className="w-10 h-10 text-black" />
            <h1 className="text-4xl font-bold">Terms of Service</h1>
          </div>

          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 text-lg mb-8">
              Effective Date: {new Date().toLocaleDateString()}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">1. Acceptance of Terms</h2>
              <p>
                By accessing and using the Li-Lo website and services, you accept and agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using this site.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">2. Use of Website</h2>
              <h3 className="text-xl font-semibold mb-2">Eligibility</h3>
              <p>You must be at least 16 years old to use our services. By using our services, you represent that you are at least 16 years old.</p>

              <h3 className="text-xl font-semibold mb-2 mt-4">Account Registration</h3>
              <ul className="list-disc pl-6">
                <li>You must provide accurate and complete information</li>
                <li>You are responsible for maintaining account security</li>
                <li>You must notify us immediately of any unauthorized use</li>
                <li>One person may not have multiple accounts</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">3. Products and Purchases</h2>
              <h3 className="text-xl font-semibold mb-2">Product Information</h3>
              <p>We strive to provide accurate product descriptions and images. However, we do not warrant that product descriptions or other content is accurate, complete, reliable, current, or error-free.</p>

              <h3 className="text-xl font-semibold mb-2 mt-4">Pricing</h3>
              <ul className="list-disc pl-6">
                <li>All prices are in EUR unless otherwise stated</li>
                <li>Prices include applicable VAT</li>
                <li>We reserve the right to change prices at any time</li>
                <li>Price changes will not affect orders already placed</li>
              </ul>

              <h3 className="text-xl font-semibold mb-2 mt-4">Order Acceptance</h3>
              <p>Your order constitutes an offer to purchase. We reserve the right to refuse any order for any reason, including:</p>
              <ul className="list-disc pl-6">
                <li>Product availability</li>
                <li>Errors in product or pricing information</li>
                <li>Suspicion of fraudulent activity</li>
                <li>Violation of our terms</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">4. Payment Terms</h2>
              <ul className="list-disc pl-6">
                <li>Payment is due at the time of order</li>
                <li>We accept major credit cards, PayPal, and other specified payment methods</li>
                <li>You agree to pay all charges incurred by you or on your behalf</li>
                <li>All payments are processed securely through our payment partners</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">5. Shipping and Delivery</h2>
              <h3 className="text-xl font-semibold mb-2">Shipping</h3>
              <ul className="list-disc pl-6">
                <li>Shipping times are estimates only</li>
                <li>We are not responsible for delays outside our control</li>
                <li>Risk of loss passes to you upon delivery</li>
              </ul>

              <h3 className="text-xl font-semibold mb-2 mt-4">International Shipping</h3>
              <p>For international orders:</p>
              <ul className="list-disc pl-6">
                <li>You are responsible for customs duties and taxes</li>
                <li>You must comply with all import regulations</li>
                <li>We are not responsible for customs delays</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">6. Returns and Refunds</h2>
              <h3 className="text-xl font-semibold mb-2">Return Policy</h3>
              <p>In accordance with EU consumer law:</p>
              <ul className="list-disc pl-6">
                <li>You have 14 days to withdraw from your purchase</li>
                <li>Items must be returned in original condition</li>
                <li>You are responsible for return shipping costs</li>
                <li>Refunds will be processed within 14 days of receiving the return</li>
              </ul>

              <h3 className="text-xl font-semibold mb-2 mt-4">Non-Returnable Items</h3>
              <ul className="list-disc pl-6">
                <li>Customized or personalized products</li>
                <li>Items marked as final sale</li>
                <li>Items damaged due to misuse</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">7. Intellectual Property</h2>
              <p>All content on this website, including but not limited to:</p>
              <ul className="list-disc pl-6">
                <li>Text, graphics, logos, images</li>
                <li>Product descriptions and photographs</li>
                <li>Software and code</li>
                <li>Trademarks and service marks</li>
              </ul>
              <p className="mt-4">
                Is the property of Li-Lo or its licensors and is protected by intellectual property laws. You may not use, reproduce, or distribute any content without our express written permission.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">8. User Content</h2>
              <h3 className="text-xl font-semibold mb-2">Reviews and Comments</h3>
              <p>By posting content on our website, you:</p>
              <ul className="list-disc pl-6">
                <li>Grant us a non-exclusive, royalty-free, perpetual license to use your content</li>
                <li>Represent that you own or have rights to the content</li>
                <li>Agree that your content does not violate any laws or rights</li>
              </ul>

              <h3 className="text-xl font-semibold mb-2 mt-4">Prohibited Content</h3>
              <p>You may not post content that:</p>
              <ul className="list-disc pl-6">
                <li>Is false, misleading, or fraudulent</li>
                <li>Is defamatory, obscene, or offensive</li>
                <li>Violates any law or regulation</li>
                <li>Infringes on intellectual property rights</li>
                <li>Contains viruses or malicious code</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">9. Privacy and Data Protection</h2>
              <p>
                Your use of our services is also governed by our <a href="/privacy-policy" className="text-black underline">Privacy Policy</a>, which is incorporated into these terms by reference.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">10. Disclaimer of Warranties</h2>
              <p>
                Our services are provided "as is" and "as available" without any warranties of any kind, either express or implied, including but not limited to:
              </p>
              <ul className="list-disc pl-6">
                <li>Merchantability</li>
                <li>Fitness for a particular purpose</li>
                <li>Non-infringement</li>
                <li>Accuracy or reliability of information</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">11. Limitation of Liability</h2>
              <p>
                To the fullest extent permitted by law, Li-Lo shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to:
              </p>
              <ul className="list-disc pl-6">
                <li>Loss of profits or revenue</li>
                <li>Loss of data</li>
                <li>Loss of use</li>
                <li>Cost of replacement goods</li>
              </ul>
              <p className="mt-4">
                Our total liability shall not exceed the amount paid by you for the products giving rise to the claim.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">12. Indemnification</h2>
              <p>
                You agree to indemnify, defend, and hold harmless Li-Lo and its officers, directors, employees, and agents from any claims, damages, losses, liabilities, and expenses arising from:
              </p>
              <ul className="list-disc pl-6">
                <li>Your use of our services</li>
                <li>Your violation of these terms</li>
                <li>Your violation of any third-party rights</li>
                <li>Your user content</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">13. Governing Law and Jurisdiction</h2>
              <p>
                These Terms of Service are governed by the laws of France and the European Union. Any disputes shall be subject to the exclusive jurisdiction of the courts of Paris, France.
              </p>
              <p className="mt-4">
                As a consumer, you may also bring proceedings in the courts of your country of residence.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">14. Dispute Resolution</h2>
              <p>
                In accordance with EU regulations, we provide access to the Online Dispute Resolution platform: <a href="https://ec.europa.eu/consumers/odr" className="text-black underline">https://ec.europa.eu/consumers/odr</a>
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">15. Severability</h2>
              <p>
                If any provision of these terms is found to be unenforceable or invalid, that provision shall be limited or eliminated to the minimum extent necessary, and the remaining provisions shall remain in full force and effect.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">16. Modifications</h2>
              <p>
                We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting. Your continued use of our services constitutes acceptance of the modified terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">17. Contact Information</h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p><strong>Li-Lo SAS</strong></p>
                <p>123 Fashion Street</p>
                <p>75001 Paris, France</p>
                <p>Email: legal@li-lo.com</p>
                <p>Phone: +33 1 23 45 67 89</p>
                <p>Company Registration: RCS Paris 123 456 789</p>
                <p>VAT Number: FR12345678901</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}