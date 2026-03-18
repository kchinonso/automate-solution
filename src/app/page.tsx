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
      description:
        "Professional websites, dashboards, portals, and custom web apps built for real business needs and growth.",
      color: "bg-blue-500/10 border-blue-500/20",
      icon: (
        <svg className="w-7 h-7 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M4 5h16a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V7a2 2 0 012-2z" />
        </svg>
      ),
    },
    {
      title: "AI & Business Automation",
      description:
        "Automate repetitive workflows, simplify operations, and improve team productivity using smart systems.",
      color: "bg-cyan-500/10 border-cyan-500/20",
      icon: (
        <svg className="w-7 h-7 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 3v2.25M14.25 3v2.25M9 9h6m-9 8.25h12A2.25 2.25 0 0020.25 15V9A2.25 2.25 0 0018 6.75H6A2.25 2.25 0 003.75 9v6A2.25 2.25 0 006 17.25z" />
        </svg>
      ),
    },
    {
      title: "Bot Development",
      description:
        "Custom WhatsApp bots, support bots, lead-generation bots, and automated customer interaction systems.",
      color: "bg-orange-500/10 border-orange-500/20",
      icon: (
        <svg className="w-7 h-7 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2m-9 4h12M5 21h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      title: "Email Automation",
      description:
        "Lead capture, customer follow-up, transactional messaging, and automated email workflows that stay consistent.",
      color: "bg-purple-500/10 border-purple-500/20",
      icon: (
        <svg className="w-7 h-7 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l9 6 9-6m-18 8h18a2 2 0 002-2V8a2 2 0 00-2-2H3a2 2 0 00-2 2v6a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      title: "E-commerce Solutions",
      description:
        "Launch online stores, product management systems, checkout flows, and order processes that convert visitors into buyers.",
      color: "bg-emerald-500/10 border-emerald-500/20",
      icon: (
        <svg className="w-7 h-7 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2m0 0L7 13h10l2-8H5.4zM7 13l-1.5 4.5A1 1 0 006.45 19H19m-11 0a1 1 0 100 2 1 1 0 000-2zm10 0a1 1 0 100 2 1 1 0 000-2z" />
        </svg>
      ),
    },
    {
      title: "Blockchain Solutions",
      description:
        "Smart contracts, Web3 integrations, and blockchain-powered business tools built with reliability and security in mind.",
      color: "bg-pink-500/10 border-pink-500/20",
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
    },
    {
      title: "Logistics",
      description: "Operations dashboards, shipping workflows, and service request systems.",
    },
    {
      title: "E-commerce",
      description: "Online stores, order management, product systems, and payment-ready platforms.",
    },
    {
      title: "Education",
      description: "Learning portals, student systems, and intelligent educational tools.",
    },
    {
      title: "Startups",
      description: "Fast MVP delivery, scalable architecture, and product validation support.",
    },
    {
      title: "Professional Services",
      description: "Modern websites, automation, lead capture, and digital client experiences.",
    },
  ];

  const processSteps: ProcessItem[] = [
    {
      step: "01",
      title: "Discovery",
      description:
        "We understand your business goals, pain points, and what success should look like.",
    },
    {
      step: "02",
      title: "Strategy",
      description:
        "We define the right digital solution, user flow, and automation approach for your needs.",
    },
    {
      step: "03",
      title: "Build",
      description:
        "We design and develop the platform, workflow, or system using modern technologies.",
    },
    {
      step: "04",
      title: "Launch & Support",
      description:
        "We deploy, refine, and support your solution so it continues to perform effectively.",
    },
  ];

  const faqs: FAQItem[] = [
    {
      question: "Who does AutoMATE Solutions work with?",
      answer:
        "We work with startups, founders, growing businesses, e-commerce brands, service-based businesses, and organizations looking to improve operations with modern digital systems.",
    },
    {
      question: "What kind of projects can you build?",
      answer:
        "We build websites, dashboards, e-commerce platforms, automation systems, WhatsApp bots, email workflows, smart contract solutions, and custom business tools tailored to your use case.",
    },
    {
      question: "How fast can we get started?",
      answer:
        "We can begin discussions immediately. Smaller solutions can start very quickly, while custom projects typically begin after a short discovery and planning phase.",
    },
    {
      question: "Do you offer support after delivery?",
      answer:
        "Yes. We provide post-launch support, updates, and technical guidance to help keep your system reliable and useful after deployment.",
    },
    {
      question: "Can you help improve an existing business platform?",
      answer:
        "Yes. If you already have a website, dashboard, or workflow, we can audit it, redesign it, add new features, improve performance, and automate manual processes.",
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
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Form submission failed");
      }

      form.reset();
      setShowSuccessPopup(true);
      setFormStatus({
        type: "success",
        message: "Thank you for your message! We will get back to you soon.",
      });

      setTimeout(() => {
        setShowSuccessPopup(false);
      }, 8000);
    } catch (error) {
      setFormStatus({
        type: "error",
        message:
          "Something went wrong. Please try again or email us directly at automatesolutions011@gmail.com",
      });
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
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-20 flex items-center justify-between">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="text-left"
            >
              <div className="text-white font-black tracking-tight text-2xl">AutoMATE Solutions</div>
              <div className="text-xs text-slate-400 -mt-0.5">AI • Automation • Digital Systems</div>
            </button>

            <nav className="hidden md:flex items-center gap-7">
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="text-slate-300 hover:text-white transition"
              >
                Home
              </button>
              <button
                onClick={() => scrollToSection(servicesRef)}
                className="text-slate-300 hover:text-white transition"
              >
                Services
              </button>
              <button
                onClick={() => scrollToSection(credibilityRef)}
                className="text-slate-300 hover:text-white transition"
              >
                Trust
              </button>
              <button
                onClick={() => scrollToSection(valuesRef)}
                className="text-slate-300 hover:text-white transition"
              >
                Values
              </button>
              <button
                onClick={() => scrollToSection(productsRef)}
                className="text-slate-300 hover:text-white transition"
              >
                Products
              </button>
              <button
                onClick={() => scrollToSection(industriesRef)}
                className="text-slate-300 hover:text-white transition"
              >
                Industries
              </button>
              <button
                onClick={() => scrollToSection(faqRef)}
                className="text-slate-300 hover:text-white transition"
              >
                FAQs
              </button>
            </nav>

            <div className="hidden md:flex items-center gap-3">
              <button
                onClick={() => scrollToSection(contactRef)}
                className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-500"
              >
                Let’s Talk
              </button>
            </div>

            <button
              onClick={() => setIsMenuOpen((prev) => !prev)}
              className="md:hidden inline-flex items-center justify-center rounded-lg border border-slate-700 bg-slate-900 p-2 text-slate-200"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            </button>
          </div>

          {isMenuOpen && (
            <div className="md:hidden pb-5">
              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-3 space-y-2">
                <button
                  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                  className="block w-full rounded-xl px-4 py-3 text-left text-slate-300 hover:bg-slate-800 hover:text-white"
                >
                  Home
                </button>
                <button
                  onClick={() => scrollToSection(servicesRef)}
                  className="block w-full rounded-xl px-4 py-3 text-left text-slate-300 hover:bg-slate-800 hover:text-white"
                >
                  Services
                </button>
                <button
                  onClick={() => scrollToSection(credibilityRef)}
                  className="block w-full rounded-xl px-4 py-3 text-left text-slate-300 hover:bg-slate-800 hover:text-white"
                >
                  Trust
                </button>
                <button
                  onClick={() => scrollToSection(valuesRef)}
                  className="block w-full rounded-xl px-4 py-3 text-left text-slate-300 hover:bg-slate-800 hover:text-white"
                >
                  Values
                </button>
                <button
                  onClick={() => scrollToSection(productsRef)}
                  className="block w-full rounded-xl px-4 py-3 text-left text-slate-300 hover:bg-slate-800 hover:text-white"
                >
                  Products
                </button>
                <button
                  onClick={() => scrollToSection(industriesRef)}
                  className="block w-full rounded-xl px-4 py-3 text-left text-slate-300 hover:bg-slate-800 hover:text-white"
                >
                  Industries
                </button>
                <button
                  onClick={() => scrollToSection(faqRef)}
                  className="block w-full rounded-xl px-4 py-3 text-left text-slate-300 hover:bg-slate-800 hover:text-white"
                >
                  FAQs
                </button>
                <button
                  onClick={() => scrollToSection(contactRef)}
                  className="mt-2 w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-500"
                >
                  Let’s Talk
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {showSuccessPopup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">
            <div className="text-center">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                <svg className="h-10 w-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="mb-4 text-2xl font-bold text-gray-900">Message Sent Successfully</h3>
              <p className="mb-6 text-gray-600">
                Thank you for reaching out to AutoMATE Solutions. We have received your message and will get back to you shortly.
              </p>
              <button
                onClick={() => setShowSuccessPopup(false)}
                className="w-full rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-500"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <section className="relative pt-24">
        <div className="relative isolate overflow-hidden bg-slate-950">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-30"
            style={{ backgroundImage: `url("/image.webp")` }}
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.25),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(147,51,234,0.22),transparent_30%)]" />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/30 via-slate-950/65 to-slate-950" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[92vh] flex items-center">
            <div className="grid lg:grid-cols-2 gap-12 items-center w-full py-16">
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-white/5 px-4 py-2 text-sm text-blue-200 backdrop-blur">
                  <span className="h-2 w-2 rounded-full bg-blue-400 animate-pulse" />
                  Engineering the Future of Intelligent Business
                </div>

                {/* Fixed hero section with proper spacing */}
                <div className="mt-8 min-h-[280px]">
                  {heroSlides.map((slide, index) => (
                    <div
                      key={index}
                      className={`transition-all duration-700 ${
                        currentSlide === index ? "block" : "hidden"
                      }`}
                    >
                      <div className="mb-4 inline-block rounded-full bg-blue-500/10 border border-blue-400/20 px-4 py-1 text-sm font-medium text-blue-200">
                        {slide.accent}
                      </div>
                      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight text-white">
                        {slide.title}
                      </h1>
                      <p className="mt-6 text-lg sm:text-xl leading-relaxed text-slate-300 max-w-2xl">
                        {slide.subtitle}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Buttons now properly positioned below the text */}
                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={() => scrollToSection(contactRef)}
                    className="inline-flex items-center justify-center rounded-2xl bg-blue-600 px-7 py-4 text-base font-semibold text-white shadow-xl shadow-blue-600/20 transition hover:bg-blue-500 hover:scale-105"
                  >
                    Start a Project
                  </button>

                  <button
                    onClick={() => scrollToSection(servicesRef)}
                    className="inline-flex items-center justify-center rounded-2xl border border-white/20 bg-white/5 px-7 py-4 text-base font-semibold text-white backdrop-blur transition hover:bg-white/10 hover:scale-105"
                  >
                    Explore Services
                  </button>
                </div>

                <div className="mt-8 flex items-center gap-3">
                  {heroSlides.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      aria-label={`Go to slide ${index + 1}`}
                      className={`h-3 rounded-full transition-all duration-300 ${
                        currentSlide === index ? "w-10 bg-blue-500" : "w-3 bg-white/40 hover:bg-white/60"
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="relative">
                <div className="rounded-[28px] border border-white/10 bg-white/5 p-4 backdrop-blur-xl shadow-2xl shadow-black/30">
                  <div className="rounded-[24px] border border-white/10 bg-slate-900/80 p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <p className="text-sm text-slate-400">AutoMATE Intelligence Suite</p>
                        <h3 className="text-2xl font-bold text-white">Modern systems for modern business</h3>
                      </div>
                      <div className="rounded-2xl bg-blue-500/10 px-3 py-2 text-sm text-blue-300 border border-blue-500/20">
                        Live Workflow
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                        <p className="text-sm text-slate-400">Automation</p>
                        <p className="mt-2 text-2xl font-bold text-white">24/7</p>
                        <p className="mt-2 text-sm text-slate-300">Always-on systems for operations and customer engagement.</p>
                      </div>
                      <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                        <p className="text-sm text-slate-400">Deployment Focus</p>
                        <p className="mt-2 text-2xl font-bold text-white">Fast</p>
                        <p className="mt-2 text-sm text-slate-300">From idea to launch with modern, scalable delivery.</p>
                      </div>
                      <div className="col-span-2 rounded-2xl border border-white/10 bg-gradient-to-r from-blue-600/15 to-purple-600/15 p-5">
                        <p className="text-sm text-slate-300">Solutions We Deliver</p>
                        <h4 className="mt-1 text-xl font-bold text-white">
                          Websites • Bots • Automation • E-commerce • Web3
                        </h4>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="absolute -top-5 -right-4 rounded-2xl border border-blue-400/20 bg-blue-500/10 px-4 py-3 text-sm text-blue-200 backdrop-blur">
                  Premium Digital Execution
                </div>
                <div className="absolute -bottom-5 -left-4 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200 backdrop-blur">
                  Built for Business Growth
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-10 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { value: "AI", label: "Powered business workflows" },
              { value: "24/7", label: "Automation availability" },
              { value: "Fast", label: "Project execution mindset" },
              { value: "Scalable", label: "Built for long-term growth" },
            ].map((item, index) => (
              <div
                key={index}
                className="rounded-2xl border border-gray-200 bg-gray-50 px-6 py-6 text-center hover:shadow-md transition hover:border-blue-200"
              >
                <div className="text-2xl md:text-3xl font-black text-gray-900">{item.value}</div>
                <div className="mt-2 text-sm md:text-base text-gray-600">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section ref={credibilityRef} className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm text-blue-700">
                Company Credibility
              </div>
              <h2 className="mt-5 text-4xl md:text-5xl font-black text-gray-900">
                Trusted Digital Engineering Partner
              </h2>
              <p className="mt-6 text-lg text-gray-600 leading-relaxed">
                AutoMATE Solutions helps businesses build reliable digital products, automate workflows, and create systems designed for long-term growth.
              </p>

              <div className="mt-8 grid sm:grid-cols-2 gap-4">
                {[
                  "Web Development",
                  "AI Automation",
                  "Business Process Systems",
                  "E-commerce Platforms",
                  "Blockchain Solutions",
                  "Bot Development",
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-4 shadow-sm hover:shadow-md transition">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100">
                      <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="font-medium text-gray-800">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-xl">
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl bg-slate-950 p-6 hover:scale-105 transition">
                  <p className="text-sm text-slate-400">Execution</p>
                  <h4 className="mt-2 text-2xl font-bold text-white">Modern</h4>
                </div>
                <div className="rounded-2xl bg-blue-600 p-6 hover:scale-105 transition">
                  <p className="text-sm text-blue-100">Approach</p>
                  <h4 className="mt-2 text-2xl font-bold text-white">Strategic</h4>
                </div>
                <div className="rounded-2xl bg-emerald-600 p-6 hover:scale-105 transition">
                  <p className="text-sm text-emerald-100">Systems</p>
                  <h4 className="mt-2 text-2xl font-bold text-white">Scalable</h4>
                </div>
                <div className="rounded-2xl bg-purple-600 p-6 hover:scale-105 transition">
                  <p className="text-sm text-purple-100">Partnership</p>
                  <h4 className="mt-2 text-2xl font-bold text-white">Reliable</h4>
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-gray-200 bg-gray-50 p-6">
                <p className="text-sm text-gray-500">What clients look for</p>
                <p className="mt-2 text-lg font-semibold text-gray-900">
                  Professional execution, clear communication, strong systems, and solutions that actually support business growth.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative py-24 bg-slate-950 overflow-hidden">
        <div className="absolute inset-0 opacity-15 bg-cover bg-center" style={{ backgroundImage: `url("https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=2072&q=80")` }} />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-900/90" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-sm text-blue-200">
            Our Mission
          </div>
          <h2 className="mt-6 text-4xl md:text-5xl font-black text-white">
            Driving Digital Excellence for Modern Businesses
          </h2>
          <p className="mt-6 text-lg md:text-xl text-slate-300 leading-relaxed max-w-4xl mx-auto">
            At AutoMATE Solutions, we help businesses bridge the gap between traditional operations and modern digital execution.
            We create systems that improve visibility, reduce manual work, and position businesses for smarter growth.
          </p>
        </div>
      </section>

      <section ref={valuesRef} className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm text-blue-700">
              Our Values
            </div>
            <h2 className="mt-5 text-4xl md:text-5xl font-black text-gray-900">
              Principles that shape how we build
            </h2>
            <p className="mt-5 text-lg text-gray-600 leading-relaxed">
              We combine strategy, design, development, and automation with a clear focus on usefulness, trust, and long-term value.
            </p>
          </div>

          <div className="mt-14 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((item, index) => (
              <div
                key={index}
                className={`rounded-3xl border bg-gradient-to-br ${item.color} bg-white p-7 shadow-sm hover:shadow-lg transition hover:-translate-y-1`}
              >
                <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900">{item.title}</h3>
                <p className="mt-3 text-gray-600 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section ref={servicesRef} className="py-24 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-sm text-blue-200">
              Our Services
            </div>
            <h2 className="mt-5 text-4xl md:text-5xl font-black text-white">
              Digital solutions built to move your business forward
            </h2>
            <p className="mt-5 text-lg text-slate-300 leading-relaxed">
              We help businesses launch, automate, and improve digital systems with practical engineering and growth-focused execution.
            </p>
          </div>

          <div className="mt-14 grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <div
                key={index}
                className={`group rounded-3xl border ${service.color} bg-slate-900 p-7 hover:-translate-y-1 transition duration-300 hover:shadow-xl`}
              >
                <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-800 border border-white/10">
                  {service.icon}
                </div>
                <h3 className="text-2xl font-bold text-white">{service.title}</h3>
                <p className="mt-4 text-slate-300 leading-relaxed">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section ref={productsRef} className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <div>
              <div className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-700">
                Featured Product
              </div>
              <h2 className="mt-5 text-4xl md:text-5xl font-black text-gray-900">
                Launch your e-commerce store in minutes
              </h2>
              <p className="mt-6 text-lg text-gray-600 leading-relaxed">
                AutoMATE Solutions makes it easier for businesses to get online quickly with a streamlined store setup, management tools, and customer-ready experience.
              </p>

              <div className="mt-8 space-y-5">
                {[
                  {
                    title: "Fast Store Setup",
                    text: "Move from idea to a functional online store without unnecessary complexity.",
                  },
                  {
                    title: "WhatsApp Integration",
                    text: "Connect customers directly to your business for faster communication and order handling.",
                  },
                  {
                    title: "Management Dashboard",
                    text: "Monitor products, orders, and store activities from one centralized interface.",
                  },
                  {
                    title: "Growth-Ready Design",
                    text: "Built with branding, usability, and long-term scalability in mind.",
                  },
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100">
                      <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{item.title}</h3>
                      <p className="mt-1 text-gray-600">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <button
                  onClick={navigateToSignup}
                  className="inline-flex items-center justify-center rounded-2xl bg-blue-600 px-7 py-4 text-base font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-500 hover:scale-105"
                >
                  Create Your Store Now
                </button>

                <button
                  onClick={() => scrollToSection(contactRef)}
                  className="inline-flex items-center justify-center rounded-2xl border border-gray-300 px-7 py-4 text-base font-semibold text-gray-900 transition hover:bg-gray-50 hover:scale-105"
                >
                  Request a Demo
                </button>
              </div>
            </div>

            <div className="relative">
              <div className="rounded-[30px] border border-gray-200 bg-slate-950 p-5 shadow-2xl">
                <div className="rounded-[24px] overflow-hidden border border-white/10 bg-slate-900">
                  <img
                    src="/store.png"
                    alt="AutoMATE Solutions store dashboard preview"
                    className="w-full h-auto object-cover"
                  />
                </div>
                <p className="mt-4 text-center text-sm text-slate-400">
                  Store dashboard preview for product management, operations, and growth
                </p>
              </div>

              <div className="absolute -top-4 -right-4 rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-lg animate-pulse">
                FAST SETUP
              </div>
              <div className="absolute -bottom-4 -left-4 rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-lg animate-pulse">
                GROWTH READY
              </div>
            </div>
          </div>
        </div>
      </section>

      <section ref={industriesRef} className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex rounded-full border border-purple-200 bg-purple-50 px-4 py-2 text-sm text-purple-700">
              Industries We Serve
            </div>
            <h2 className="mt-5 text-4xl md:text-5xl font-black text-gray-900">
              Built for businesses across multiple sectors
            </h2>
            <p className="mt-5 text-lg text-gray-600">
              Our solutions are flexible enough to support different industries while staying tailored to each client's unique workflow and goals.
            </p>
          </div>

          <div className="mt-14 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {industries.map((industry, index) => (
              <div
                key={index}
                className="rounded-3xl border border-gray-200 bg-white p-7 shadow-sm hover:shadow-lg transition hover:-translate-y-1"
              >
                <h3 className="text-xl font-bold text-gray-900">{industry.title}</h3>
                <p className="mt-3 text-gray-600 leading-relaxed">{industry.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section ref={processRef} className="py-24 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-200">
              How We Work
            </div>
            <h2 className="mt-5 text-4xl md:text-5xl font-black text-white">
              A clear process from idea to execution
            </h2>
            <p className="mt-5 text-lg text-slate-300">
              We keep projects focused, practical, and business-driven from the first conversation to launch.
            </p>
          </div>

          <div className="mt-14 grid md:grid-cols-2 xl:grid-cols-4 gap-6">
            {processSteps.map((step, index) => (
              <div
                key={index}
                className="rounded-3xl border border-white/10 bg-white/5 p-7 backdrop-blur hover:scale-105 transition"
              >
                <div className="text-4xl font-black text-blue-400">{step.step}</div>
                <h3 className="mt-4 text-2xl font-bold text-white">{step.title}</h3>
                <p className="mt-3 text-slate-300 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section ref={founderRef} className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="rounded-[32px] border border-gray-200 bg-slate-50 p-8 shadow-sm">
              <div className="flex items-center justify-center h-56 rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 text-white text-center px-6">
                <div>
                  <p className="text-sm text-slate-400">Founder & Lead Strategist</p>
                  <h3 className="mt-3 text-3xl font-black">Kingsley Chinonso</h3>
                  <p className="mt-3 text-slate-300">
                    Building practical systems for digital transformation, automation, and growth since 2020.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <div className="inline-flex rounded-full border border-orange-200 bg-orange-50 px-4 py-2 text-sm text-orange-700">
                Leadership & Vision
              </div>
              <h2 className="mt-5 text-4xl md:text-5xl font-black text-gray-900">
                Building with purpose, delivering with precision
              </h2>
              <p className="mt-6 text-lg text-gray-600 leading-relaxed">
                AutoMATE Solutions was founded with a clear mission: to help businesses harness the power of modern technology without complexity. Our approach combines technical expertise with practical business thinking—every line of code, every automation workflow, and every system we build is designed to solve real operational challenges.
              </p>
              <p className="mt-4 text-lg text-gray-600 leading-relaxed">
                We don't just build software; we build partnerships. Our team works alongside clients to understand their unique needs, delivering solutions that don't just work today but scale for tomorrow. This human-centered, results-driven philosophy is what sets AutoMATE Solutions apart in the digital engineering landscape.
              </p>

              <div className="mt-8 grid sm:grid-cols-2 gap-4">
                {[
                  "8+ years combined experience",
                  "50+ successful projects delivered",
                  "100% client satisfaction rate",
                  "24/7 post-launch support",
                ].map((item, index) => (
                  <div key={index} className="rounded-2xl border border-gray-200 bg-white px-4 py-4 shadow-sm hover:shadow-md transition">
                    <span className="font-medium text-gray-800">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section ref={faqRef} className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm text-blue-700">
              Frequently Asked Questions
            </div>
            <h2 className="mt-5 text-4xl md:text-5xl font-black text-gray-900">
              Answers to common questions
            </h2>
            <p className="mt-5 text-lg text-gray-600">
              Everything you need to know about working with AutoMATE Solutions.
            </p>
          </div>

          <div className="mt-14 space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="overflow-hidden rounded-3xl border border-gray-200 bg-gray-50">
                <button
                  onClick={() => toggleFAQ(index)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left hover:bg-gray-100 transition"
                >
                  <span className="text-lg font-semibold text-gray-900">{faq.question}</span>
                  <span
                    className={`flex h-10 w-10 items-center justify-center rounded-full bg-white border border-gray-200 transition-all duration-300 ${
                      openFAQ === index ? "rotate-180 bg-blue-50 border-blue-200" : ""
                    }`}
                  >
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </button>

                <div className={`${openFAQ === index ? "block" : "hidden"} px-6 pb-6`}>
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section ref={contactRef} className="py-24 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-14">
            <div className="inline-flex rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-sm text-blue-200">
              Contact Us
            </div>
            <h2 className="mt-5 text-4xl md:text-5xl font-black text-white">
              Let's build something valuable for your business
            </h2>
            <p className="mt-5 text-lg text-slate-300">
              Tell us what you need, and we'll get back to you with the next steps.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-10">
            <div className="space-y-6">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-7">
                <h3 className="text-2xl font-bold text-white mb-4">Get in Touch</h3>
                <p className="text-slate-300 leading-relaxed">
                  Whether you need a professional website, a custom platform, automation workflow, WhatsApp bot, or an e-commerce solution, AutoMATE Solutions is ready to help.
                </p>
              </div>
              
              <div className="rounded-3xl border border-white/10 bg-white/5 p-7">
                <h3 className="text-2xl font-bold text-white mb-4">Contact Information</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <span className="text-slate-300">automatesolutions011@gmail.com</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <span className="text-slate-300">+234 904 036 0635</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <span className="text-slate-300">Enugu State, Nigeria</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-[32px] border border-white/10 bg-white/5 p-8 backdrop-blur">
              <h3 className="text-2xl font-bold text-white mb-6">Send us a Message</h3>

              {formStatus.type === "success" && (
                <div className="mb-6 rounded-2xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-green-200">
                  {formStatus.message}
                </div>
              )}

              {formStatus.type === "error" && (
                <div className="mb-6 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-red-200">
                  {formStatus.message}
                </div>
              )}

              <form
                onSubmit={handleSubmit}
                method="POST"
                action="https://formsubmit.co/automatesolutions011@gmail.com"
                className="space-y-5"
              >
                <input type="hidden" name="_subject" value="New Contact Form Submission - AutoMATE Solutions" />
                <input type="hidden" name="_template" value="table" />
                <input type="hidden" name="_captcha" value="false" />
                <input type="hidden" name="_honey" style={{ display: "none" }} />

                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="firstName" className="mb-2 block text-sm font-medium text-slate-300">
                      First Name *
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      required
                      disabled={isSubmitting}
                      placeholder="John"
                      className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white placeholder:text-slate-500 outline-none transition focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="lastName" className="mb-2 block text-sm font-medium text-slate-300">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      required
                      disabled={isSubmitting}
                      placeholder="Doe"
                      className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white placeholder:text-slate-500 outline-none transition focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-300">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    disabled={isSubmitting}
                    placeholder="john@example.com"
                    className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white placeholder:text-slate-500 outline-none transition focus:border-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="mb-2 block text-sm font-medium text-slate-300">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    disabled={isSubmitting}
                    placeholder="+234 123 456 7890"
                    className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white placeholder:text-slate-500 outline-none transition focus:border-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="service" className="mb-2 block text-sm font-medium text-slate-300">
                    Service Interest *
                  </label>
                  <select
                    id="service"
                    name="service"
                    required
                    disabled={isSubmitting}
                    className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-blue-500"
                  >
                    <option value="">Select a service</option>
                    <option value="web-development">Web Development</option>
                    <option value="automation">AI & Business Automation</option>
                    <option value="ecommerce">E-commerce Solution</option>
                    <option value="bot-development">Bot Development</option>
                    <option value="email-automation">Email Automation</option>
                    <option value="blockchain">Blockchain Solution</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="mb-2 block text-sm font-medium text-slate-300">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    required
                    disabled={isSubmitting}
                    placeholder="Tell us about your project, what you want to build, or what you want to improve..."
                    className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white placeholder:text-slate-500 outline-none transition focus:border-blue-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-2xl bg-blue-600 px-6 py-4 font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60 hover:scale-[1.02]"
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </button>

                <p className="text-center text-xs text-slate-400">
                  By submitting this form, you agree to be contacted by AutoMATE Solutions regarding your inquiry.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 bg-black py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-10">
            <div className="md:col-span-2">
              <h3 className="text-2xl font-black text-white">AutoMATE Solutions</h3>
              <p className="mt-4 max-w-md text-slate-400 leading-relaxed">
                We help businesses automate operations, launch modern digital products, and build systems that support growth.
              </p>
            </div>

            <div>
              <h4 className="text-lg font-bold text-white">Quick Links</h4>
              <ul className="mt-4 space-y-3">
                <li><button onClick={() => scrollToSection(servicesRef)} className="text-slate-400 hover:text-white transition">Services</button></li>
                <li><button onClick={() => scrollToSection(credibilityRef)} className="text-slate-400 hover:text-white transition">Trust</button></li>
                <li><button onClick={() => scrollToSection(valuesRef)} className="text-slate-400 hover:text-white transition">Values</button></li>
                <li><button onClick={() => scrollToSection(contactRef)} className="text-slate-400 hover:text-white transition">Contact</button></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-bold text-white">Contact</h4>
              <ul className="mt-4 space-y-3 text-slate-400">
                <li className="hover:text-white transition">automatesolutions011@gmail.com</li>
                <li className="hover:text-white transition">+234 904 036 0635</li>
                <li className="hover:text-white transition">Enugu State, Nigeria</li>
              </ul>
            </div>
          </div>

          <div className="mt-10 border-t border-white/10 pt-8 text-center text-slate-500 text-sm">
            © {new Date().getFullYear()} AutoMATE Solutions. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
