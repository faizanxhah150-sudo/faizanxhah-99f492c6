import defaultProfileImg from "@/assets/profile-placeholder.jpg";
import { ArrowDown, Github, Mail, Linkedin } from "lucide-react";

interface HeroSectionProps {
  content: Record<string, string>;
}

const HeroSection = ({ content }: HeroSectionProps) => {
  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center grid-pattern overflow-hidden">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background" />
      
      <div className="relative z-10 section-container text-center">
        <div className="animate-fade-in-up">
          {/* Profile image */}
          <div className="mx-auto mb-8 w-40 h-40 md:w-48 md:h-48 profile-glow animate-glow-pulse overflow-hidden">
            <img
              src={content.profile_image_url || defaultProfileImg}
              alt="Faizan xhah"
              className="w-full h-full object-cover rounded-full"
            />
          </div>

          {/* Text */}
          <p className="text-primary font-mono text-sm md:text-base mb-3 tracking-widest uppercase">
            {"< Hello World />"}
          </p>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold mb-4 neon-text">
            {content.hero_title || "Faizan Shah"}
          </h1>
          <p className="text-xl md:text-2xl text-foreground/80 font-light mb-6 max-w-2xl mx-auto">
            {content.hero_subtitle || "Full Stack Developer"}
          </p>
          <p className="text-muted-foreground max-w-xl mx-auto mb-10 leading-relaxed">
            {content.hero_description || "I build exceptional digital experiences."}
          </p>

          {/* CTA */}
          <div className="flex items-center justify-center gap-4 mb-12">
            <a href="#projects" className="neon-button px-8 py-3 rounded-lg text-sm">
              View My Work
            </a>
            <a href="#contact" className="px-8 py-3 rounded-lg text-sm font-heading font-semibold tracking-wider uppercase border border-primary/30 text-primary hover:bg-primary/10 transition-colors">
              Contact Me
            </a>
          </div>

          {/* Social links */}
          <div className="flex items-center justify-center gap-6">
            <a href="https://github.com/faizanxhah150-sudo" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
              <Github size={22} />
            </a>
            <a href="mailto:faizanxhah150@gmail.com" className="text-muted-foreground hover:text-primary transition-colors">
              <Mail size={22} />
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              <Linkedin size={22} />
            </a>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ArrowDown className="text-primary/50" size={24} />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
