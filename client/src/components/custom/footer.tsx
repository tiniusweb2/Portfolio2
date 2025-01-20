import { Github, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative border-t overflow-hidden">
      {/* Gradient background with particle animation */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20">
        <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)' }} />
        {/* Add particle animation here if needed */}
      </div>

      <div className="container relative flex flex-col items-center gap-6 py-12 md:h-32 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 md:items-start">
          <p className="text-center text-sm leading-loose text-foreground md:text-left md:pl-8">
            Tinius Troldmyr
            <br />
            <span className="text-muted-foreground">
              Underhaugsveien 1A, 0354 Oslo
            </span>
          </p>
        </div>
        <div className="md:ml-auto flex items-center space-x-6 pr-8">
          <a
            href="https://www.linkedin.com/in/tinius-troldmyr-l-536269237"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground hover:text-primary transition-colors"
          >
            <Linkedin className="h-6 w-6" />
            <span className="sr-only">LinkedIn</span>
          </a>
          <a
            href="https://github.com/tiniusweb2"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground hover:text-primary transition-colors"
          >
            <Github className="h-6 w-6" />
            <span className="sr-only">GitHub</span>
          </a>
        </div>
      </div>
    </footer>
  );
}