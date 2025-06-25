import React from 'react';

export default function FAQ() {
  const faqs = [
    {
      question: "How do I place an order?",
      answer: "To place an order, simply browse through our restaurant listings, select your desired items, add them to your cart, and proceed to checkout. You can pay using various payment methods including credit/debit cards, UPI, or cash on delivery."
    },
    {
      question: "What are the delivery charges?",
      answer: "Delivery charges vary depending on the restaurant and your location. The exact delivery fee will be shown during checkout before you place your order."
    },
    {
      question: "How can I track my order?",
      answer: "Once your order is confirmed, you can track its status in real-time through the 'My Orders' section in your account. You'll receive updates via SMS and email as well."
    },
    {
      question: "What if I want to cancel my order?",
      answer: "You can cancel your order within 5 minutes of placing it. After that, please contact our customer support team who will assist you with the cancellation process."
    },
    {
      question: "How do I apply a promo code?",
      answer: "You can apply a promo code during checkout. Simply enter the code in the designated field and click 'Apply'. The discount will be reflected in your total amount."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept various payment methods including credit/debit cards, UPI, net banking, and cash on delivery. Some restaurants may have specific payment restrictions."
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Frequently Asked Questions</h1>
      <div className="space-y-6">
        {faqs.map((faq, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-3">{faq.question}</h3>
            <p className="text-gray-600">{faq.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
} 