import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SelectBlogPost } from "@/../../db/schema";
import { format } from "date-fns";

interface BlogArticleModalProps {
  article: SelectBlogPost | null;
  isOpen: boolean;
  onClose: () => void;
}

export function BlogArticleModal({ article, isOpen, onClose }: BlogArticleModalProps) {
  if (!article) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {article.title}
          </DialogTitle>
          <div className="text-sm text-muted-foreground">
            Published on {format(new Date(article.publishedAt), "MMMM d, yyyy")}
          </div>
        </DialogHeader>
        <ScrollArea className="h-full pr-4">
          <div className="prose dark:prose-invert max-w-none">
            {article.content.split("\n").map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
