import { Code2, Palette, Server, Smartphone } from "lucide-react";

interface AboutSectionProps {
  content: Record<string, string>;
}

const features = [
  { icon: Code2, title: "Clean Code", desc: "Writing maintainable, scalable code" },
  { icon: Palette, title: "UI/UX Design", desc: "Beautiful, intuitive interfaces" },
  { icon: Server, title: "Backend Dev", desc: "Robust server-side solutions" },
  { icon: Smartphone, title: "Responsive", desc: "Perfect on every device" },
];

const AboutSection = ({ content }: AboutSectionProps) => {
  return (
    <section id="about" className="relative">
      <div className="section-container">
        <h2 className="text-3xl md:text-4xl font-heading font-bold text-center mb-4 neon-text">
          About Me
        </h2>
        <div className="w-20 h-1 bg-primary mx-auto mb-12 rounded-full" />

        <div className="max-w-3xl mx-auto mb-16">
          <p className="text-muted-foreground text-lg leading-relaxed text-center">
            {content.about_text || "I am a passionate developer."}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f) => (
            <div key={f.title} className="glass-card p-6 text-center group hover:border-primary/30 transition-all duration-300">
              <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <f.icon className="text-primary" size={26} />
              </div>
              <h3 className="font-heading text-sm font-semibold mb-2 text-foreground">{f.title}</h3>
              <p className="text-muted-foreground text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
