import { Scale } from 'lucide-react';

export default function LegalNoticePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          <div className="flex items-center gap-4 mb-8">
            <Scale className="w-10 h-10 text-black" />
            <h1 className="text-4xl font-bold">Legal Notice</h1>
          </div>

          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">1. Company Information</h2>
              <div className="bg-gray-50 p-6 rounded-lg">
                <p><strong>Company Name:</strong> Li-Lo SAS</p>
                <p><strong>Legal Form:</strong> Société par Actions Simplifiée (SAS)</p>
                <p><strong>Registered Capital:</strong> €100,000</p>
                <p><strong>Headquarters:</strong> 123 Fashion Street, 75001 Paris, France</p>
                <p><strong>Company Registration Number:</strong> RCS Paris 123 456 789</p>
                <p><strong>VAT Number:</strong> FR12345678901</p>
                <p><strong>SIRET:</strong> 123 456 789 00012</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">2. Contact Information</h2>
              <div className="bg-gray-50 p-6 rounded-lg">
                <p><strong>General Inquiries:</strong> contact@li-lo.com</p>
                <p><strong>Customer Service:</strong> support@li-lo.com</p>
                <p><strong>Legal Department:</strong> legal@li-lo.com</p>
                <p><strong>Phone:</strong> +33 1 23 45 67 89</p>
                <p><strong>Fax:</strong> +33 1 23 45 67 90</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">3. Management</h2>
              <div className="bg-gray-50 p-6 rounded-lg">
                <p><strong>President:</strong> Jean-Pierre Dubois</p>
                <p><strong>Managing Director:</strong> Marie Laurent</p>
                <p><strong>Publication Director:</strong> Pierre Martin</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">4. Website Hosting</h2>
              <div className="bg-gray-50 p-6 rounded-lg">
                <p><strong>Host:</strong> Vercel Inc.</p>
                <p><strong>Address:</strong> 440 N Barranca Ave #4133, Covina, CA 91723, USA</p>
                <p><strong>Website:</strong> vercel.com</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">5. Intellectual Property</h2>
              <p>
                The entire content of this website, including but not limited to text, images, graphics, logos, button icons, software, and data compilations, is the exclusive property of Li-Lo SAS or its content suppliers and is protected by French and international copyright and intellectual property laws.
              </p>
              <p className="mt-4">
                The Li-Lo trademark and logo are registered trademarks of Li-Lo SAS. Any unauthorized use of these trademarks is strictly prohibited and may result in legal action.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">6. Data Protection Officer</h2>
              <div className="bg-gray-50 p-6 rounded-lg">
                <p><strong>DPO Name:</strong> Sophie Moreau</p>
                <p><strong>Email:</strong> dpo@li-lo.com</p>
                <p><strong>Phone:</strong> +33 1 23 45 67 91</p>
                <p><strong>Address:</strong> 123 Fashion Street, 75001 Paris, France</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">7. Regulatory Authorities</h2>
              <h3 className="text-xl font-semibold mb-2">Data Protection Authority</h3>
              <div className="bg-gray-50 p-6 rounded-lg mb-4">
                <p><strong>Authority:</strong> Commission Nationale de l'Informatique et des Libertés (CNIL)</p>
                <p><strong>Address:</strong> 3 Place de Fontenoy, 75007 Paris, France</p>
                <p><strong>Website:</strong> www.cnil.fr</p>
              </div>

              <h3 className="text-xl font-semibold mb-2">Consumer Protection</h3>
              <div className="bg-gray-50 p-6 rounded-lg">
                <p><strong>Authority:</strong> Direction Générale de la Concurrence, de la Consommation et de la Répression des Fraudes (DGCCRF)</p>
                <p><strong>Website:</strong> www.economie.gouv.fr/dgccrf</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">8. Dispute Resolution</h2>
              <p>
                In accordance with Articles L.616-1 and R.616-1 of the French Consumer Code, we provide a mediation service for the resolution of disputes.
              </p>
              <div className="bg-gray-50 p-6 rounded-lg mt-4">
                <p><strong>Mediator:</strong> Centre de Médiation et d'Arbitrage de Paris (CMAP)</p>
                <p><strong>Address:</strong> 39 avenue Franklin D. Roosevelt, 75008 Paris</p>
                <p><strong>Website:</strong> www.cmap.fr</p>
                <p><strong>EU ODR Platform:</strong> <a href="https://ec.europa.eu/consumers/odr" className="text-black underline">ec.europa.eu/consumers/odr</a></p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">9. Professional Liability Insurance</h2>
              <div className="bg-gray-50 p-6 rounded-lg">
                <p><strong>Insurer:</strong> AXA France IARD</p>
                <p><strong>Policy Number:</strong> FR789012345</p>
                <p><strong>Address:</strong> 313, Terrasses de l'Arche, 92727 Nanterre Cedex</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">10. Terms and Conditions</h2>
              <p>
                The use of this website is subject to our <a href="/terms-of-service" className="text-black underline">Terms of Service</a> and <a href="/privacy-policy" className="text-black underline">Privacy Policy</a>. By using this website, you accept these terms in full.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">11. Accessibility</h2>
              <p>
                Li-Lo is committed to making its website accessible to all users, including those with disabilities. We strive to comply with the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA standards.
              </p>
              <p className="mt-4">
                If you encounter any accessibility issues, please contact us at: accessibility@li-lo.com
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">12. Cookies</h2>
              <p>
                This website uses cookies to improve user experience and analyze traffic. For more information, please refer to our <a href="/cookie-policy" className="text-black underline">Cookie Policy</a>.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">13. Applicable Law</h2>
              <p>
                This legal notice is governed by French law. Any disputes arising from the use of this website shall be subject to the exclusive jurisdiction of the French courts, specifically the courts of Paris.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">14. Credits</h2>
              <div className="bg-gray-50 p-6 rounded-lg">
                <p><strong>Website Design & Development:</strong> Li-Lo Digital Team</p>
                <p><strong>Photography:</strong> Various Artists (Licensed)</p>
                <p><strong>Legal Advisor:</strong> Cabinet d'Avocats Dupont & Associés</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">15. Last Updated</h2>
              <p>
                This legal notice was last updated on {new Date().toLocaleDateString()}. We reserve the right to modify this legal notice at any time.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}