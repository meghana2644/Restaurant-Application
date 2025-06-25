import React from 'react';

export default function Refund() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Refund Policy</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
        <section>
          <h2 className="text-xl font-semibold mb-4">1. Overview</h2>
          <p className="text-gray-600">
            At TastyTable, we strive to ensure complete customer satisfaction. This Refund Policy outlines the circumstances under which refunds may be issued and the process for requesting them.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">2. Eligibility for Refunds</h2>
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">You may be eligible for a refund if:</h3>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Your order was cancelled within 5 minutes of placement</li>
              <li>Your order was not delivered</li>
              <li>Your order was significantly different from what was ordered</li>
              <li>Your order was delivered in an unsatisfactory condition</li>
              <li>There was an error in the billing amount</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">3. Refund Process</h2>
          <div className="space-y-4">
            <ol className="list-decimal pl-6 text-gray-600 space-y-2">
              <li>Contact our customer support within 24 hours of order delivery</li>
              <li>Provide your order number and details of the issue</li>
              <li>Submit any relevant photos or evidence if applicable</li>
              <li>Our team will review your request within 48 hours</li>
              <li>If approved, refund will be processed to your original payment method</li>
            </ol>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">4. Refund Methods</h2>
          <div className="space-y-4">
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Credit/Debit Card: 5-7 business days</li>
              <li>UPI: 1-2 business days</li>
              <li>Net Banking: 3-5 business days</li>
              <li>Wallet: Instant to 24 hours</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">5. Non-Refundable Items</h2>
          <div className="space-y-4">
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Delivery charges (unless order was not delivered)</li>
              <li>Service fees</li>
              <li>Orders cancelled after 5 minutes of placement</li>
              <li>Orders where the customer provided incorrect delivery information</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">6. Partial Refunds</h2>
          <p className="text-gray-600">
            In cases where only part of your order is unsatisfactory, we may issue a partial refund for the affected items only. The amount will be determined based on the specific circumstances.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">7. Restaurant-Specific Policies</h2>
          <p className="text-gray-600">
            Some restaurants may have their own refund policies that differ from ours. In such cases, we will inform you of the specific policy before processing your refund request.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">8. Contact Us</h2>
          <p className="text-gray-600">
            For any questions regarding our Refund Policy, please contact our customer support team at support@tastytable.com or call us at +91 1234567890.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">9. Policy Updates</h2>
          <p className="text-gray-600">
            We reserve the right to modify this Refund Policy at any time. Changes will be effective immediately upon posting to our platform.
          </p>
        </section>
      </div>
    </div>
  );
} 