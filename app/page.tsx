"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

function HomeContent() {
  const searchParams = useSearchParams();
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Invite state
  const [inviteData, setInviteData] = useState<{
    inviteId: string;
    inviteCount: number;
  } | null>(null);
  const [isAccepted, setIsAccepted] = useState(false);
  const [guestName, setGuestName] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  // Audio Control
  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  // Autoplay on mount
  useEffect(() => {
    const playAudio = async () => {
      if (audioRef.current) {
        try {
          await audioRef.current.play();
          setIsPlaying(true);
        } catch (error) {
          // Autoplay was prevented by browser
          console.log("Autoplay prevented. User interaction needed.");
        }
      }
    };
    playAudio();
  }, []);

  // Handle invite query parameter and localStorage
  useEffect(() => {
    const iParam = searchParams.get("i");
    if (!iParam) return;

    try {
      // Decode base64 and parse JSON
      const decoded = atob(iParam);
      const data = JSON.parse(decoded);

      if (data.invites && typeof data.invites === "number") {
        const inviteId = iParam; // Use the encoded param as unique ID
        const inviteCount = data.invites;

        setInviteData({ inviteId, inviteCount });

        // Check localStorage
        const storageKey = `invite_accepted_${inviteId}`;
        const accepted = localStorage.getItem(storageKey);

        if (accepted) {
          setIsAccepted(true);
        }
      }
    } catch (error) {
      console.error("Failed to parse invite parameter:", error);
    }
  }, [searchParams]);

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

  // Handle invite acceptance submission
  const handleInviteSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!inviteData) return;

    // Validate guest name
    if (!guestName.trim()) {
      alert("Por favor ingresa tu nombre");
      return;
    }

    if (!contactInfo.trim()) {
      alert("Por favor ingresa tu información de contacto");
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const response = await fetch("/api/invites/accept", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          invite_id: inviteData.inviteId,
          guest_name: guestName.trim(),
          contact_info: contactInfo.trim(),
          invite_count: inviteData.inviteCount,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit");
      }

      // Success - save to localStorage
      const storageKey = `invite_accepted_${inviteData.inviteId}`;
      localStorage.setItem(
        storageKey,
        JSON.stringify({ accepted: true, timestamp: Date.now() })
      );

      setIsAccepted(true);
      setSubmitStatus("success");
    } catch (error) {
      console.error("Error submitting invite:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Hidden Audio Element */}
      <audio ref={audioRef} loop>
        <source src="/audio.mp3" type="audio/mpeg" />
      </audio>

      {/* Navigation / Floating Audio Control */}
      <div className="fixed top-4 right-4 z-50">
        <button
          id="music-btn"
          onClick={toggleMusic}
          className="bg-white/80 backdrop-blur p-3 rounded-full shadow-lg border border-gold-400 text-gold-600 hover:scale-105 transition"
          aria-label={isPlaying ? "Pause music" : "Play music"}
        >
          {isPlaying ? (
            // Pause Icon
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
              <rect x="6" y="4" width="4" height="16" />
              <rect x="14" y="4" width="4" height="16" />
            </svg>
          ) : (
            // Play Icon
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
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          )}
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
            La familia Cabrera Galaviz presenta
          </p>
          <h2 className="font-montecarlo text-5xl md:text-5xl text-gray-800 mb-6 px-2">
            Aurora
          </h2>
          <h2 className="font-serif text-2xl md:text-2xl text-gold-600 mb-6 px-2">
            Guadalupe
          </h2>
          <div className="w-32 h-0.5 bg-gold-300 mx-auto my-6 rounded-full"></div>

          <h1 className="font-test text-1xl md:text-lg text-mint-800 mb-2 leading-tight drop-shadow-sm">
            XV AÑOS
          </h1>

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

      {/* 3. Family Section */}
      <section className=" py-20 px-4 bg-mint-100/60 relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-mint-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-gold-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 translate-x-1/2 translate-y-1/2"></div>

        <div className="max-w-3xl mx-auto text-center relative z-10">
          <div className="gsap-fade space-y-8">
            <div>
              <h3 className="font-script text-4xl md:text-5xl text-gold-600 mb-6">
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
              <h4 className="font-body uppercase tracking-widest text-gold-600 mb-4">
                Mis Padrinos
              </h4>
              <p className="font-serif text-lg text-gray-700">
                Oscar Galaviz y Carmen Fierro
              </p>
            </div>

            <div className="w-16 h-px bg-gold-400 mx-auto"></div>

            <div>
              <h4 className="font-body  uppercase tracking-widest text-gold-600 mb-4">
                Mi Chambelán
              </h4>
              <p className="font-serif text-lg text-gray-700">
                Diego Alonso Gallegos
              </p>
            </div>
          </div>
        </div>
      </section>

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
              <p className="text-gold-600 font-bold mb-4">Horario: 4:00 P.M.</p>
              <p className="text-gray-600 mb-6">
                Iglesia Santa Isabel del Portugal
              </p>
              <a
                href="https://www.google.com/maps/search/?api=1&query=Iglesia+Santa+Isabel+del+Portugal"
                target="_blank"
                className="inline-block px-6 py-2 border border-gold-400 text-gold-600 hover:bg-gold-400 hover:text-white transition rounded-full text-sm uppercase tracking-wider"
              >
                Como llegar
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
              <p className="text-gold-600 font-bold mb-4">Horario: 8:00 P.M.</p>
              <p className="text-gray-600 mb-6">Salón San Juan</p>
              <a
                href="https://www.google.com/maps/search/?api=1&query=Salon+San+Juan"
                target="_blank"
                className="inline-block px-6 py-2 border border-gold-400 text-gold-600 hover:bg-gold-400 hover:text-white transition rounded-full text-sm uppercase tracking-wider"
              >
                Como llegar
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
      <section className="relative py-16 bg-mint-800 text-white text-center z-10">
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
          <p className="font-script text-4xl mb-2 text-white">Semi-Formal</p>
          <p className="text-mint-200 text-sm"></p>
        </div>
      </section>

      {/* 7. Mesa de Regalos */}
      <section className="relative py-20 px-4 bg-white">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12 gsap-fade">
            <div className="ornament-divider">
              <span className="text-gold-400 text-2xl">✦</span>
            </div>
            <h2 className="font-script text-5xl text-mint-800 mb-4">
              Mesa de Regalos
            </h2>
            <p className="text-gray-600 mt-4">
              Tu presencia es nuestro mejor regalo, pero si deseas contribuir:
            </p>
          </div>

          <div className="gsap-slide-up bg-mint-50 p-8 md:p-10 rounded-xl border border-gold-400/30 shadow-lg">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-gold-400/10 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-gold-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
              </div>
            </div>

            <div className="space-y-4 text-center">
              <div>
                <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">
                  CLABE
                </p>
                <p className="font-mono text-lg md:text-xl font-bold text-mint-900 bg-white px-4 py-3 rounded border border-gold-400/20">
                  722969040860608416
                </p>
              </div>

              <div className="w-16 h-px bg-gold-400 mx-auto my-6"></div>

              <div>
                <p className="text-xs uppercase tracking-wider text-gray-500 mb-2">
                  Beneficiario
                </p>
                <p className="font-serif text-lg text-gray-700">
                  Lucero Abigail Galaviz Alcala
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wider text-gray-500 mb-2">
                  Institución
                </p>
                <p className="font-serif text-lg text-gold-600 font-semibold">
                  Mercado Pago W
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. RSVP / Invite Form */}
      <section id="rsvp" className="relative py-20 px-4 bg-mint-50">
        <div className="max-w-lg mx-auto bg-white p-8 md:p-10 rounded-xl shadow-xl border-t-4 border-gold-400 gsap-slide-up">
          {inviteData ? (
            <>
              <div className="text-center mb-8">
                <h2 className="font-script text-4xl text-mint-900">
                  Confirmar Asistencia
                </h2>
                <p className="text-gray-500 mt-2">
                  Por favor confirma antes del 1 de Diciembre
                </p>
                <div className="mt-4 inline-block bg-gold-50 border border-gold-400 rounded-full px-6 py-2">
                  <p className="text-gold-700 font-semibold">
                    Tienes {inviteData.inviteCount}{" "}
                    {inviteData.inviteCount === 1 ? "invitación" : "invitaciones"}{" "}
                    disponibles
                  </p>
                </div>
              </div>

              {isAccepted ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-8 h-8 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <h3 className="font-serif text-2xl text-mint-900 mb-2">
                    ¡Confirmación Recibida!
                  </h3>
                  <p className="text-gray-600">
                    Gracias por confirmar tu asistencia. ¡Nos vemos el 20 de
                    diciembre!
                  </p>
                </div>
              ) : (
                <form onSubmit={handleInviteSubmit} className="space-y-6">
                  {/* Guest Name */}
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">
                      Tu Nombre Completo *
                    </label>
                    <input
                      type="text"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      required
                      className="form-input w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:bg-white transition"
                      placeholder="Nombre completo"
                    />
                  </div>

                  {/* Contact Info */}
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">
                      Email o Teléfono de Contacto *
                    </label>
                    <input
                      type="text"
                      value={contactInfo}
                      onChange={(e) => setContactInfo(e.target.value)}
                      required
                      className="form-input w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:bg-white transition"
                      placeholder="ejemplo@email.com o 555-1234"
                    />
                  </div>

                  {/* Error Message */}
                  {submitStatus === "error" && (
                    <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
                      Hubo un error al enviar tu confirmación. Por favor
                      intenta de nuevo.
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full font-serif uppercase tracking-widest py-4 rounded transition duration-300 ${
                      isSubmitting
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-mint-800 text-white hover:bg-mint-900 border border-transparent hover:border-gold-400"
                    }`}
                  >
                    {isSubmitting ? "Enviando..." : "Confirmar Asistencia"}
                  </button>
                </form>
              )}
            </>
          ) : (
            <>
              <div className="text-center mb-8">
                <h2 className="font-script text-4xl text-mint-900">
                  Invitación Requerida
                </h2>
                <p className="text-gray-500 mt-4">
                  Esta página requiere un enlace de invitación válido para
                  confirmar tu asistencia.
                </p>
                <p className="text-gray-400 text-sm mt-2">
                  Si recibiste una invitación, por favor usa el enlace
                  proporcionado.
                </p>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative bg-mint-900 text-white py-12 text-center px-4">
        <h2 className="font-script text-4xl mb-4 text-gold-400">
          Aurora Guadalupe
        </h2>
        <p className="font-serif text-sm tracking-widest mb-8 text-white">
          20 DE DICIEMBRE DE 2025
        </p>
        <div className="text-xs text-white max-w-md mx-auto border-t border-mint-700 pt-6">
          <p>Gracias por ser parte de este momento tan especial en mi vida.</p>
        </div>
      </footer>
    </>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-mint-50" />}>
      <HomeContent />
    </Suspense>
  );
}
