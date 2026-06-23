'use client';

import { gsap } from 'gsap';
import { MessageCircleMore, Sparkles } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

export default function FloatingChatButton() {
  const router = useRouter();
  const pathname = usePathname();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const shineRef = useRef<HTMLDivElement>(null);

  const [tooltipText, setTooltipText] = useState('احجز غرفتك الآن');

  const tooltipMessages = ['Book Now', 'Ask for the best price', 'AI Booking Asistance'];

  useEffect(() => {
    const btn = buttonRef.current;
    const ring = ringRef.current;
    const badge = badgeRef.current;
    const tooltip = tooltipRef.current;
    const shine = shineRef.current;
    const wrapper = wrapperRef.current;

    if (!btn || !ring || !badge || !tooltip || !shine || !wrapper) return;

    // دخول أولي للزر
    gsap.fromTo(
      wrapper,
      { y: 80, opacity: 0, scale: 0.7 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 1,
        ease: 'back.out(1.8)',
      },
    );

    // ظهور التولتيب
    gsap.fromTo(
      tooltip,
      { opacity: 0, y: 12, scale: 0.95 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        delay: 0.6,
        ease: 'power3.out',
      },
    );

    // نبض الهالة الخارجية
    gsap.to(ring, {
      scale: 1.35,
      opacity: 0,
      duration: 1.8,
      repeat: -1,
      ease: 'power1.out',
    });

    // حركة خفيفة للزر نفسه
    gsap.to(btn, {
      y: -6,
      duration: 2.2,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });

    // Badge صغيرة فيها لمعة
    gsap.to(badge, {
      scale: 1.08,
      duration: 0.9,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });

    // لمعان يمر على الزر
    gsap.fromTo(
      shine,
      { x: -120, opacity: 0 },
      {
        x: 160,
        opacity: 0.55,
        duration: 1.2,
        repeat: -1,
        repeatDelay: 2.8,
        ease: 'power2.out',
      },
    );

    // حركة لفت انتباه كل فترة
    const idleTimeline = gsap.timeline({ repeat: -1, repeatDelay: 4.5 });
    idleTimeline
      .to(btn, {
        rotate: -8,
        duration: 0.16,
        ease: 'power1.inOut',
      })
      .to(btn, {
        rotate: 8,
        duration: 0.16,
        ease: 'power1.inOut',
      })
      .to(btn, {
        rotate: -5,
        duration: 0.14,
        ease: 'power1.inOut',
      })
      .to(btn, {
        rotate: 0,
        duration: 0.14,
        ease: 'power1.inOut',
      });

    // تبديل نص التولتيب كل 3.5 ثانية
    let index = 0;
    const textInterval = setInterval(() => {
      index = (index + 1) % tooltipMessages.length;

      gsap.to(tooltip, {
        opacity: 0,
        y: 8,
        duration: 0.22,
        onComplete: () => {
          setTooltipText(tooltipMessages[index]);
          gsap.fromTo(
            tooltip,
            { opacity: 0, y: 8 },
            { opacity: 1, y: 0, duration: 0.28, ease: 'power2.out' },
          );
        },
      });
    }, 3500);

    return () => {
      clearInterval(textInterval);
      idleTimeline.kill();
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const btn = buttonRef.current;
    if (!btn) return;

    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const moveX = (x - rect.width / 2) * 0.18;
    const moveY = (y - rect.height / 2) * 0.18;

    gsap.to(btn, {
      x: moveX,
      y: moveY,
      duration: 0.28,
      ease: 'power3.out',
    });
  };

  const handleMouseLeave = () => {
    const btn = buttonRef.current;
    if (!btn) return;

    gsap.to(btn, {
      x: 0,
      y: 0,
      duration: 0.45,
      ease: 'elastic.out(1, 0.4)',
    });
  };

  const handleClick = () => {
    const btn = buttonRef.current;
    const wrapper = wrapperRef.current;
    if (!btn || !wrapper) {
      router.push('/chat');
      return;
    }

    const tl = gsap.timeline({
      onComplete: () => router.push('/chat'),
    });

    tl.to(btn, {
      scale: 0.88,
      duration: 0.12,
      ease: 'power2.out',
    })
      .to(btn, {
        scale: 1.08,
        duration: 0.18,
        ease: 'back.out(2.5)',
      })
      .to(
        wrapper,
        {
          y: -8,
          duration: 0.16,
          yoyo: true,
          repeat: 1,
          ease: 'power1.inOut',
        },
        0,
      )
      .to(btn, {
        boxShadow: '0 0 0 18px rgba(212,175,55,0)',
        duration: 0.5,
        ease: 'power2.out',
      });
  };
  const hideOnChatPage = pathname === '/chat' || pathname.startsWith('/chat/');

  if (hideOnChatPage) return null;
  return (
    <div
      ref={wrapperRef}
      className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end gap-3"
      dir="rtl"
    >
      {/* Tooltip */}
      <div
        ref={tooltipRef}
        className="pointer-events-none rounded-2xl border border-white/20 bg-white/95 px-4 py-3 text-sm font-medium text-slate-800 shadow-[0_12px_35px_rgba(0,0,0,0.16)] backdrop-blur"
      >
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-amber-500" />
          <span>{tooltipText}</span>
        </div>
      </div>

      {/* Button Area */}
      <div className="relative">
        {/* Outer animated ring */}
        <div ref={ringRef} className="absolute inset-0 rounded-full bg-amber-400/40 blur-md" />

        {/* Small badge */}
        <div ref={badgeRef}></div>

        {/* Main Button */}
        <button
          ref={buttonRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onClick={handleClick}
          aria-label="اذهب إلى الشات"
          className="group relative flex h-[72px] w-[72px] items-center justify-center overflow-hidden rounded-full border border-white/15 bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-700 shadow-[0_18px_50px_rgba(0,0,0,0.35)] transition-transform"
        >
          {/* Inner glow */}
          <div className="absolute inset-[4px] rounded-full bg-gradient-to-br from-white/10 to-transparent" />

          {/* Shine sweep */}
          <div
            ref={shineRef}
            className="pointer-events-none absolute top-0 left-[-120px] h-full w-10 rotate-12 bg-white/40 blur-md"
          />

          {/* Icon */}
          <div className="relative z-10 flex items-center justify-center">
            <MessageCircleMore className="h-8 w-8 text-white drop-shadow" />
          </div>

          {/* Soft hover overlay */}
          <div className="absolute inset-0 rounded-full bg-white/0 transition duration-300 group-hover:bg-white/5" />
        </button>
      </div>
    </div>
  );
}
