import { useEffect, useState, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { cn } from '@/lib/utils';

import coffeeLatte from '@/assets/coffee-latte.jpg';
import caramelMacchiato from '@/assets/caramel-macchiato.jpg';
import spaghettiCreamy from '@/assets/spaghetti-creamy.jpg';
import matchaLatte from '@/assets/matcha-latte.jpg';

const promos = [
  {
    id: 1,
    title: 'Diskon 17%',
    description: 'Buat Kamu yang Punya Nama Bertema Kemerdekaan!',
    image: coffeeLatte,
    gradient: 'from-primary via-primary/90 to-primary/70',
  },
  {
    id: 2,
    title: 'Beli 2 Gratis 1',
    description: 'Promo spesial untuk semua varian Macchiato!',
    image: caramelMacchiato,
    gradient: 'from-amber-600 via-amber-500 to-orange-500',
  },
  {
    id: 3,
    title: 'Paket Hemat',
    description: 'Spaghetti + Minuman hanya Rp 55.000',
    image: spaghettiCreamy,
    gradient: 'from-orange-600 via-orange-500 to-amber-500',
  },
  {
    id: 4,
    title: 'New! Matcha Latte',
    description: 'Coba menu baru dengan diskon 20% minggu ini!',
    image: matchaLatte,
    gradient: 'from-primary/80 via-primary to-amber-600',
  },
];

export const PromoCarousel = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: 'start' },
    [Autoplay({ delay: 4000, stopOnInteraction: false })]
  );
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, onSelect]);

  const scrollTo = useCallback(
    (index: number) => {
      if (emblaApi) emblaApi.scrollTo(index);
    },
    [emblaApi]
  );

  return (
    <div className="relative">
      <div className="overflow-hidden rounded-2xl" ref={emblaRef}>
        <div className="flex">
          {promos.map((promo) => (
            <div
              key={promo.id}
              className="flex-[0_0_100%] min-w-0"
            >
              <div
                className={cn(
                  "relative bg-gradient-to-r rounded-2xl p-5 h-[140px] overflow-hidden",
                  promo.gradient
                )}
              >
                {/* Decorative circles */}
                <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 -translate-x-1/2" />
                <div className="absolute bottom-0 right-20 w-20 h-20 bg-white/5 rounded-full translate-y-1/2" />
                
                {/* Content */}
                <div className="relative z-10 flex items-center justify-between h-full">
                  <div className="flex-1 pr-4">
                    <h3 className="text-primary-foreground font-bold text-2xl mb-2 drop-shadow-lg">
                      {promo.title}
                    </h3>
                    <p className="text-primary-foreground/90 text-sm leading-relaxed max-w-[180px]">
                      {promo.description}
                    </p>
                  </div>
                  
                  {/* Product Image */}
                  <div className="relative w-28 h-28 flex-shrink-0">
                    <div className="absolute inset-0 bg-black/20 rounded-full blur-xl transform translate-y-2" />
                    <img
                      src={promo.image}
                      alt={promo.title}
                      className="relative w-full h-full object-cover rounded-full border-4 border-white/20 shadow-2xl"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dot Indicators */}
      <div className="flex justify-center gap-2 mt-4">
        {promos.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            className={cn(
              "w-2 h-2 rounded-full transition-all duration-300",
              selectedIndex === index
                ? "bg-primary w-6"
                : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
