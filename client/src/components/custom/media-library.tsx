import { useState } from "react";
import { MotionCard, MotionImage } from "@/lib/animations";
import { fadeIn } from "@/lib/animations";

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

export function MediaLibrary() {
  const [selectedItem, setSelectedItem] = useState<number | null>(null);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-blue-300 mb-6 ps2-text-glow">
        Media Gallery
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {mediaItems.map((item) => (
          <MotionCard
            key={item.id}
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
        ))}
      </div>

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
