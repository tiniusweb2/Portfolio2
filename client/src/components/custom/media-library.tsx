import { useState, useEffect } from "react";
import { MotionCard, MotionImage } from "@/lib/animations";
import { fadeIn } from "@/lib/animations";
import useEmblaCarousel from 'embla-carousel-react';
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ErrorBoundary } from "./error-boundary";

const mediaItems = [
  {
    id: 1,
    type: "image",
    url: "https://images.unsplash.com/photo-1597840900578-2c0798e868c3",
    title: "Retro Gaming Setup"
  },
  {
    id: 2,
    type: "image",
    url: "https://images.unsplash.com/photo-1597840900616-664e930c29df",
    title: "Classic Console"
  },
  {
    id: 3,
    type: "image",
    url: "https://images.unsplash.com/photo-1700152786633-d4d844e76887",
    title: "Vintage Tech"
  },
  {
    id: 4,
    type: "image",
    url: "https://images.unsplash.com/photo-1703041555997-f51216e6a532",
    title: "Retro Hardware"
  }
];

function CarouselContent() {
  const [selectedItem, setSelectedItem] = useState<number | null>(null);
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: 'start',
    slidesToScroll: 1
  });
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (emblaApi) {
      const onSelect = () => {
        setSelectedIndex(emblaApi.selectedScrollSnap());
      };

      emblaApi.on('select', onSelect);
      onSelect(); // Initial selection

      return () => {
        emblaApi.off('select', onSelect);
      };
    }
  }, [emblaApi]);

  return (
    <div className="relative">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {mediaItems.map((item) => (
            <div 
              key={item.id} 
              className="flex-[0_0_100%] min-w-0 md:flex-[0_0_33.33%] px-2"
            >
              <MotionCard
                variants={fadeIn}
                initial="initial"
                animate="animate"
                whileHover={{ scale: 1.05 }}
                className="ps2-card overflow-hidden cursor-pointer"
                onClick={() => setSelectedItem(item.id)}
              >
                <MotionImage
                  src={item.url}
                  alt={item.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-3">
                  <h3 className="text-blue-200">{item.title}</h3>
                </div>
              </MotionCard>
            </div>
          ))}
        </div>
      </div>

      {emblaApi && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70"
            onClick={() => emblaApi.scrollPrev()}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70"
            onClick={() => emblaApi.scrollNext()}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>

          <div className="flex justify-center gap-2 mt-4">
            {mediaItems.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === selectedIndex 
                    ? 'bg-blue-500' 
                    : 'bg-blue-200 hover:bg-blue-300'
                }`}
                onClick={() => emblaApi.scrollTo(index)}
              />
            ))}
          </div>
        </>
      )}

      {selectedItem && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          onClick={() => setSelectedItem(null)}
        >
          <MotionImage
            src={mediaItems.find(i => i.id === selectedItem)?.url}
            alt="Selected media"
            className="max-w-[90vw] max-h-[90vh] object-contain"
            variants={fadeIn}
            initial="initial"
            animate="animate"
            exit="exit"
          />
        </div>
      )}
    </div>
  );
}

export function MediaLibrary() {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-blue-300 mb-6 ps2-text-glow">
        Media Gallery
      </h2>

      <ErrorBoundary
        fallback={
          <div className="text-center p-4">
            <p className="text-blue-400">Unable to load media gallery.</p>
          </div>
        }
      >
        <CarouselContent />
      </ErrorBoundary>
    </div>
  );
}