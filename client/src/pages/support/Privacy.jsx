import React from 'react';

export default function Privacy() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
        <section>
          <h2 className="text-xl font-semibold mb-4">1. Introduction</h2>
          <p className="text-gray-600">
            At TastyTable, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our food delivery service.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">2. Information We Collect</h2>
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">Personal Information</h3>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Name and contact information</li>
              <li>Delivery address</li>
              <li>Payment information</li>
              <li>Order history</li>
              <li>Preferences and dietary restrictions</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">3. How We Use Your Information</h2>
          <div className="space-y-4">
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Process and deliver your orders</li>
              <li>Provide customer support</li>
              <li>Send order updates and notifications</li>
              <li>Improve our services</li>
              <li>Send promotional offers (with your consent)</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">4. Data Security</h2>
          <p className="text-gray-600">
            We implement appropriate security measures to protect your personal information. This includes encryption, secure servers, and regular security assessments.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">5. Third-Party Services</h2>
          <p className="text-gray-600">
            We may share your information with third-party service providers who assist us in operating our service, such as payment processors and delivery partners. These providers are required to maintain the confidentiality of your information.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">6. Your Rights</h2>
          <div className="space-y-4">
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Access your personal information</li>
              <li>Correct inaccurate information</li>
              <li>Request deletion of your data</li>
              <li>Opt-out of marketing communications</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">7. Contact Us</h2>
          <p className="text-gray-600">
            If you have any questions about this Privacy Policy, please contact us at privacy@tastytable.com
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">8. Updates to This Policy</h2>
          <p className="text-gray-600">
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
          </p>
        </section>
      </div>
    </div>
  );
} 