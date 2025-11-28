"use client";

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [openFAQ, setOpenFAQ] = useState(null);

  // Refs for scrolling
  const servicesRef = useRef(null);
  const productsRef = useRef(null);
  const faqRef = useRef(null);
  const contactRef = useRef(null);

  const heroTexts = [
    {
      title: "Transform Your Business",
      subtitle: "With AI-Powered Automation Solutions",
      titleColor: "text-white",
      subtitleColor: "text-gray-200"
    },
    {
      title: "Data-Driven Decisions",
      subtitle: "Turn Insights into Actionable Results",
      titleColor: "text-gray-200",
      subtitleColor: "text-white"
    },
    {
      title: "Digital Transformation",
      subtitle: "Modern Solutions for Modern Businesses",
      titleColor: "text-white",
      subtitleColor: "text-gray-300"
    },
    {
      title: "Streamline Operations",
      subtitle: "Automate, Optimize, and Scale Efficiently",
      titleColor: "text-gray-100",
      subtitleColor: "text-white"
    }
  ];

  // Scroll functions
  const scrollToSection = (ref) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroTexts.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Fixed Header with Black Theme */}
      <header className="fixed top-0 left-0 right-0 bg-gray-900 border-b border-gray-800 shadow-lg z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-white tracking-tight">AutoMATE Solutions</h1>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              <button 
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition duration-300 border-b-2 border-transparent hover:border-white"
              >
                Home
              </button>
              <button 
                onClick={() => scrollToSection(servicesRef)}
                className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition duration-300 border-b-2 border-transparent hover:border-white"
              >
                Services
              </button>
              <button 
                onClick={() => scrollToSection(productsRef)}
                className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition duration-300 border-b-2 border-transparent hover:border-white"
              >
                Products
              </button>
              <button 
                onClick={() => scrollToSection(faqRef)}
                className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition duration-300 border-b-2 border-transparent hover:border-white"
              >
                FAQs
              </button>
              <div className="flex items-center space-x-2 ml-4">
                <span className="text-gray-300 text-sm font-medium border-l-2 border-gray-700 pl-4">English</span>
              </div>
            </nav>

            {/* CTA Button */}
            <div className="hidden md:block">
              <button 
                onClick={() => scrollToSection(contactRef)}
                className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg text-sm font-medium transition duration-300 transform hover:scale-105 shadow-lg hover:shadow-blue-500/25"
              >
                Start Today
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-300 p-2 hover:bg-gray-800 rounded-lg transition duration-300"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-800 bg-gray-800 rounded-b-lg">
              <div className="flex flex-col space-y-3">
                <button 
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium hover:bg-gray-700 rounded-lg transition duration-300 text-left"
                >
                  Home
                </button>
                <button 
                  onClick={() => scrollToSection(servicesRef)}
                  className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium hover:bg-gray-700 rounded-lg transition duration-300 text-left"
                >
                  Services
                </button>
                <button 
                  onClick={() => scrollToSection(productsRef)}
                  className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium hover:bg-gray-700 rounded-lg transition duration-300 text-left"
                >
                  Products
                </button>
                <button 
                  onClick={() => scrollToSection(faqRef)}
                  className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium hover:bg-gray-700 rounded-lg transition duration-300 text-left"
                >
                  FAQs
                </button>
                <button 
                  onClick={() => scrollToSection(contactRef)}
                  className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg text-sm font-medium text-center mt-2 transition duration-300"
                >
                  Start Today
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section with Background Image and Carousel */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Background Image Only - No Overlay */}
        <div className="absolute inset-0 z-0">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url("image.webp")`
            }}
          />
        </div>

        {/* Hero Content - Centered with proper spacing */}
        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
          {/* Main content container with proper vertical spacing */}
          <div className="flex flex-col items-center justify-center space-y-12 py-16">
            
            {/* Carousel Text Section */}
            <div className="w-full max-w-4xl">
              <div className="relative h-48 flex items-center justify-center">
                {heroTexts.map((text, index) => (
                  <div
                    key={index}
                    className={`absolute inset-0 transition-all duration-1000 ease-in-out flex flex-col items-center justify-center ${
                      index === currentSlide
                        ? 'opacity-100 transform translate-y-0'
                        : 'opacity-0 transform translate-y-4'
                    }`}
                  >
                    <h1 className={`text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight text-center drop-shadow-2xl ${text.titleColor}`}>
                      {text.title}
                    </h1>
                    <p className={`text-xl md:text-2xl lg:text-3xl max-w-3xl mx-auto leading-relaxed text-center drop-shadow-2xl font-medium ${text.subtitleColor}`}>
                      {text.subtitle}
                    </p>
                  </div>
                ))}
              </div>

              {/* Carousel Indicators */}
              <div className="flex justify-center space-x-3 mt-8">
                {heroTexts.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentSlide ? 'bg-blue-500 scale-125' : 'bg-white/70'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* CTA Buttons Section - Separated from text */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mt-8">
              <button 
                onClick={() => scrollToSection(contactRef)}
                className="group bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-2xl shadow-blue-500/25 min-w-[200px] text-center drop-shadow-2xl"
              >
                <span className="flex items-center justify-center">
                  Start Your Journey 
                  <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </button>
              <button 
                onClick={() => scrollToSection(servicesRef)}
                className="border-2 border-white hover:border-blue-300 text-white backdrop-blur-sm px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 hover:bg-white/10 min-w-[200px] text-center drop-shadow-2xl"
              >
                Explore Solutions
              </button>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
            <div className="animate-bounce">
              <svg className="w-6 h-6 text-white drop-shadow-2xl" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section with Background Image */}
      <section className="relative py-20 bg-gray-900">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{
            backgroundImage: `url("https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2072&q=80")`
          }}
        />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Our Mission
            </h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto mb-8"></div>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Empowering businesses with cutting-edge digital solutions to automate, optimize, 
              and scale their operations through modern technology.
            </p>
          </div>

          <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
            <div className="max-w-3xl mx-auto text-center">
              <h3 className="text-3xl font-bold text-white mb-6">Driving Digital Excellence</h3>
              <p className="text-lg text-gray-300 leading-relaxed mb-6">
                At AutoMATE Solutions, we believe that every business deserves access to 
                cutting-edge technology that simplifies complexity and accelerates growth. 
                Our mission is to bridge the gap between traditional business operations 
                and modern digital solutions.
              </p>
              <p className="text-lg text-gray-300 leading-relaxed">
                Whether you're looking to establish a robust online presence, automate 
                repetitive tasks, or explore blockchain technology, we provide the tools 
                and expertise to transform your business journey and scale new heights.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section - Light Background */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Our Values
            </h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto mb-8"></div>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do at AutoMATE Solutions
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Data-Driven Efficiency */}
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200 text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Data-Driven Efficiency</h3>
              <p className="text-gray-600 leading-relaxed">
                Uses data and AI to automate tasks and optimize workflows, maximizing user time and resources.
              </p>
            </div>

            {/* Human-Centric */}
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200 text-center">
              <div className="w-20 h-20 bg-green-100 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Human-Centric</h3>
              <p className="text-gray-600 leading-relaxed">
                Empowers individuals and teams to thrive by fostering both personal and collective growth within the digital world.
              </p>
            </div>

            {/* Harmony */}
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200 text-center">
              <div className="w-20 h-20 bg-purple-100 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                <svg className="w-10 h-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Harmony</h3>
              <p className="text-gray-600 leading-relaxed">
                Decisions will prioritize creating a win-win situation for employers, recruiters, and talents.
              </p>
            </div>

            {/* Security & Trust */}
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200 text-center">
              <div className="w-20 h-20 bg-orange-100 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                <svg className="w-10 h-10 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Security & Trust</h3>
              <p className="text-gray-600 leading-relaxed">
                Protects user data and fosters a secure environment to help everyone confidently engage with the digital world.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section - Black Background */}
      <section ref={servicesRef} className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Our Services
            </h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto mb-8"></div>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Comprehensive digital solutions to drive your business forward
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Web Development */}
            <div className="bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-blue-900 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 text-center">Web Development</h3>
              <p className="text-gray-300 text-center leading-relaxed">
                Custom, responsive websites and web applications built with modern frameworks 
                to establish your digital presence and drive business growth.
              </p>
            </div>

            {/* Smart Contract Development */}
            <div className="bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-green-900 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 text-center">Smart Contract Development</h3>
              <p className="text-gray-300 text-center leading-relaxed">
                Secure and audited smart contracts for blockchain solutions, DeFi applications, 
                and Web3 integrations to future-proof your business.
              </p>
            </div>

            {/* Email Automation */}
            <div className="bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-purple-900 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 text-center">Email Automation</h3>
              <p className="text-gray-300 text-center leading-relaxed">
                Automated email workflows, personalized campaigns, and lead nurturing systems 
                that engage customers and drive conversions 24/7.
              </p>
            </div>

            {/* Bot Development */}
            <div className="bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-orange-900 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                <svg className="w-8 h-8 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 text-center">Bot Development</h3>
              <p className="text-gray-300 text-center leading-relaxed">
                AI-powered chatbots and automation bots for customer service, sales, 
                and internal processes that work around the clock to enhance efficiency.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* E-commerce Section - Light Background */}
      <section ref={productsRef} className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Content Section */}
            <div className="space-y-8">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                  Launch Your Store in <span className="text-blue-600">10 Minutes</span>
                </h2>
                <div className="w-24 h-1 bg-blue-600 mb-8"></div>
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  Get your fully functional e-commerce store up and running in under 10 minutes. 
                  No technical skills required - just your vision and our powerful platform.
                </p>
              </div>

              {/* Features List */}
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Custom Store URL</h3>
                    <p className="text-gray-600">
                      Your unique web address that represents your brand - customers can visit anytime to shop.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">WhatsApp Integration</h3>
                    <p className="text-gray-600">
                      Customers place orders directly to your WhatsApp DMs for personalized shopping experience.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Complete Management Tools</h3>
                    <p className="text-gray-600">
                      Full dashboard access to manage products, track sales, monitor traffic, and handle orders.
                    </p>
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <div className="pt-4">
                <button 
                  onClick={() => scrollToSection(contactRef)}
                  className="inline-flex items-center bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-2xl shadow-blue-500/25"
                >
                  <span className="flex items-center">
                    Create Your Store Now
                    <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                </button>
              </div>
            </div>

            {/* Dashboard Image Section */}
            <div className="relative">
              <div className="bg-gray-900 rounded-2xl p-6 shadow-2xl border border-gray-800 transform hover:scale-[1.02] transition-transform duration-300">
                {/* Actual Dashboard Image */}
                <div className="bg-gray-800 rounded-lg overflow-hidden mb-4">
                  <img 
                    src="/store.png" 
                    alt="E-commerce Dashboard Preview" 
                    className="w-full h-auto object-cover"
                  />
                </div>
                
                <div className="text-center">
                  <p className="text-gray-400 text-sm">
                    Your complete store management dashboard - ready in minutes
                  </p>
                </div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg">
                <span className="font-bold">10 MIN SETUP</span>
              </div>
              <div className="absolute -bottom-4 -left-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg">
                <span className="font-bold">24/7 SUPPORT</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section - Light Background */}
      <section ref={faqRef} className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Frequently Asked Questions
            </h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto mb-8"></div>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get answers to the most common questions about AutoMATE Solutions
            </p>
          </div>

          <div className="space-y-6">
            {/* FAQ Item 1 */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <button 
                onClick={() => toggleFAQ(0)}
                className="flex justify-between items-center w-full p-6 text-left hover:bg-gray-50 transition duration-300"
              >
                <h3 className="text-lg font-semibold text-gray-900">
                  Who are AutoMATE Solutions target customers?
                </h3>
                <svg 
                  className={`w-5 h-5 text-gray-500 transform transition-transform duration-300 ${openFAQ === 0 ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className={`px-6 pb-6 transition-all duration-300 ${openFAQ === 0 ? 'block' : 'hidden'}`}>
                <p className="text-gray-600 leading-relaxed">
                  AutoMATE Solutions serves businesses of all sizes looking to embrace digital transformation. 
                  Our target customers include entrepreneurs starting new ventures, small to medium businesses 
                  seeking to scale operations, e-commerce store owners, and enterprises wanting to automate 
                  repetitive tasks and leverage AI-powered solutions for growth.
                </p>
              </div>
            </div>

            {/* FAQ Item 2 */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <button 
                onClick={() => toggleFAQ(1)}
                className="flex justify-between items-center w-full p-6 text-left hover:bg-gray-50 transition duration-300"
              >
                <h3 className="text-lg font-semibold text-gray-900">
                  What are the benefits of using AutoMATE Solutions products?
                </h3>
                <svg 
                  className={`w-5 h-5 text-gray-500 transform transition-transform duration-300 ${openFAQ === 1 ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className={`px-6 pb-6 transition-all duration-300 ${openFAQ === 1 ? 'block' : 'hidden'}`}>
                <p className="text-gray-600 leading-relaxed">
                  Our products deliver significant benefits including rapid deployment (stores in 10 minutes), 
                  cost-effective automation reducing manual work by up to 70%, data-driven insights for better 
                  decision-making, seamless WhatsApp integration for direct customer engagement, and comprehensive 
                  analytics to track performance and growth metrics in real-time.
                </p>
              </div>
            </div>

            {/* FAQ Item 3 */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <button 
                onClick={() => toggleFAQ(2)}
                className="flex justify-between items-center w-full p-6 text-left hover:bg-gray-50 transition duration-300"
              >
                <h3 className="text-lg font-semibold text-gray-900">
                  When can I get started with AutoMATE Solutions services?
                </h3>
                <svg 
                  className={`w-5 h-5 text-gray-500 transform transition-transform duration-300 ${openFAQ === 2 ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className={`px-6 pb-6 transition-all duration-300 ${openFAQ === 2 ? 'block' : 'hidden'}`}>
                <p className="text-gray-600 leading-relaxed">
                  You can start immediately! Our platform is designed for instant onboarding. 
                  Click the "Start Today" or "Create Your Store Now" buttons to begin your journey. 
                  For e-commerce stores, you can be up and running in under 10 minutes. For custom 
                  development services, we typically begin projects within 24-48 hours of consultation 
                  and requirements gathering.
                </p>
              </div>
            </div>

            {/* FAQ Item 4 */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <button 
                onClick={() => toggleFAQ(3)}
                className="flex justify-between items-center w-full p-6 text-left hover:bg-gray-50 transition duration-300"
              >
                <h3 className="text-lg font-semibold text-gray-900">
                  How can I get technical support?
                </h3>
                <svg 
                  className={`w-5 h-5 text-gray-500 transform transition-transform duration-300 ${openFAQ === 3 ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className={`px-6 pb-6 transition-all duration-300 ${openFAQ === 3 ? 'block' : 'hidden'}`}>
                <p className="text-gray-600 leading-relaxed">
                  We offer comprehensive 24/7 technical support through multiple channels. You can reach us via:
                  <br /><br />
                  • <strong>Email:</strong> support@automate.com for detailed technical assistance
                  <br />
                  • <strong>Live Chat:</strong> Available directly through our platform dashboard
                  <br />
                  • <strong>Phone Support:</strong> +1 (555) 123-4567 during business hours
                  <br />
                  • <strong>Documentation:</strong> Extensive knowledge base and tutorials
                  <br />
                  • <strong>Community Forum:</strong> Connect with other users and experts
                </p>
              </div>
            </div>
          </div>

          {/* Additional Support CTA */}
          <div className="text-center mt-12">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Need more specific answers?</h3>
              <p className="text-gray-600 mb-6">
                Our support team is ready to help you with any questions about our services and solutions.
              </p>
              <button 
                onClick={() => scrollToSection(contactRef)}
                className="inline-flex items-center bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
              >
                <span className="flex items-center">
                  Contact Support
                  <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Us Section */}
      <section ref={contactRef} className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Contact Us
            </h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto mb-8"></div>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Ready to transform your business? Get in touch with us today.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold text-white mb-6">Get in Touch</h3>
                <p className="text-gray-300 mb-8">
                  Have questions about our services? Ready to start your digital transformation journey? 
                  Reach out to us and our team will get back to you within 24 hours.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-1">Phone</h4>
                    <p className="text-gray-300">+1 (555) 123-4567</p>
                    <p className="text-gray-400 text-sm">Mon-Fri from 8am to 6pm</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-1">Email</h4>
                    <p className="text-gray-300">info@automate.com</p>
                    <p className="text-gray-400 text-sm">We'll respond within 24 hours</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-1">Office</h4>
                    <p className="text-gray-300">123 Business Avenue</p>
                    <p className="text-gray-400 text-sm">Suite 100, Tech City, TC 10101</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700">
              <h3 className="text-2xl font-bold text-white mb-6">Send us a Message</h3>
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-300 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-300 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      placeholder="Doe"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label htmlFor="service" className="block text-sm font-medium text-gray-300 mb-2">
                    Service Interest
                  </label>
                  <select
                    id="service"
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="">Select a service</option>
                    <option value="ecommerce">E-commerce Store</option>
                    <option value="webdev">Web Development</option>
                    <option value="smartcontract">Smart Contract Development</option>
                    <option value="email">Email Automation</option>
                    <option value="bot">Bot Development</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows="4"
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    placeholder="Tell us about your project..."
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-gray-900 border-t border-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="md:col-span-2">
              <h3 className="text-2xl font-bold text-white mb-4">AutoMATE Solutions</h3>
              <p className="text-gray-400 mb-6 max-w-md">
                Empowering businesses with cutting-edge digital solutions to automate, 
                optimize, and scale operations through modern technology.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition duration-300">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition duration-300">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition duration-300">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-gray-400 hover:text-white transition duration-300">Home</button></li>
                <li><button onClick={() => scrollToSection(servicesRef)} className="text-gray-400 hover:text-white transition duration-300">Services</button></li>
                <li><button onClick={() => scrollToSection(productsRef)} className="text-gray-400 hover:text-white transition duration-300">Products</button></li>
                <li><button onClick={() => scrollToSection(faqRef)} className="text-gray-400 hover:text-white transition duration-300">FAQs</button></li>
                <li><button onClick={() => scrollToSection(contactRef)} className="text-gray-400 hover:text-white transition duration-300">Contact</button></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Email: info@automate.com</li>
                <li>Phone: +1 (555) 123-4567</li>
                <li>Support: support@automate.com</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400">
              © 2024 AutoMATE Solutions. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}