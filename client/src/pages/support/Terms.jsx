import React from 'react';

export default function Terms() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Terms & Conditions</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
        <section>
          <h2 className="text-xl font-semibold mb-4">1. Acceptance of Terms</h2>
          <p className="text-gray-600">
            By accessing and using TastyTable's food delivery service, you agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our service.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">2. Service Description</h2>
          <p className="text-gray-600">
            TastyTable provides a platform for ordering food from various restaurants. We act as an intermediary between customers and restaurants, facilitating the ordering and delivery process.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">3. User Accounts</h2>
          <div className="space-y-4">
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>You must be at least 18 years old to create an account</li>
              <li>You are responsible for maintaining the confidentiality of your account</li>
              <li>You must provide accurate and complete information</li>
              <li>You are responsible for all activities under your account</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">4. Ordering and Payment</h2>
          <div className="space-y-4">
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>All prices are in Indian Rupees (INR)</li>
              <li>Payment must be made at the time of ordering</li>
              <li>We accept various payment methods as listed on our platform</li>
              <li>Restaurants may have minimum order requirements</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">5. Delivery</h2>
          <div className="space-y-4">
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Delivery times are estimates and not guaranteed</li>
              <li>Delivery fees may apply</li>
              <li>We are not responsible for delays beyond our control</li>
              <li>You must provide accurate delivery information</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">6. Cancellations and Refunds</h2>
          <div className="space-y-4">
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Orders can be cancelled within 5 minutes of placement</li>
              <li>Refunds are processed according to our Refund Policy</li>
              <li>Restaurants may have their own cancellation policies</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">7. Intellectual Property</h2>
          <p className="text-gray-600">
            All content on the TastyTable platform, including logos, text, and images, is the property of TastyTable and is protected by intellectual property laws.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">8. Limitation of Liability</h2>
          <p className="text-gray-600">
            TastyTable is not liable for any indirect, incidental, or consequential damages arising from the use of our service. Our liability is limited to the amount paid for the specific order in question.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">9. Changes to Terms</h2>
          <p className="text-gray-600">
            We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting to our platform. Your continued use of the service constitutes acceptance of the modified terms.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">10. Contact Information</h2>
          <p className="text-gray-600">
            For any questions regarding these Terms & Conditions, please contact us at legal@tastytable.com
          </p>
        </section>
      </div>
    </div>
  );
} 