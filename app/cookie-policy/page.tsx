import { Cookie } from 'lucide-react';

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          <div className="flex items-center gap-4 mb-8">
            <Cookie className="w-10 h-10 text-amber-500" />
            <h1 className="text-4xl font-bold">Cookie Policy</h1>
          </div>

          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 text-lg mb-8">
              Last updated: {new Date().toLocaleDateString()}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">1. What Are Cookies?</h2>
              <p>
                Cookies are small text files that are placed on your device when you visit our website. They help us provide you with a better experience by remembering your preferences and understanding how you use our site.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">2. How We Use Cookies</h2>
              <p>We use cookies for the following purposes:</p>
              <ul className="list-disc pl-6">
                <li><strong>Essential Operations:</strong> To enable core functionality of our website</li>
                <li><strong>Performance & Analytics:</strong> To understand how visitors interact with our website</li>
                <li><strong>Functionality:</strong> To remember your preferences and settings</li>
                <li><strong>Marketing:</strong> To deliver relevant advertisements and measure their effectiveness</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">3. Types of Cookies We Use</h2>

              <h3 className="text-xl font-semibold mb-2 mt-6">Strictly Necessary Cookies</h3>
              <p>These cookies are essential for the website to function properly. They cannot be disabled.</p>
              <div className="bg-gray-50 p-4 rounded-lg mt-2">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Cookie Name</th>
                      <th className="text-left py-2">Purpose</th>
                      <th className="text-left py-2">Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-2">session_id</td>
                      <td className="py-2">Maintains user session</td>
                      <td className="py-2">Session</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">csrf_token</td>
                      <td className="py-2">Security protection</td>
                      <td className="py-2">Session</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">cookieConsent</td>
                      <td className="py-2">Stores cookie preferences</td>
                      <td className="py-2">1 year</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3 className="text-xl font-semibold mb-2 mt-6">Analytics Cookies</h3>
              <p>These cookies help us understand how visitors interact with our website.</p>
              <div className="bg-gray-50 p-4 rounded-lg mt-2">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Cookie Name</th>
                      <th className="text-left py-2">Provider</th>
                      <th className="text-left py-2">Purpose</th>
                      <th className="text-left py-2">Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-2">_ga</td>
                      <td className="py-2">Google Analytics</td>
                      <td className="py-2">Distinguishes users</td>
                      <td className="py-2">2 years</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">_gid</td>
                      <td className="py-2">Google Analytics</td>
                      <td className="py-2">Distinguishes users</td>
                      <td className="py-2">24 hours</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">_gat</td>
                      <td className="py-2">Google Analytics</td>
                      <td className="py-2">Throttles request rate</td>
                      <td className="py-2">1 minute</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3 className="text-xl font-semibold mb-2 mt-6">Marketing Cookies</h3>
              <p>These cookies track your visit across websites to deliver relevant advertisements.</p>
              <div className="bg-gray-50 p-4 rounded-lg mt-2">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Cookie Name</th>
                      <th className="text-left py-2">Provider</th>
                      <th className="text-left py-2">Purpose</th>
                      <th className="text-left py-2">Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-2">_fbp</td>
                      <td className="py-2">Facebook</td>
                      <td className="py-2">Advertising targeting</td>
                      <td className="py-2">3 months</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">ads/ga-audiences</td>
                      <td className="py-2">Google Ads</td>
                      <td className="py-2">Remarketing</td>
                      <td className="py-2">Session</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3 className="text-xl font-semibold mb-2 mt-6">Preference Cookies</h3>
              <p>These cookies remember your settings and preferences.</p>
              <div className="bg-gray-50 p-4 rounded-lg mt-2">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Cookie Name</th>
                      <th className="text-left py-2">Purpose</th>
                      <th className="text-left py-2">Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-2">language</td>
                      <td className="py-2">Stores language preference</td>
                      <td className="py-2">1 year</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">currency</td>
                      <td className="py-2">Stores currency preference</td>
                      <td className="py-2">1 year</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">theme</td>
                      <td className="py-2">Stores theme preference</td>
                      <td className="py-2">1 year</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">4. Third-Party Cookies</h2>
              <p>
                Some cookies are placed by third-party services that appear on our pages. We do not control these cookies. Third-party providers include:
              </p>
              <ul className="list-disc pl-6">
                <li><strong>Google Analytics:</strong> For website analytics</li>
                <li><strong>Facebook Pixel:</strong> For advertising and analytics</li>
                <li><strong>YouTube:</strong> For embedded videos</li>
                <li><strong>Stripe:</strong> For payment processing</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">5. Managing Your Cookie Preferences</h2>
              <h3 className="text-xl font-semibold mb-2">Through Our Cookie Banner</h3>
              <p>
                When you first visit our website, you'll see a cookie banner that allows you to accept or reject different categories of cookies. You can change your preferences at any time by clicking the "Cookie Settings" link in the footer of our website.
              </p>

              <h3 className="text-xl font-semibold mb-2 mt-4">Through Your Browser</h3>
              <p>
                Most web browsers allow you to control cookies through their settings. Here's how to manage cookies in popular browsers:
              </p>
              <ul className="list-disc pl-6">
                <li><a href="https://support.google.com/chrome/answer/95647" className="text-black underline">Google Chrome</a></li>
                <li><a href="https://support.mozilla.org/en-US/kb/enable-and-disable-cookies-website-preferences" className="text-black underline">Mozilla Firefox</a></li>
                <li><a href="https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac" className="text-black underline">Safari</a></li>
                <li><a href="https://support.microsoft.com/en-us/windows/manage-cookies-in-microsoft-edge" className="text-black underline">Microsoft Edge</a></li>
              </ul>

              <h3 className="text-xl font-semibold mb-2 mt-4">Opt-Out Links</h3>
              <p>You can opt out of specific third-party cookies:</p>
              <ul className="list-disc pl-6">
                <li><a href="https://tools.google.com/dlpage/gaoptout" className="text-black underline">Google Analytics Opt-out</a></li>
                <li><a href="https://www.facebook.com/help/568137493302217" className="text-black underline">Facebook Ads Preferences</a></li>
                <li><a href="https://www.youronlinechoices.com/" className="text-black underline">Your Online Choices (EU)</a></li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">6. Impact of Disabling Cookies</h2>
              <p>
                If you choose to disable cookies, please note that some features of our website may not function properly:
              </p>
              <ul className="list-disc pl-6">
                <li>You may not be able to log in to your account</li>
                <li>Your shopping cart may not persist between sessions</li>
                <li>Personalized recommendations may not be available</li>
                <li>Some interactive features may be limited</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">7. Cookie Retention Periods</h2>
              <p>
                Cookies are retained for different periods depending on their purpose:
              </p>
              <ul className="list-disc pl-6">
                <li><strong>Session cookies:</strong> Deleted when you close your browser</li>
                <li><strong>Persistent cookies:</strong> Remain for a set period (see tables above)</li>
                <li><strong>Third-party cookies:</strong> Controlled by the third-party provider</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">8. Updates to This Policy</h2>
              <p>
                We may update this Cookie Policy from time to time to reflect changes in our practices or for legal, technical, or regulatory reasons. We will notify you of any significant changes by posting a notice on our website or by sending you an email.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">9. Contact Us</h2>
              <p>
                If you have any questions about our use of cookies or this Cookie Policy, please contact us:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg mt-4">
                <p><strong>Li-Lo Privacy Team</strong></p>
                <p>Email: privacy@li-lo.com</p>
                <p>Phone: +33 1 23 45 67 89</p>
                <p>Address: 123 Fashion Street, Paris 75001, France</p>
                <p>Data Protection Officer: dpo@li-lo.com</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">10. More Information</h2>
              <p>
                For more information about cookies and online privacy:
              </p>
              <ul className="list-disc pl-6">
                <li><a href="https://www.cnil.fr/en/cookies" className="text-black underline">CNIL Cookie Guidelines</a></li>
                <li><a href="https://www.allaboutcookies.org/" className="text-black underline">All About Cookies</a></li>
                <li><a href="https://ico.org.uk/for-the-public/online/cookies/" className="text-black underline">ICO Cookie Guide</a></li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}