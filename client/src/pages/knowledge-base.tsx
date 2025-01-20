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
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400">
            Knowledge Base
          </h1>
          <Button
            onClick={() => setUploadDialogOpen(true)}
            className="bg-blue-600 hover:bg-blue-500"
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Sidebar with folder tree */}
          <Card className="md:col-span-3 p-4">
            <div className="mb-4">
              <Input
                placeholder="Search files..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
                prefix={<Search className="w-4 h-4 text-muted-foreground" />}
              />
            </div>
            <div className="space-y-2">
              {foldersLoading ? (
                <p>Loading folders...</p>
              ) : (
                folders?.map((folder) => (
                  <button
                    key={folder.id}
                    onClick={() => setSelectedFolder(folder.id)}
                    className={`w-full text-left px-3 py-2 rounded-md flex items-center space-x-2 hover:bg-accent ${
                      selectedFolder === folder.id
                        ? "bg-accent text-accent-foreground"
                        : ""
                    }`}
                  >
                    <Folder className="w-4 h-4" />
                    <span>{folder.name}</span>
                  </button>
                ))
              )}
            </div>
          </Card>

          {/* Main content area */}
          <div className="md:col-span-9">
            <Card className="p-6">
              {selectedFolder === null ? (
                <div className="text-center text-muted-foreground">
                  Select a folder to view its contents
                </div>
              ) : filesLoading ? (
                <p>Loading files...</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {files?.map((file) => (
                    <Card
                      key={file.id}
                      className="p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start space-x-3">
                        <File className="w-8 h-8 text-blue-500" />
                        <div>
                          <h3 className="font-medium">{file.name}</h3>
                          <p className="text-sm text-muted-foreground">
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload File</DialogTitle>
          </DialogHeader>
          {/* Upload form will go here */}
        </DialogContent>
      </Dialog>
    </div>
  );
}
