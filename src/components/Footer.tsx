import { Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border/50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-muted-foreground text-sm flex items-center justify-center gap-1">
          © {new Date().getFullYear()} Faizan Shah. Built with
          <Heart size={14} className="text-primary" />
        </p>
      </div>
    </footer>
  );
};

export default Footer;
