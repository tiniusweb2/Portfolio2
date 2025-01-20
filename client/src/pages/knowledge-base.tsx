import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Folder, File, Upload, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";

interface Folder {
  id: number;
  name: string;
  description: string | null;
  parentId: number | null;
  path: string;
}

interface File {
  id: number;
  name: string;
  description: string | null;
  folderId: number;
  fileType: string;
  fileUrl: string;
  size: number;
}

export default function KnowledgeBase() {
  const [selectedFolder, setSelectedFolder] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

  const { data: folders, isLoading: foldersLoading } = useQuery<Folder[]>({
    queryKey: ["/api/knowledge-base/folders"],
  });

  const { data: files, isLoading: filesLoading } = useQuery<File[]>({
    queryKey: ["/api/knowledge-base/files", selectedFolder],
    enabled: selectedFolder !== null,
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400">
            Knowledge Base
          </h1>
          <Button
            onClick={() => setUploadDialogOpen(true)}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500"
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6">
          {/* Sidebar with folder tree */}
          <Card className="md:col-span-3 p-3 sm:p-4">
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search files..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 w-full"
                />
              </div>
            </div>
            <div className="space-y-1 sm:space-y-2">
              {foldersLoading ? (
                <>
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </>
              ) : folders?.length === 0 ? (
                <p className="text-sm text-muted-foreground p-2">No folders found</p>
              ) : (
                folders?.map((folder) => (
                  <button
                    key={folder.id}
                    onClick={() => setSelectedFolder(folder.id)}
                    className={`w-full text-left px-2 sm:px-3 py-2 rounded-md flex items-center space-x-2 hover:bg-accent transition-colors ${
                      selectedFolder === folder.id
                        ? "bg-accent text-accent-foreground"
                        : ""
                    }`}
                  >
                    <Folder className="w-4 h-4 flex-shrink-0" />
                    <span className="text-sm truncate">{folder.name}</span>
                  </button>
                ))
              )}
            </div>
          </Card>

          {/* Main content area */}
          <div className="md:col-span-9">
            <Card className="p-4 sm:p-6">
              {selectedFolder === null ? (
                <div className="text-center text-muted-foreground p-8">
                  <Folder className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Select a folder to view its contents</p>
                </div>
              ) : filesLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-24 w-full" />
                  ))}
                </div>
              ) : files?.length === 0 ? (
                <div className="text-center text-muted-foreground p-8">
                  <File className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No files in this folder</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {files?.map((file) => (
                    <Card
                      key={file.id}
                      className="p-3 sm:p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start space-x-3">
                        <File className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <h3 className="font-medium text-sm sm:text-base truncate">
                            {file.name}
                          </h3>
                          <p className="text-xs sm:text-sm text-muted-foreground">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>

      {/* Upload Dialog */}
      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upload File</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              Upload feature coming soon...
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}