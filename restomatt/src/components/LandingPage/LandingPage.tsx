import React from 'react';
import { ArrowRight, Phone, Star, CheckCircle, Users, Award, Clock } from 'lucide-react';
import { collections, Collection } from '../../data/collections';

interface LandingPageProps {
  onStartProject: () => void;
  onViewCollection: (collection: Collection) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStartProject, onViewCollection }) => {
  const handleBookAppointment = () => {
    const message = `Hi! I'd like to book an appointment to discuss my furniture requirements. Please let me know your available slots.`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/919636477399?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  const features = [
    {
      icon: <Users className="h-6 w-6" />,
      title: "Expert Craftsmen",
      description: "Skilled artisans with years of experience"
    },
    {
      icon: <Award className="h-6 w-6" />,
      title: "Premium Materials",
      description: "High-quality wood and materials sourced responsibly"
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "Timely Delivery",
      description: "On-time completion with quality assurance"
    },
    {
      icon: <CheckCircle className="h-6 w-6" />,
      title: "Custom Design",
      description: "Tailored solutions for your specific needs"
    }
  ];

  const testimonials = [
    {
      name: "Priya Sharma",
      rating: 5,
      comment: "Excellent craftsmanship! My kitchen looks absolutely stunning. The team was professional and delivered on time.",
      project: "Modern Kitchen"
    },
    {
      name: "Rajesh Kumar",
      rating: 5,
      comment: "Outstanding quality furniture. The sofa set exceeded our expectations. Highly recommend Restomatt!",
      project: "Living Room Set"
    },
    {
      name: "Anita Patel",
      rating: 5,
      comment: "Professional service from design to installation. The bedroom furniture is beautiful and functional.",
      project: "Bedroom Furniture"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-amber-700">Restomatt</h1>
              <p className="text-xs text-gray-500 ml-2">Furniture Solutions</p>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#gallery" className="text-gray-700 hover:text-amber-700 transition-colors">Gallery</a>
              <a href="#features" className="text-gray-700 hover:text-amber-700 transition-colors">Features</a>
              <a href="#testimonials" className="text-gray-700 hover:text-amber-700 transition-colors">Reviews</a>
              <a href="#contact" className="text-gray-700 hover:text-amber-700 transition-colors">Contact</a>
            </nav>
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
      <section className="relative bg-gradient-to-br from-amber-50 to-orange-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Craft Your Dream
                <span className="text-amber-600 block">Furniture</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Transform your space with custom-made furniture designed to perfection. 
                From modern kitchens to luxury living rooms, we bring your vision to life.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={onStartProject}
                  className="flex items-center justify-center space-x-2 bg-amber-600 text-white px-8 py-4 rounded-lg hover:bg-amber-700 transition-all duration-200 shadow-lg hover:shadow-xl text-lg font-semibold"
                >
                  <span>Start Your Project</span>
                  <ArrowRight className="h-5 w-5" />
                </button>
                <button
                  onClick={handleBookAppointment}
                  className="flex items-center justify-center space-x-2 border-2 border-amber-600 text-amber-600 px-8 py-4 rounded-lg hover:bg-amber-600 hover:text-white transition-all duration-200 text-lg font-semibold"
                >
                  <Phone className="h-5 w-5" />
                  <span>Book Appointment</span>
                </button>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1200"
                alt="Beautiful living room furniture"
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-lg">
                <div className="flex items-center space-x-3">
                  <div className="bg-green-100 p-2 rounded-full">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">500+ Projects</p>
                    <p className="text-sm text-gray-600">Successfully Completed</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Furniture Gallery */}
      <section id="gallery" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Furniture Collection
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore our diverse range of custom furniture solutions designed to enhance every space in your home
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {collections.map((collection) => (
              <div key={collection.id} className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="relative overflow-hidden">
                  <img
                    src={collection.heroImage}
                    alt={collection.title}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  {collection.popular && (
                    <div className="absolute top-4 left-4">
                      <span className="bg-amber-500 text-white text-xs font-medium px-2.5 py-1 rounded-full">
                        Popular
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{collection.title}</h3>
                  <p className="text-gray-600 mb-4">{collection.shortDescription}</p>
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => onViewCollection(collection)}
                      className="flex items-center space-x-2 text-amber-600 hover:text-amber-700 font-medium transition-colors"
                    >
                      <span>View Collection</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                    <span className="text-sm text-gray-500">{collection.priceRange}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Restomatt?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We combine traditional craftsmanship with modern design to deliver exceptional furniture solutions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center group">
                <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-amber-200 transition-colors">
                  <div className="text-amber-600">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-gray-50">
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
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-lg">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 italic">"{testimonial.comment}"</p>
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-amber-600">{testimonial.project}</p>
                </div>
              </div>
            ))}
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
            Start your furniture journey today. Get a personalized quote and bring your vision to life.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onStartProject}
              className="bg-white text-amber-600 px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors text-lg font-semibold shadow-lg"
            >
              Start Your Project Now
            </button>
            <button
              onClick={handleBookAppointment}
              className="border-2 border-white text-white px-8 py-4 rounded-lg hover:bg-white hover:text-amber-600 transition-colors text-lg font-semibold"
            >
              Schedule Consultation
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 text-white py-12">
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
              <h4 className="text-lg font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-gray-300">
                <li>Custom Kitchen Design</li>
                <li>Living Room Furniture</li>
                <li>Bedroom Sets</li>
                <li>Office Furniture</li>
                <li>Storage Solutions</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
              <div className="space-y-2 text-gray-300">
                <p>📞 +91 96364 77399</p>
                <p>📧 info@restomatt.com</p>
                <p>📍 Jaipur, India</p>
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

export default LandingPage;