import { useState } from "react";
import { MotionCard } from "@/lib/animations";
import { fadeIn } from "@/lib/animations";
import useEmblaCarousel from 'embla-carousel-react';
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ErrorBoundary } from "./error-boundary";
import { BlogArticleModal } from "./blog-article-modal";
import { SelectBlogPost } from "@/../../db/schema";
import { useQuery } from "@tanstack/react-query";

export function BlogGallery() {
  const [selectedArticle, setSelectedArticle] = useState<SelectBlogPost | null>(null);
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: 'start',
    slidesToScroll: 1
  });

  const { data: articles, isLoading } = useQuery<SelectBlogPost[]>({
    queryKey: ["/api/blog/posts"],
  });

  if (isLoading) {
    return (
      <div className="p-4">
        <h2 className="text-2xl font-bold text-blue-600 dark:text-blue-300 mb-6 ps2-text-glow">
          Blog Articles
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <MotionCard
              key={i}
              className="h-64 animate-pulse bg-blue-100 dark:bg-blue-900"
            />
          ))}
        </div>
      </div>
    );
  }

  if (!articles?.length) {
    return (
      <div className="p-4 text-center">
        <h2 className="text-2xl font-bold text-blue-600 dark:text-blue-300 mb-6 ps2-text-glow">
          Blog Articles
        </h2>
        <p className="text-blue-400">No articles published yet.</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-blue-600 dark:text-blue-300 mb-6 ps2-text-glow">
        Blog Articles
      </h2>

      <ErrorBoundary>
        <div className="relative">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {articles.map((article) => (
                <div 
                  key={article.id} 
                  className="flex-[0_0_100%] min-w-0 md:flex-[0_0_33.33%] px-2"
                >
                  <MotionCard
                    variants={fadeIn}
                    initial="initial"
                    animate="animate"
                    whileHover={{ scale: 1.05 }}
                    className="ps2-card overflow-hidden cursor-pointer h-64"
                    onClick={() => setSelectedArticle(article)}
                  >
                    {article.thumbnailUrl && (
                      <div 
                        className="w-full h-32 bg-cover bg-center"
                        style={{ backgroundImage: `url(${article.thumbnailUrl})` }}
                      />
                    )}
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-2">
                        {article.title}
                      </h3>
                      <p className="text-sm text-blue-800 dark:text-blue-200 line-clamp-2">
                        {article.preview}
                      </p>
                    </div>
                  </MotionCard>
                </div>
              ))}
            </div>
          </div>

          {emblaApi && articles.length > 3 && (
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
            </>
          )}

          <BlogArticleModal
            article={selectedArticle}
            isOpen={!!selectedArticle}
            onClose={() => setSelectedArticle(null)}
          />
        </div>
      </ErrorBoundary>
    </div>
  );
}