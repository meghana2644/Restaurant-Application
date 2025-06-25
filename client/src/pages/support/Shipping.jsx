import React from 'react';

export default function Shipping() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shipping Policy</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
        <section>
          <h2 className="text-xl font-semibold mb-4">1. Delivery Areas</h2>
          <p className="text-gray-600">
            TastyTable currently delivers to select areas in major cities across India. You can check if your location is within our delivery area by entering your address during checkout.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">2. Delivery Time</h2>
          <div className="space-y-4">
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Standard delivery: 30-45 minutes</li>
              <li>Express delivery: 20-30 minutes (where available)</li>
              <li>Delivery times may vary based on:</li>
              <ul className="list-disc pl-6 mt-2">
                <li>Restaurant preparation time</li>
                <li>Traffic conditions</li>
                <li>Weather conditions</li>
                <li>Order volume</li>
              </ul>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">3. Delivery Charges</h2>
          <div className="space-y-4">
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Delivery fees vary by location</li>
              <li>Minimum order amount may apply</li>
              <li>Free delivery on orders above ₹500 (where applicable)</li>
              <li>Special delivery charges may apply during peak hours</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">4. Order Tracking</h2>
          <div className="space-y-4">
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Real-time order tracking available on our app/website</li>
              <li>SMS and email notifications at key stages</li>
              <li>Delivery partner contact information provided</li>
              <li>Estimated delivery time updates</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">5. Delivery Instructions</h2>
          <div className="space-y-4">
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Provide accurate delivery address</li>
              <li>Include landmarks if available</li>
              <li>Specify any special delivery instructions</li>
              <li>Ensure someone is available to receive the order</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">6. Delivery Partners</h2>
          <p className="text-gray-600">
            Our delivery partners are trained professionals who follow strict hygiene and safety protocols. They are equipped with proper delivery gear and maintain temperature-controlled bags for food items.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">7. Failed Deliveries</h2>
          <div className="space-y-4">
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Three delivery attempts will be made</li>
              <li>Contact will be attempted via phone</li>
              <li>Orders may be cancelled if delivery fails</li>
              <li>Refund will be processed as per Refund Policy</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">8. Special Circumstances</h2>
          <div className="space-y-4">
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Holiday delivery schedules</li>
              <li>Weather-related delays</li>
              <li>Traffic conditions</li>
              <li>Restaurant-specific delivery times</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">9. Contact Us</h2>
          <p className="text-gray-600">
            For any questions regarding our Shipping Policy, please contact our customer support team at support@tastytable.com or call us at +91 1234567890.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">10. Policy Updates</h2>
          <p className="text-gray-600">
            We reserve the right to modify this Shipping Policy at any time. Changes will be effective immediately upon posting to our platform.
          </p>
        </section>
      </div>
    </div>
  );
} 