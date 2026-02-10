interface Skill {
  id: string;
  name: string;
  category: string;
  proficiency: number;
}

interface SkillsSectionProps {
  skills: Skill[];
}

const SkillsSection = ({ skills }: SkillsSectionProps) => {
  const categories = [...new Set(skills.map((s) => s.category))];

  return (
    <section id="skills" className="relative">
      <div className="section-container">
        <h2 className="text-3xl md:text-4xl font-heading font-bold text-center mb-4 neon-text">
          Skills & Expertise
        </h2>
        <div className="w-20 h-1 bg-primary mx-auto mb-12 rounded-full" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {categories.map((cat) => (
            <div key={cat} className="glass-card p-6">
              <h3 className="font-heading text-sm font-semibold mb-6 text-primary tracking-wider uppercase">
                {cat}
              </h3>
              <div className="space-y-5">
                {skills
                  .filter((s) => s.category === cat)
                  .map((skill) => (
                    <div key={skill.id}>
                      <div className="flex justify-between mb-2">
                        <span className="text-foreground text-sm font-medium">{skill.name}</span>
                        <span className="text-primary text-sm font-mono">{skill.proficiency}%</span>
                      </div>
                      <div className="h-2.5 bg-secondary rounded-full overflow-hidden">
                        <div
                          className="progress-neon"
                          style={{ width: `${skill.proficiency}%` }}
                        />
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
