import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import SkillsSection from "@/components/SkillsSection";
import ProjectsSection from "@/components/ProjectsSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import { useSiteContent, useProjects, useSkills } from "@/hooks/use-portfolio-data";

const Index = () => {
  const { data: content = {} } = useSiteContent();
  const { data: projects = [] } = useProjects();
  const { data: skills = [] } = useSkills();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection content={content} />
      <AboutSection content={content} />
      <SkillsSection skills={skills as any} />
      <ProjectsSection projects={projects as any} />
      <ContactSection content={content} />
      <Footer />
    </div>
  );
};

export default Index;
