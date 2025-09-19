import { Shield } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          <div className="flex items-center gap-4 mb-8">
            <Shield className="w-10 h-10 text-black" />
            <h1 className="text-4xl font-bold">Privacy Policy</h1>
          </div>

          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 text-lg mb-8">
              Last updated: {new Date().toLocaleDateString()}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">1. Introduction</h2>
              <p>
                Li-Lo ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">2. Information We Collect</h2>
              <h3 className="text-xl font-semibold mb-2">Personal Information</h3>
              <ul className="list-disc pl-6 mb-4">
                <li>Name and surname</li>
                <li>Email address</li>
                <li>Postal address</li>
                <li>Phone number</li>
                <li>Payment information</li>
                <li>Date of birth</li>
                <li>Purchase history</li>
              </ul>

              <h3 className="text-xl font-semibold mb-2">Automatically Collected Information</h3>
              <ul className="list-disc pl-6">
                <li>IP address</li>
                <li>Browser type and version</li>
                <li>Device information</li>
                <li>Cookies and similar technologies</li>
                <li>Pages visited and time spent</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">3. Legal Basis for Processing (GDPR)</h2>
              <p>We process your personal data based on the following legal grounds:</p>
              <ul className="list-disc pl-6">
                <li><strong>Contract:</strong> Processing necessary for the performance of a contract</li>
                <li><strong>Consent:</strong> You have given clear consent for processing</li>
                <li><strong>Legitimate interests:</strong> Processing necessary for our legitimate interests</li>
                <li><strong>Legal obligation:</strong> Processing necessary to comply with the law</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">4. How We Use Your Information</h2>
              <ul className="list-disc pl-6">
                <li>Process and fulfill your orders</li>
                <li>Send order confirmations and shipping updates</li>
                <li>Respond to customer service requests</li>
                <li>Send marketing communications (with consent)</li>
                <li>Improve our website and services</li>
                <li>Prevent fraud and enhance security</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">5. Data Sharing and Disclosure</h2>
              <p>We may share your information with:</p>
              <ul className="list-disc pl-6">
                <li>Payment processors for transaction processing</li>
                <li>Shipping partners for order delivery</li>
                <li>Marketing service providers (with consent)</li>
                <li>Legal authorities when required by law</li>
              </ul>
              <p className="mt-4">We do not sell your personal information to third parties.</p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">6. Your Rights (GDPR)</h2>
              <p>Under the General Data Protection Regulation, you have the following rights:</p>
              <ul className="list-disc pl-6">
                <li><strong>Right of access:</strong> Request copies of your personal data</li>
                <li><strong>Right to rectification:</strong> Request correction of inaccurate data</li>
                <li><strong>Right to erasure:</strong> Request deletion of your data</li>
                <li><strong>Right to restrict processing:</strong> Request restriction of data processing</li>
                <li><strong>Right to data portability:</strong> Request transfer of your data</li>
                <li><strong>Right to object:</strong> Object to data processing</li>
                <li><strong>Rights related to automated decision-making:</strong> Not be subject to automated decisions</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">7. Data Retention</h2>
              <p>
                We retain your personal data only for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required by law. Typically:
              </p>
              <ul className="list-disc pl-6">
                <li>Order data: 7 years for tax purposes</li>
                <li>Account information: Until account deletion</li>
                <li>Marketing data: Until consent withdrawal</li>
                <li>Cookie data: According to cookie policy</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">8. Data Security</h2>
              <p>
                We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction. These measures include:
              </p>
              <ul className="list-disc pl-6">
                <li>SSL/TLS encryption for data transmission</li>
                <li>Secure data storage with encryption at rest</li>
                <li>Regular security assessments</li>
                <li>Limited access to personal data</li>
                <li>Employee training on data protection</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">9. International Data Transfers</h2>
              <p>
                Your information may be transferred to and processed in countries other than your country of residence. We ensure appropriate safeguards are in place through:
              </p>
              <ul className="list-disc pl-6">
                <li>Standard contractual clauses approved by the European Commission</li>
                <li>Adequacy decisions by the European Commission</li>
                <li>Your explicit consent where required</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">10. Children's Privacy</h2>
              <p>
                Our services are not directed to individuals under 16 years of age. We do not knowingly collect personal information from children under 16.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">11. Cookie Policy</h2>
              <p>
                We use cookies and similar tracking technologies to enhance your experience. For detailed information, please see our <a href="/cookie-policy" className="text-black underline">Cookie Policy</a>.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">12. Contact Information</h2>
              <p>For privacy-related questions or to exercise your rights, contact us at:</p>
              <div className="bg-gray-50 p-4 rounded-lg mt-4">
                <p><strong>Li-Lo Privacy Team</strong></p>
                <p>Email: privacy@li-lo.com</p>
                <p>Address: 123 Fashion Street, Paris 75001, France</p>
                <p>Phone: +33 1 23 45 67 89</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">13. Data Protection Officer</h2>
              <p>
                Our Data Protection Officer can be contacted at: dpo@li-lo.com
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">14. Complaints</h2>
              <p>
                If you believe we have not addressed your concerns adequately, you have the right to lodge a complaint with your local data protection authority. In France, this is the CNIL (Commission Nationale de l'Informatique et des Libertés).
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">15. Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}