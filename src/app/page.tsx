"use client";

import React, { useEffect, useRef, useState } from "react";

type HeroSlide = {
  title: string;
  subtitle: string;
  accent: string;
};

type FAQItem = {
  question: string;
  answer: string;
};

type ServiceItem = {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  image: string;
};

type ValueItem = {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
};

type IndustryItem = {
  title: string;
  description: string;
  image: string;
};

type ProcessItem = {
  step: string;
  title: string;
  description: string;
};

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [openFAQ, setOpenFAQ] = useState<number | null>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [formStatus, setFormStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const servicesRef = useRef<HTMLElement | null>(null);
  const credibilityRef = useRef<HTMLElement | null>(null);
  const productsRef = useRef<HTMLElement | null>(null);
  const industriesRef = useRef<HTMLElement | null>(null);
  const faqRef = useRef<HTMLElement | null>(null);
  const contactRef = useRef<HTMLElement | null>(null);
  const founderRef = useRef<HTMLElement | null>(null);
  const valuesRef = useRef<HTMLElement | null>(null);
  const processRef = useRef<HTMLElement | null>(null);

  const heroSlides: HeroSlide[] = [
    {
      title: "Transform Your Business with Intelligent Automation",
      subtitle:
        "We build modern digital systems, AI-powered workflows, and scalable platforms that help businesses automate, optimize, and grow faster.",
      accent: "AI Automation",
    },
    {
      title: "Build Smarter Systems for Modern Operations",
      subtitle:
        "From websites and e-commerce to bots, blockchain, and business workflows — AutoMATE Solutions helps you move from manual work to smart execution.",
      accent: "Digital Systems",
    },
    {
      title: "Turn Ideas into Reliable, Revenue-Driving Products",
      subtitle:
        "We help founders, startups, and growing businesses launch digital solutions that look professional, work efficiently, and scale with confidence.",
      accent: "Growth-Focused",
    },
  ];

  const values: ValueItem[] = [
    {
      title: "Innovation",
      description:
        "We combine modern engineering, AI, and automation to create solutions that keep businesses ahead.",
      color: "from-blue-500/20 to-cyan-500/20 border-blue-500/20",
      icon: (
        <svg className="w-7 h-7 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
    {
      title: "Efficiency",
      description:
        "Our work is designed to reduce manual effort, save time, and improve business performance.",
      color: "from-emerald-500/20 to-green-500/20 border-emerald-500/20",
      icon: (
        <svg className="w-7 h-7 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
      ),
    },
    {
      title: "Trust & Security",
      description:
        "We value dependable systems, secure workflows, and long-term partnerships built on trust.",
      color: "from-orange-500/20 to-amber-500/20 border-orange-500/20",
      icon: (
        <svg className="w-7 h-7 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 .552-.448 1-1 1s-1-.448-1-1 .448-1 1-1 1 .448 1 1zm0 0V9m0 6h.01M5.071 19h13.858c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
    },
    {
      title: "Human-Centered",
      description:
        "Technology should make life and work easier for people, not more complicated.",
      color: "from-purple-500/20 to-fuchsia-500/20 border-purple-500/20",
      icon: (
        <svg className="w-7 h-7 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5V9H2v11h5m10 0v-6a3 3 0 10-6 0v6m6 0H7" />
        </svg>
      ),
    },
  ];

  const services: ServiceItem[] = [
    {
      title: "Web Development",
      description: "Professional websites, dashboards, portals, and custom web apps built for real business needs and growth.",
      color: "bg-blue-500/10 border-blue-500/20",
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80",
      icon: (
        <svg className="w-7 h-7 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M4 5h16a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V7a2 2 0 012-2z" />
        </svg>
      ),
    },
    {
      title: "AI & Business Automation",
      description: "Automate repetitive workflows, simplify operations, and improve team productivity using smart systems.",
      color: "bg-cyan-500/10 border-cyan-500/20",
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80",
      icon: (
        <svg className="w-7 h-7 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 3v2.25M14.25 3v2.25M9 9h6m-9 8.25h12A2.25 2.25 0 0020.25 15V9A2.25 2.25 0 0018 6.75H6A2.25 2.25 0 003.75 9v6A2.25 2.25 0 006 17.25z" />
        </svg>
      ),
    },
    {
      title: "Bot Development",
      description: "Custom WhatsApp bots, support bots, lead-generation bots, and automated customer interaction systems.",
      color: "bg-orange-500/10 border-orange-500/20",
      image: "https://images.unsplash.com/photo-1531746790731-6c087fecd05a?auto=format&fit=crop&w=800&q=80",
      icon: (
        <svg className="w-7 h-7 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2m-9 4h12M5 21h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      title: "Email Automation",
      description: "Lead capture, customer follow-up, transactional messaging, and automated email workflows.",
      color: "bg-purple-500/10 border-purple-500/20",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80",
      icon: (
        <svg className="w-7 h-7 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l9 6 9-6m-18 8h18a2 2 0 002-2V8a2 2 0 00-2-2H3a2 2 0 00-2 2v6a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      title: "E-commerce Solutions",
      description: "Launch online stores, product management systems, and checkout flows that convert.",
      color: "bg-emerald-500/10 border-emerald-500/20",
      image: "https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&w=800&q=80",
      icon: (
        <svg className="w-7 h-7 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2m0 0L7 13h10l2-8H5.4zM7 13l-1.5 4.5A1 1 0 006.45 19H19m-11 0a1 1 0 100 2 1 1 0 000-2zm10 0a1 1 0 100 2 1 1 0 000-2z" />
        </svg>
      ),
    },
    {
      title: "Blockchain Solutions",
      description: "Smart contracts, Web3 integrations, and blockchain-powered business tools.",
      color: "bg-pink-500/10 border-pink-500/20",
      image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=800&q=80",
      icon: (
        <svg className="w-7 h-7 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2l7 4v12l-7 4-7-4V6l7-4zm0 0v20m7-16L5 18" />
        </svg>
      ),
    },
  ];

  const industries: IndustryItem[] = [
    {
      title: "Real Estate",
      description: "Property platforms, listing systems, CRM flows, and lead automation.",
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=600&q=80"
    },
    {
      title: "Logistics",
      description: "Operations dashboards, shipping workflows, and service request systems.",
      image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80"
    },
    {
      title: "E-commerce",
      description: "Online stores, order management, and payment-ready platforms.",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=600&q=80"
    },
    {
      title: "Education",
      description: "Learning portals, student systems, and intelligent educational tools.",
      image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=600&q=80"
    },
    {
      title: "Startups",
      description: "Fast MVP delivery, scalable architecture, and validation support.",
      image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=600&q=80"
    },
    {
      title: "Professional Services",
      description: "Modern websites, automation, and digital client experiences.",
      image: "https://images.unsplash.com/photo-1454165833767-1296b4ba2f0e?auto=format&fit=crop&w=600&q=80"
    },
  ];

  const processSteps: ProcessItem[] = [
    { step: "01", title: "Discovery", description: "We understand your business goals and what success looks like." },
    { step: "02", title: "Strategy", description: "We define the right digital solution and automation approach." },
    { step: "03", title: "Build", description: "We develop the platform or system using modern technologies." },
    { step: "04", title: "Launch", description: "We deploy and support your solution for long-term performance." },
  ];

  const faqs: FAQItem[] = [
    {
      question: "Who does AutoMATE Solutions work with?",
      answer: "We work with startups, founders, and growing businesses looking to improve operations with modern digital systems.",
    },
    {
      question: "What kind of projects can you build?",
      answer: "We build websites, dashboards, automation systems, bots, and custom business tools.",
    },
    {
      question: "Do you offer support after delivery?",
      answer: "Yes. We provide post-launch support and updates to keep your system reliable.",
    },
  ];

  const scrollToSection = (ref: React.RefObject<HTMLElement | null>) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
    setIsMenuOpen(false);
  };

  const navigateToSignup = () => {
    window.location.href = "/auth/signup";
  };

  const toggleFAQ = (index: number) => {
    setOpenFAQ((prev) => (prev === index ? null : index));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormStatus({ type: null, message: "" });
    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch("https://formsubmit.co/automatesolutions011@gmail.com", {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
      });
      if (!response.ok) throw new Error("Form submission failed");
      form.reset();
      setShowSuccessPopup(true);
      setFormStatus({ type: "success", message: "Thank you! We will get back to you soon." });
      setTimeout(() => setShowSuccessPopup(false), 8000);
    } catch (error) {
      setFormStatus({ type: "error", message: "Something went wrong. Please email us directly." });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroSlides.length]);

  return (
    <div className="min-h-screen bg-white text-gray-900 overflow-x-hidden">
      {/* HEADER SECTION */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-20 flex items-center justify-between">
            <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="text-left flex items-center gap-3">
              <img src="/automate-logo.png" alt="AutoMATE Solutions Logo" className="h-16 w-auto object-contain" />
            </button>
            <nav className="hidden md:flex items-center gap-7">
              <button onClick={() => scrollToSection(servicesRef)} className="text-slate-300 hover:text-white transition text-sm font-medium">Services</button>
              <button onClick={() => scrollToSection(credibilityRef)} className="text-slate-300 hover:text-white transition text-sm font-medium">Trust</button>
              <button onClick={() => scrollToSection(valuesRef)} className="text-slate-300 hover:text-white transition text-sm font-medium">Values</button>
              <button onClick={() => scrollToSection(productsRef)} className="text-slate-300 hover:text-white transition text-sm font-medium">Products</button>
              <button onClick={() => scrollToSection(industriesRef)} className="text-slate-300 hover:text-white transition text-sm font-medium">Industries</button>
              <button onClick={() => scrollToSection(faqRef)} className="text-slate-300 hover:text-white transition text-sm font-medium">FAQs</button>
            </nav>
            <button onClick={() => scrollToSection(contactRef)} className="hidden md:block rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500">
              Let's Talk
            </button>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 text-slate-200">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative pt-20">
        <div className="relative isolate overflow-hidden bg-slate-950 min-h-[90vh] flex items-center">
          <img 
            src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1920&q=80" 
            alt="Hero Background" 
            className="absolute inset-0 h-full w-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/20 via-slate-950/80 to-slate-950" />
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="grid lg:grid-cols-2 gap-12 items-center py-16">
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-white/5 px-4 py-2 text-sm text-blue-200 backdrop-blur">
                  <span className="h-2 w-2 rounded-full bg-blue-400 animate-pulse" />
                  Engineering the Future of Intelligent Business
                </div>
                <div className="mt-8 min-h-[280px]">
                  {heroSlides.map((slide, index) => (
                    <div key={index} className={currentSlide === index ? "block" : "hidden"}>
                      <div className="mb-4 inline-block rounded-full bg-blue-500/10 border border-blue-400/20 px-4 py-1 text-sm font-medium text-blue-200">{slide.accent}</div>
                      <h1 className="text-4xl sm:text-6xl font-black text-white leading-tight">{slide.title}</h1>
                      <p className="mt-6 text-lg text-slate-300 max-w-xl">{slide.subtitle}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                  <button onClick={() => scrollToSection(contactRef)} className="rounded-2xl bg-blue-600 px-8 py-4 text-white font-bold transition hover:scale-105">Start a Project</button>
                  <button onClick={() => scrollToSection(servicesRef)} className="rounded-2xl border border-white/20 bg-white/5 px-8 py-4 text-white font-bold backdrop-blur transition hover:bg-white/10">Explore Services</button>
                </div>
              </div>

              {/* STATS OVERLAY IMAGE */}
              <div className="relative hidden lg:block">
                <div className="rounded-[32px] overflow-hidden border border-white/10 shadow-2xl">
                   <img src="https://images.unsplash.com/photo-1551288049-bbbda5366392?auto=format&fit=crop&w=800&q=80" alt="Data Analytics" className="w-full h-80 object-cover opacity-60" />
                   <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] p-8 flex flex-col justify-end">
                      <h3 className="text-2xl font-bold text-white">Live Operations Dashboard</h3>
                      <p className="text-slate-300 text-sm mt-2">Scalable systems designed for data-driven decisions.</p>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST / CREDIBILITY */}
      <section ref={credibilityRef} className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80" alt="Team working" className="rounded-[40px] shadow-2xl" />
              <div className="absolute -bottom-6 -right-6 bg-blue-600 p-8 rounded-3xl text-white shadow-xl">
                 <p className="text-4xl font-black">50+</p>
                 <p className="text-sm opacity-80">Projects Delivered</p>
              </div>
            </div>
            <div>
              <div className="inline-flex rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm text-blue-700">Company Credibility</div>
              <h2 className="mt-5 text-4xl font-black text-gray-900">Trusted Digital Engineering Partner</h2>
              <p className="mt-6 text-lg text-gray-600 leading-relaxed">We help businesses bridge the gap between traditional operations and modern digital execution. We create systems that improve visibility and reduce manual work.</p>
              <div className="mt-8 grid sm:grid-cols-2 gap-4">
                {["Web Development", "AI Automation", "E-commerce", "Blockchain"].map((item) => (
                  <div key={item} className="flex items-center gap-3 p-4 rounded-2xl bg-gray-50 border border-gray-100 font-medium">
                    <div className="h-6 w-6 rounded-full bg-emerald-100 flex items-center justify-center">
                      <svg className="w-3 h-3 text-emerald-600" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/></svg>
                    </div>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES SECTION */}
      <section ref={servicesRef} className="py-24 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-sm text-blue-200">Our Services</div>
            <h2 className="mt-5 text-4xl font-black text-white">Digital solutions built for growth</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={index} className="group relative overflow-hidden rounded-3xl bg-slate-900 border border-white/5 p-8 hover:-translate-y-2 transition duration-500">
                <img src={service.image} className="absolute inset-0 h-full w-full object-cover opacity-0 group-hover:opacity-20 transition-opacity duration-500" alt={service.title} />
                <div className="relative z-10">
                  <div className="mb-6 h-14 w-14 rounded-2xl bg-slate-800 border border-white/10 flex items-center justify-center">{service.icon}</div>
                  <h3 className="text-2xl font-bold text-white">{service.title}</h3>
                  <p className="mt-4 text-slate-400 leading-relaxed">{service.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCT SECTION */}
      <section ref={productsRef} className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <div>
              <div className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-700">Featured Product</div>
              <h2 className="mt-5 text-4xl font-black text-gray-900">Launch your e-commerce store in minutes</h2>
              <p className="mt-6 text-lg text-gray-600">Move from idea to a functional online store with WhatsApp integration and management tools.</p>
              <div className="mt-10 flex gap-4">
                <button onClick={navigateToSignup} className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold shadow-lg hover:bg-blue-500">Create Your Store</button>
                <button onClick={() => scrollToSection(contactRef)} className="border border-gray-300 px-8 py-4 rounded-2xl font-bold hover:bg-gray-50">Request Demo</button>
              </div>
            </div>
            <div className="relative">
              <div className="rounded-[32px] bg-slate-950 p-4 shadow-2xl">
                <img src="/store.png" alt="Product Dashboard" className="rounded-[24px] w-full" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VALUES SECTION */}
      <section ref={valuesRef} className="py-24 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-gray-900">Our Core Values</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((v, i) => (
              <div key={i} className={`p-8 rounded-3xl border bg-gradient-to-br ${v.color}`}>
                <div className="mb-4">{v.icon}</div>
                <h3 className="text-xl font-bold text-gray-900">{v.title}</h3>
                <p className="mt-2 text-gray-600 text-sm">{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INDUSTRIES SECTION */}
      <section ref={industriesRef} className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16">
            <h2 className="text-4xl font-black text-gray-900">Industries We Serve</h2>
            <p className="text-gray-600 mt-4 text-lg">Tailored solutions for diverse business sectors.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {industries.map((ind, idx) => (
              <div key={idx} className="group relative h-80 overflow-hidden rounded-[32px] shadow-lg">
                <img src={ind.image} alt={ind.title} className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-8 flex flex-col justify-end">
                  <h3 className="text-2xl font-bold text-white">{ind.title}</h3>
                  <p className="text-slate-300 mt-2 text-sm">{ind.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS SECTION */}
      <section ref={processRef} className="py-24 bg-slate-950 relative overflow-hidden">
        <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1920&q=80" alt="Process" className="absolute inset-0 w-full h-full object-cover opacity-10" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-black text-white text-center mb-16">Our Implementation Process</h2>
          <div className="grid lg:grid-cols-4 gap-8">
            {processSteps.map((step, idx) => (
              <div key={idx} className="bg-white/5 backdrop-blur-md p-8 rounded-3xl border border-white/10 hover:bg-white/10 transition">
                <span className="text-blue-400 text-4xl font-black">{step.step}</span>
                <h3 className="text-xl font-bold text-white mt-4">{step.title}</h3>
                <p className="text-slate-400 mt-2">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOUNDER SECTION */}
      <section ref={founderRef} className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="bg-slate-900 rounded-[48px] overflow-hidden flex flex-col lg:flex-row">
              <div className="lg:w-1/2 p-12 lg:p-20 flex flex-col justify-center">
                 <div className="inline-flex rounded-full bg-orange-500/20 text-orange-400 px-4 py-2 text-sm font-bold mb-6 w-fit">Founder & Vision</div>
                 <h2 className="text-4xl font-black text-white mb-6">Building with purpose, delivering with precision</h2>
                 <p className="text-slate-400 text-lg leading-relaxed">AutoMATE Solutions was founded with a clear mission: to help businesses harness the power of technology without complexity.</p>
                 <div className="mt-10">
                    <h4 className="text-white font-bold text-xl">Kingsley Chinonso</h4>
                    <p className="text-blue-400">Lead Strategist</p>
                 </div>
              </div>
              <div className="lg:w-1/2 h-80 lg:h-auto">
                 <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1000&q=80" alt="Modern Office" className="w-full h-full object-cover" />
              </div>
           </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section ref={faqRef} className="py-24 bg-slate-50">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-4xl font-black text-gray-900 text-center mb-12">Common Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                <button onClick={() => toggleFAQ(i)} className="w-full p-6 text-left flex justify-between items-center font-bold">
                  {faq.question}
                  <span>{openFAQ === i ? "−" : "+"}</span>
                </button>
                {openFAQ === i && <div className="p-6 pt-0 text-gray-600 border-t border-gray-50">{faq.answer}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section ref={contactRef} className="py-24 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16">
            <div>
              <h2 className="text-5xl font-black text-white leading-tight">Let's build something valuable.</h2>
              <p className="text-slate-400 mt-6 text-xl">Tell us what you need, and we'll get back to you with the next steps.</p>
              <div className="mt-12 space-y-8">
                <div className="flex items-center gap-6">
                  <div className="h-14 w-14 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-500">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Email us</p>
                    <p className="text-white font-bold">automatesolutions011@gmail.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="h-14 w-14 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-500">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Visit us</p>
                    <p className="text-white font-bold">Enugu State, Nigeria</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white/5 p-8 rounded-[40px] border border-white/10">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <input type="text" name="firstName" placeholder="First Name" required className="w-full bg-slate-900 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-blue-500 transition" />
                  <input type="text" name="lastName" placeholder="Last Name" required className="w-full bg-slate-900 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-blue-500 transition" />
                </div>
                <input type="email" name="email" placeholder="Email Address" required className="w-full bg-slate-900 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-blue-500 transition" />
                <select name="service" required className="w-full bg-slate-900 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-blue-500 transition">
                  <option value="">Select a service</option>
                  <option value="web">Web Development</option>
                  <option value="automation">AI & Automation</option>
                  <option value="ecommerce">E-commerce</option>
                </select>
                <textarea name="message" rows={4} placeholder="Your Message" required className="w-full bg-slate-900 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-blue-500 transition"></textarea>
                <button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 py-5 rounded-2xl text-white font-bold hover:bg-blue-500 transition disabled:opacity-50">
                  {isSubmitting ? "Sending..." : "Send Message"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-black py-16 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <img src="/automate-logo.png" alt="Logo" className="h-16 mx-auto mb-8" />
          <p className="text-slate-500 text-sm">© {new Date().getFullYear()} AutoMATE Solutions. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
