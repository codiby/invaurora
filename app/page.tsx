"use client";

import { useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function Home() {
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Countdown Logic
  useEffect(() => {
    const updateCountdown = () => {
      const eventDate = new Date("December 20, 2025 00:00:00").getTime();
      const now = new Date().getTime();
      const gap = eventDate - now;

      const second = 1000;
      const minute = second * 60;
      const hour = minute * 60;
      const day = hour * 24;

      const d = Math.floor(gap / day);
      const h = Math.floor((gap % day) / hour);
      const m = Math.floor((gap % hour) / minute);
      const s = Math.floor((gap % minute) / second);

      setCountdown({
        days: d > 0 ? d : 0,
        hours: h > 0 ? h : 0,
        minutes: m > 0 ? m : 0,
        seconds: s > 0 ? s : 0,
      });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  // GSAP Animations
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Hero Animation
    gsap.from(".gsap-hero > *", {
      duration: 1.5,
      y: 50,
      opacity: 0,
      stagger: 0.2,
      ease: "power3.out",
    });

    // Fade Up Sections
    gsap.utils.toArray(".gsap-fade").forEach((element: any) => {
      gsap.from(element, {
        scrollTrigger: {
          trigger: element,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
        y: 30,
        opacity: 0,
        duration: 1,
        ease: "power2.out",
      });
    });

    // Cards Slide Up
    gsap.utils.toArray(".gsap-slide-up").forEach((element: any) => {
      gsap.from(element, {
        scrollTrigger: {
          trigger: element,
          start: "top 85%",
        },
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "back.out(1.7)",
      });
    });

    // Photo Gallery Stagger
    gsap.from(".gsap-photo", {
      scrollTrigger: {
        trigger: ".gsap-photo",
        start: "top 80%",
      },
      scale: 0.8,
      opacity: 0,
      stagger: 0.1,
      duration: 0.8,
      ease: "power2.out",
    });
  }, []);

  // RSVP Handling
  const handleRSVP = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const guests = formData.get("guests") as string;

    const btn = e.currentTarget.querySelector(
      'button[type="submit"]'
    ) as HTMLButtonElement;
    const originalText = btn.innerText;

    btn.innerText = "Enviando...";
    btn.disabled = true;

    setTimeout(() => {
      alert(
        `¡Gracias ${name}! Hemos recibido tu confirmación para ${guests} persona(s).`
      );
      btn.innerText = "¡Confirmado!";
      btn.classList.add("bg-green-700");
      e.currentTarget.reset();
    }, 1500);
  };

  return (
    <>
      {/* Navigation / Floating Audio Control */}
      <div className="fixed top-4 right-4 z-50">
        <button
          id="music-btn"
          className="bg-white/80 backdrop-blur p-3 rounded-full shadow-lg border border-gold-400 text-gold-600 hover:scale-105 transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 18V5l12-2v13" />
            <circle cx="6" cy="18" r="3" />
            <circle cx="18" cy="16" r="3" />
          </svg>
        </button>
      </div>

      {/* 1. Hero Section */}
      <header
        id="hero"
        className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 overflow-hidden"
      >
        {/* Background decoration */}
        <div className="fixed inset-0 bg-[url('/images/IMG_2626.jpg')] bg-cover bg-center opacity-40"></div>
        <div className="fixed inset-0 bg-gradient-to-b from-mint-50/80 via-mint-50/50 to-mint-50"></div>

        <div className="relative z-10 max-w-2xl mx-auto gsap-hero">
          <p className="font-serif tracking-[0.2em] text-gold-600 mb-4 text-sm uppercase">
            Estás invitado a los
          </p>
          <h1 className="font-script text-7xl md:text-9xl text-mint-800 mb-2 leading-tight drop-shadow-sm">
            XV Años
          </h1>
          <div className="w-24 h-1 bg-gold-400 mx-auto my-6 rounded-full"></div>
          <h2 className="font-serif text-3xl md:text-5xl text-gray-800 mb-6 px-2">
            Aurora Guadalupe <br /> Cabrera Galaviz
          </h2>
          <p className="font-serif text-xl text-gold-600 font-semibold tracking-widest">
            20 . 12 . 2025
          </p>
        </div>

        <div className="absolute bottom-10 animate-bounce text-gold-600">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </div>
      </header>

      {/* 2. Countdown Section */}
      <section className="py-16 px-4 bg-white relative">
        <div className="max-w-4xl mx-auto text-center gsap-fade">
          <div className="ornament-divider">
            <span className="text-gold-400 text-2xl">✦</span>
          </div>
          <h3 className="font-script text-4xl text-mint-800 mb-10">
            Falta poco para el gran día
          </h3>

          <div
            id="countdown"
            className="grid grid-cols-4 gap-2 md:gap-6 max-w-2xl mx-auto text-mint-900"
          >
            {/* Days */}
            <div className="flex flex-col items-center p-3 bg-mint-50 rounded-lg border border-gold-400/30 shadow-sm">
              <span
                id="days"
                className="font-serif text-2xl md:text-4xl font-bold"
              >
                {countdown.days}
              </span>
              <span className="text-xs md:text-sm uppercase tracking-widest mt-1 text-gold-600">
                Días
              </span>
            </div>
            {/* Hours */}
            <div className="flex flex-col items-center p-3 bg-mint-50 rounded-lg border border-gold-400/30 shadow-sm">
              <span
                id="hours"
                className="font-serif text-2xl md:text-4xl font-bold"
              >
                {countdown.hours}
              </span>
              <span className="text-xs md:text-sm uppercase tracking-widest mt-1 text-gold-600">
                Hrs
              </span>
            </div>
            {/* Minutes */}
            <div className="flex flex-col items-center p-3 bg-mint-50 rounded-lg border border-gold-400/30 shadow-sm">
              <span
                id="minutes"
                className="font-serif text-2xl md:text-4xl font-bold"
              >
                {countdown.minutes}
              </span>
              <span className="text-xs md:text-sm uppercase tracking-widest mt-1 text-gold-600">
                Min
              </span>
            </div>
            {/* Seconds */}
            <div className="flex flex-col items-center p-3 bg-mint-50 rounded-lg border border-gold-400/30 shadow-sm">
              <span
                id="seconds"
                className="font-serif text-2xl md:text-4xl font-bold"
              >
                {countdown.seconds}
              </span>
              <span className="text-xs md:text-sm uppercase tracking-widest mt-1 text-gold-600">
                Seg
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Family Section */}
      <section className="py-20 px-4 bg-mint-100/30 relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-mint-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-gold-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 translate-x-1/2 translate-y-1/2"></div>

        <div className="max-w-3xl mx-auto text-center relative z-10">
          <div className="gsap-fade space-y-8">
            <div>
              <h3 className="font-script text-4xl md:text-5xl text-mint-800 mb-6">
                Con la bendición de mis padres
              </h3>
              <p className="font-serif text-xl text-gray-700">
                Jorge Luis Cabrera Heras
              </p>
              <span className="text-gold-400 text-lg">&</span>
              <p className="font-serif text-xl text-gray-700">
                Lucero Abigail Galaviz Alcala
              </p>
            </div>

            <div className="w-16 h-px bg-gold-400 mx-auto"></div>

            <div>
              <h4 className="font-serif text-lg uppercase tracking-widest text-gold-600 mb-4">
                Mis Padrinos
              </h4>
              <p className="font-body text-lg text-gray-700">
                Oscar Galaviz y Carmen Fierro
              </p>
            </div>

            <div className="w-16 h-px bg-gold-400 mx-auto"></div>

            <div>
              <h4 className="font-serif text-lg uppercase tracking-widest text-gold-600 mb-4">
                Mi Chambelán
              </h4>
              <p className="font-body text-lg text-gray-700">
                Diego Alonso Gallegos
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Event Details */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16 gsap-fade">
            <span className="font-script text-3xl text-gold-600">
              Detalles del
            </span>
            <h2 className="font-serif text-4xl text-mint-900 mt-2">Evento</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 md:gap-12">
            {/* Ceremony Card */}
            <div className="gsap-slide-up bg-mint-50 p-8 rounded-tl-[3rem] rounded-br-[3rem] border border-mint-200 shadow-lg hover:shadow-xl transition duration-300 text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-gold-400">
                <svg
                  className="w-8 h-8 text-gold-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                  ></path>
                </svg>
              </div>
              <h3 className="font-serif text-2xl text-mint-900 mb-2">
                Ceremonia Religiosa
              </h3>
              <p className="text-gold-600 font-bold mb-4">Horario: Pendiente</p>
              <p className="text-gray-600 mb-6">
                Iglesia Santa Isabel del Portugal
              </p>
              <a
                href="https://www.google.com/maps/search/?api=1&query=Iglesia+Santa+Isabel+del+Portugal"
                target="_blank"
                className="inline-block px-6 py-2 border border-gold-400 text-gold-600 hover:bg-gold-400 hover:text-white transition rounded-full text-sm uppercase tracking-wider"
              >
                Ver Mapa
              </a>
            </div>

            {/* Reception Card */}
            <div className="gsap-slide-up bg-mint-50 p-8 rounded-tr-[3rem] rounded-bl-[3rem] border border-mint-200 shadow-lg hover:shadow-xl transition duration-300 text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-gold-400">
                <svg
                  className="w-8 h-8 text-gold-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"
                  ></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
              </div>
              <h3 className="font-serif text-2xl text-mint-900 mb-2">
                Recepción
              </h3>
              <p className="text-gold-600 font-bold mb-4">Horario: Pendiente</p>
              <p className="text-gray-600 mb-6">Salón San Juan</p>
              <a
                href="https://www.google.com/maps/search/?api=1&query=Salon+San+Juan"
                target="_blank"
                className="inline-block px-6 py-2 border border-gold-400 text-gold-600 hover:bg-gold-400 hover:text-white transition rounded-full text-sm uppercase tracking-wider"
              >
                Ver Mapa
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Gallery (Placeholder) */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 gsap-fade">
            <h2 className="font-script text-5xl text-mint-800">Galería</h2>
          </div>
          {/* Masonry Grid Placeholder */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 auto-rows-[200px]">
            <div className="gsap-photo row-span-2 rounded-lg overflow-hidden shadow-md victorian-frame">
              <img
                src="/images/IMG_2523.jpg"
                alt="Foto 1"
                className="w-full h-full object-cover hover:scale-110 transition duration-700"
              />
            </div>
            <div className="gsap-photo rounded-lg overflow-hidden shadow-md">
              <img
                src="/images/IMG_2535.jpg"
                alt="Foto 2"
                className="w-full h-full object-cover hover:scale-110 transition duration-700"
              />
            </div>
            <div className="gsap-photo row-span-2 rounded-lg overflow-hidden shadow-md">
              <img
                src="/images/IMG_2540.jpg"
                alt="Foto 3"
                className="w-full h-full object-cover hover:scale-110 transition duration-700"
              />
            </div>
            <div className="gsap-photo rounded-lg overflow-hidden shadow-md">
              <img
                src="/images/IMG_2542.jpg"
                alt="Foto 4"
                className="w-full h-full object-cover hover:scale-110 transition duration-700"
              />
            </div>
            <div className="gsap-photo col-span-2 md:col-span-1 rounded-lg overflow-hidden shadow-md">
              <img
                src="/images/IMG_2544.jpg"
                alt="Foto 5"
                className="w-full h-full object-cover scale-100 object-top hover:scale-110 transition duration-700"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 6. Dress Code */}
      <section className="py-16 bg-mint-800 text-white text-center">
        <div className="max-w-2xl mx-auto px-4 gsap-fade">
          <div className="w-16 h-16 mx-auto bg-white/10 rounded-full flex items-center justify-center mb-6">
            <svg
              className="w-8 h-8 text-gold-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7m18 0V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v7m18 0-9-5-9 5"
              ></path>
            </svg>
          </div>
          <h3 className="font-serif text-2xl uppercase tracking-widest mb-4 text-gold-100">
            Código de Vestimenta
          </h3>
          <p className="font-script text-4xl mb-2 text-white">
            Formal / Etiqueta
          </p>
          <p className="text-mint-200 text-sm">
            Sugerimos toques victorianos o colores pastel.
          </p>
        </div>
      </section>

      {/* 7. RSVP Form */}
      <section id="rsvp" className="py-20 px-4 bg-mint-50">
        <div className="max-w-lg mx-auto bg-white p-8 md:p-10 rounded-xl shadow-xl border-t-4 border-gold-400 gsap-slide-up">
          <div className="text-center mb-8">
            <h2 className="font-script text-4xl text-mint-900">
              Confirmar Asistencia
            </h2>
            <p className="text-gray-500 mt-2">
              Por favor confirma antes del 1 de Diciembre
            </p>
          </div>

          <form id="rsvpForm" onSubmit={handleRSVP} className="space-y-6">
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">
                Nombre Completo
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="form-input w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:bg-white transition"
                placeholder="Tu nombre"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">
                Número de Personas
              </label>
              <select
                id="guests"
                name="guests"
                className="form-input w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:bg-white transition"
              >
                <option value="1">1 Persona</option>
                <option value="2">2 Personas</option>
                <option value="3">3 Personas</option>
                <option value="4">4 Personas</option>
                <option value="5">Familia (5+)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">
                Mensaje para Aurora (Opcional)
              </label>
              <textarea
                id="message"
                name="message"
                rows={3}
                className="form-input w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:bg-white transition"
                placeholder="Escribe una felicitación..."
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-mint-800 text-white font-serif uppercase tracking-widest py-4 rounded hover:bg-mint-900 transition duration-300 border border-transparent hover:border-gold-400"
            >
              Enviar Confirmación
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-mint-900 text-mint-100 py-12 text-center px-4">
        <h2 className="font-script text-4xl mb-4 text-gold-400">
          Aurora Guadalupe
        </h2>
        <p className="font-serif text-sm tracking-widest opacity-70 mb-8">
          20 DE DICIEMBRE DE 2025
        </p>
        <div className="text-xs opacity-50 max-w-md mx-auto border-t border-mint-700 pt-6">
          <p>Gracias por ser parte de este momento tan especial en mi vida.</p>
        </div>
      </footer>
    </>
  );
}
