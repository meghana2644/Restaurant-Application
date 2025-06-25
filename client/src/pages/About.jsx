import React from 'react';

export default function About() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">About TastyTable</h1>
          <p className="text-xl text-gray-600">Your Gateway to Exceptional Dining Experiences</p>
        </div>

        {/* Mission Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
          <p className="text-gray-600 mb-4">
            At TastyTable, we're on a mission to transform the way people experience dining out. 
            We believe that great food should be enjoyed in the perfect ambiance, and we're committed to 
            connecting food enthusiasts with the best local restaurants for memorable dining experiences.
          </p>
          <p className="text-gray-600">
            Our platform makes it easy to discover new restaurants, explore diverse cuisines, 
            and enjoy your favorite meals in the perfect setting.
          </p>
        </section>

        {/* Values Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-3">Quality First</h3>
              <p className="text-gray-600">
                We partner with restaurants that share our commitment to quality food, service, and ambiance.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-3">Customer Experience</h3>
              <p className="text-gray-600">
                Your dining experience is our top priority. We're here to ensure a seamless reservation and dining experience.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-3">Innovation</h3>
              <p className="text-gray-600">
                We continuously improve our platform to provide the best restaurant discovery and reservation experience.
              </p>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Why Choose TastyTable?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start space-x-4">
              <div className="bg-indigo-100 p-3 rounded-full">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Easy Reservations</h3>
                <p className="text-gray-600">Book your table with just a few clicks</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-indigo-100 p-3 rounded-full">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Real-Time Availability</h3>
                <p className="text-gray-600">Check table availability in real-time</p>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Our Team</h2>
          <p className="text-gray-600 mb-6">
            We're a dedicated team of food enthusiasts, tech experts, and hospitality 
            professionals working together to bring you the best dining experience.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-gray-200"></div>
              <h3 className="text-lg font-semibold">John Doe</h3>
              <p className="text-gray-600">CEO & Founder</p>
            </div>
            <div className="text-center">
              <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-gray-200"></div>
              <h3 className="text-lg font-semibold">Jane Smith</h3>
              <p className="text-gray-600">Operations Director</p>
            </div>
            <div className="text-center">
              <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-gray-200"></div>
              <h3 className="text-lg font-semibold">Mike Johnson</h3>
              <p className="text-gray-600">Tech Lead</p>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">Get in Touch</h2>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-gray-600 mb-4">
              Have questions or suggestions? We'd love to hear from you!
            </p>
            <div className="space-y-2">
              <p className="text-gray-600">
                <span className="font-semibold">Email:</span> contact@tastytable.com
              </p>
              <p className="text-gray-600">
                <span className="font-semibold">Phone:</span> +91 1234567890
              </p>
              <p className="text-gray-600">
                <span className="font-semibold">Address:</span> 123 Food Street, Mumbai, Maharashtra 400001
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
} 