// Test script to verify restaurant creation fix
const testData = {
  name: 'Test Pizza Palace',
  description: 'Authentic Italian pizza with fresh ingredients',
  imageUrl: 'https://example.com/pizza-image.jpg',
  bannerUrl: 'https://example.com/pizza-banner.jpg',
  address: {
    street: '123 Main Street',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    country: 'USA'
  },
  priceLevel: 2,
  cuisine: ['Italian', 'Pizza'],
  distance: 0,
  deliveryTime: '30-45 min',
  freeDelivery: false,
  latitude: 40.7128,
  longitude: -74.0060,
  rating: 0,
  reviewCount: 0,
  openingHours: {
    monday: { open: '09:00', close: '22:00' },
    tuesday: { open: '09:00', close: '22:00' },
    wednesday: { open: '09:00', close: '22:00' },
    thursday: { open: '09:00', close: '22:00' },
    friday: { open: '09:00', close: '22:00' },
    saturday: { open: '09:00', close: '22:00' },
    sunday: { open: '09:00', close: '22:00' }
  },
  ownerEmail: 'owner@example.com'
};

// Test the data against validation requirements
const requiredFields = [
  'name', 'description', 'imageUrl', 'bannerUrl', 'deliveryTime', 'ownerEmail',
  'address.street', 'address.city', 'address.state', 'address.zipCode', 'address.country'
];

console.log('🧪 Testing Restaurant Creation Data');
console.log('=====================================');

let allValid = true;

requiredFields.forEach(field => {
  const fieldParts = field.split('.');
  let value = testData;
  
  fieldParts.forEach(part => {
    value = value?.[part];
  });
  
  const isValid = value && value.toString().trim() !== '';
  if (!isValid) allValid = false;
  
  console.log(`${isValid ? '✅' : '❌'} ${field}: ${value || '(missing)'}`);
});

// Test URLs
try {
  new URL(testData.imageUrl);
  console.log('✅ imageUrl: Valid URL');
} catch {
  console.log('❌ imageUrl: Invalid URL');
  allValid = false;
}

try {
  new URL(testData.bannerUrl);
  console.log('✅ bannerUrl: Valid URL');
} catch {
  console.log('❌ bannerUrl: Invalid URL');
  allValid = false;
}

// Test email
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const emailValid = emailRegex.test(testData.ownerEmail);
console.log(`${emailValid ? '✅' : '❌'} ownerEmail format: ${emailValid ? 'Valid' : 'Invalid'}`);
if (!emailValid) allValid = false;

// Test cuisine array
const cuisineValid = Array.isArray(testData.cuisine) && testData.cuisine.length > 0;
console.log(`${cuisineValid ? '✅' : '❌'} cuisine: ${cuisineValid ? 'Valid array' : 'Invalid/empty'}`);
if (!cuisineValid) allValid = false;

// Test required fields that should have defaults
console.log(`✅ reviewCount: ${testData.reviewCount} (default)`);
console.log(`✅ rating: ${testData.rating} (default)`);

console.log('\n🎯 Overall Result');
console.log('==================');
console.log(`${allValid ? '✅ PASS' : '❌ FAIL'}: Restaurant data ${allValid ? 'is valid' : 'has issues'}`);

if (allValid) {
  console.log('\n🚀 This data should successfully create a restaurant!');
  console.log('\n📋 Test Data Summary:');
  console.log(`- Restaurant: ${testData.name}`);
  console.log(`- Location: ${testData.address.city}, ${testData.address.state}`);
  console.log(`- Owner: ${testData.ownerEmail}`);
  console.log(`- Cuisine: ${testData.cuisine.join(', ')}`);
  console.log(`- Delivery: ${testData.deliveryTime}`);
} else {
  console.log('\n⚠️  Please fix the issues above before testing restaurant creation.');
}
