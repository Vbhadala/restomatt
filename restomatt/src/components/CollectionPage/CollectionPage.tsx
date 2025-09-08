import React, { useState } from 'react';
import { ArrowLeft, Phone, Star, CheckCircle, ArrowRight, ChevronLeft, ChevronRight, Calendar, Award, Clock, Users } from 'lucide-react';
import { Collection } from '../../data/collections';

interface CollectionPageProps {
  collection: Collection;
  onBack: () => void;
  onStartProject: () => void;
}

const CollectionPage: React.FC<CollectionPageProps> = ({ collection, onBack, onStartProject }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleBookAppointment = () => {
    const message = `Hi! I'm interested in your ${collection.title} collection. I'd like to schedule a consultation to discuss my requirements and get a personalized quote. Please let me know your available slots.`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/919636477399?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % collection.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + collection.images.length) % collection.images.length);
  };

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </button>
              <div className="h-6 w-px bg-gray-300" />
              <div>
                <h1 className="text-2xl font-bold text-amber-700">Restomatt</h1>
                <p className="text-xs text-gray-500 -mt-1">Furniture Solutions</p>
              </div>
            </div>
            <button
              onClick={onStartProject}
              className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors"
            >
              Start Project
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-amber-50 to-orange-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                {collection.popular && (
                  <span className="bg-amber-100 text-amber-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    Popular Choice
                  </span>
                )}
                <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  {collection.customizable ? 'Fully Customizable' : 'Standard Design'}
                </span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                {collection.title}
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                {collection.description}
              </p>
              
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="flex items-center space-x-3">
                  <div className="bg-amber-100 p-2 rounded-full">
                    <Clock className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Delivery Time</p>
                    <p className="font-semibold text-gray-900">{collection.deliveryTime}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="bg-green-100 p-2 rounded-full">
                    <Award className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Price Range</p>
                    <p className="font-semibold text-gray-900">{collection.priceRange}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleBookAppointment}
                  className="flex items-center justify-center space-x-2 bg-amber-600 text-white px-8 py-4 rounded-lg hover:bg-amber-700 transition-all duration-200 shadow-lg hover:shadow-xl text-lg font-semibold"
                >
                  <Phone className="h-5 w-5" />
                  <span>Book Free Consultation</span>
                </button>
                <button
                  onClick={onStartProject}
                  className="flex items-center justify-center space-x-2 border-2 border-amber-600 text-amber-600 px-8 py-4 rounded-lg hover:bg-amber-600 hover:text-white transition-all duration-200 text-lg font-semibold"
                >
                  <span>Start Design Process</span>
                  <ArrowRight className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div className="relative">
              <img
                src={collection.heroImage}
                alt={collection.title}
                className="rounded-2xl shadow-2xl w-full h-96 object-cover"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-lg">
                <div className="flex items-center space-x-3">
                  <div className="bg-green-100 p-2 rounded-full">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Premium Quality</p>
                    <p className="text-sm text-gray-600">Handcrafted Excellence</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Image Gallery */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Gallery & Designs
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore our stunning collection of {collection.title.toLowerCase()} designs
            </p>
          </div>

          {/* Main Image Slider */}
          <div className="relative mb-8">
            <div className="relative h-96 md:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
              <img
                src={collection.images[currentImageIndex].url}
                alt={collection.images[currentImageIndex].alt}
                className="w-full h-full object-cover"
              />
              
              {/* Navigation Arrows */}
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all duration-200"
              >
                <ChevronLeft className="h-6 w-6 text-gray-800" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all duration-200"
              >
                <ChevronRight className="h-6 w-6 text-gray-800" />
              </button>
              
              {/* Image Caption */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                <p className="text-white text-lg font-medium">
                  {collection.images[currentImageIndex].caption}
                </p>
              </div>
            </div>
            
            {/* Thumbnail Navigation */}
            <div className="flex justify-center space-x-2 mt-6">
              {collection.images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToImage(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-200 ${
                    index === currentImageIndex
                      ? 'bg-amber-600 scale-125'
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Thumbnail Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {collection.images.map((image, index) => (
              <button
                key={image.id}
                onClick={() => goToImage(index)}
                className={`relative h-32 rounded-lg overflow-hidden transition-all duration-200 ${
                  index === currentImageIndex
                    ? 'ring-4 ring-amber-500 scale-105'
                    : 'hover:scale-105 hover:shadow-lg'
                }`}
              >
                <img
                  src={image.url}
                  alt={image.alt}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Features & Benefits */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Why Choose Our {collection.title}?
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Experience the perfect blend of style, functionality, and craftsmanship
              </p>
              
              <div className="space-y-4">
                {collection.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="bg-green-100 p-1 rounded-full">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                    <span className="text-gray-700 font-medium">{feature}</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 p-6 bg-amber-50 rounded-lg border border-amber-200">
                <h3 className="font-semibold text-amber-800 mb-2">Available Materials</h3>
                <div className="flex flex-wrap gap-2">
                  {collection.materials.map((material, index) => (
                    <span
                      key={index}
                      className="bg-amber-100 text-amber-800 text-sm font-medium px-3 py-1 rounded-full"
                    >
                      {material}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-gray-50 p-6 rounded-lg text-center">
                <Users className="h-8 w-8 text-amber-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Expert Craftsmen</h3>
                <p className="text-sm text-gray-600">Skilled artisans with 15+ years experience</p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg text-center">
                <Award className="h-8 w-8 text-amber-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Premium Quality</h3>
                <p className="text-sm text-gray-600">Only the finest materials and finishes</p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg text-center">
                <Clock className="h-8 w-8 text-amber-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Timely Delivery</h3>
                <p className="text-sm text-gray-600">On-time completion guaranteed</p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg text-center">
                <CheckCircle className="h-8 w-8 text-amber-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">10 Year Warranty</h3>
                <p className="text-sm text-gray-600">Comprehensive warranty coverage</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Customers Say
            </h2>
            <p className="text-xl text-gray-600">
              Real experiences from satisfied customers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-6 italic">
                "Absolutely stunning {collection.title.toLowerCase()}! The quality exceeded our expectations and the team was professional throughout."
              </p>
              <div>
                <p className="font-semibold text-gray-900">Priya Sharma</p>
                <p className="text-sm text-amber-600">Mumbai</p>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-6 italic">
                "Perfect craftsmanship and attention to detail. The {collection.title.toLowerCase()} transformed our home completely!"
              </p>
              <div>
                <p className="font-semibold text-gray-900">Rajesh Kumar</p>
                <p className="text-sm text-amber-600">Delhi</p>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-6 italic">
                "Excellent service from consultation to installation. Highly recommend Restomatt for quality furniture!"
              </p>
              <div>
                <p className="font-semibold text-gray-900">Anita Patel</p>
                <p className="text-sm text-amber-600">Bangalore</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-amber-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Space?
          </h2>
          <p className="text-xl text-amber-100 mb-8 max-w-2xl mx-auto">
            Get a personalized consultation and quote for your {collection.title.toLowerCase()} project. 
            Our experts are ready to bring your vision to life.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <button
              onClick={handleBookAppointment}
              className="bg-white text-amber-600 px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors text-lg font-semibold shadow-lg flex items-center justify-center space-x-2"
            >
              <Calendar className="h-5 w-5" />
              <span>Book Free Consultation</span>
            </button>
            <button
              onClick={onStartProject}
              className="border-2 border-white text-white px-8 py-4 rounded-lg hover:bg-white hover:text-amber-600 transition-colors text-lg font-semibold flex items-center justify-center space-x-2"
            >
              <span>Start Design Process</span>
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="bg-amber-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Free Consultation</h3>
              <p className="text-amber-100">Expert advice at no cost</p>
            </div>
            <div className="text-center">
              <div className="bg-amber-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Custom Design</h3>
              <p className="text-amber-100">Tailored to your needs</p>
            </div>
            <div className="text-center">
              <div className="bg-amber-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Quality Guarantee</h3>
              <p className="text-amber-100">10-year warranty included</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-2xl font-bold text-amber-400 mb-4">Restomatt</h3>
              <p className="text-gray-300 mb-4">
                Crafting beautiful, functional furniture that transforms your living spaces.
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={handleBookAppointment}
                  className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors"
                >
                  Contact Us
                </button>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-300">
                <li><button onClick={onBack} className="hover:text-white transition-colors">All Collections</button></li>
                <li><button onClick={onStartProject} className="hover:text-white transition-colors">Start Project</button></li>
                <li><button onClick={handleBookAppointment} className="hover:text-white transition-colors">Book Consultation</button></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
              <div className="space-y-2 text-gray-300">
                <p>📞 +91 96364 77399</p>
                <p>📧 info@restomatt.com</p>
                <p>📍 Your City, India</p>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Restomatt. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CollectionPage;