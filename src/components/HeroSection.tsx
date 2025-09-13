import { Button } from "@/components/ui/button";
import { ArrowRight, Code, Brain } from "lucide-react";
import ScrollVideoCanvas from "./ScrollVideoCanvas";

const HeroSection = () => {
  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <ScrollVideoCanvas />
      {/* Overlay */}
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-primary/50 via-primary/20 to-transparent" />

      {/* Content */}
      <div className="relative container mx-auto px-4 text-center text-white">
        <div className="max-w-5xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-8 fade-in-up">
            <Code className="w-4 h-4" />
            <span className="text-sm font-medium">15 лет в веб-разработке</span>
            <Brain className="w-4 h-4" />
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold font-geist mb-6 leading-tight fade-in-up stagger-1">
            Веб-мастер &
            <br />
            <span className="text-accent hero-text-glow">AI-интегратор</span>
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed fade-in-up stagger-2">
            Создаю сайты, которые работают. 15 лет опыта + современные AI-технологии = 
            быстрые, умные и адаптивные веб-решения для вашего бизнеса
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center fade-in-up stagger-3">
            <Button 
              size="lg" 
              variant="default"
              onClick={() => scrollToSection('#portfolio')}
              className="bg-accent hover:bg-accent/90 text-accent-foreground px-8 py-4 text-lg font-medium gap-2 hover-glow"
            >
              Посмотреть работы
              <ArrowRight className="w-5 h-5" />
            </Button>
            
            <Button 
              size="lg" 
              variant="outline" 
              onClick={() => scrollToSection('#contact')}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20 px-8 py-4 text-lg font-medium backdrop-blur-sm"
            >
              Написать мне
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 fade-in-up stagger-4">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-accent mb-2">15+</div>
              <div className="text-sm text-white/80">Лет опыта</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-accent mb-2">200+</div>
              <div className="text-sm text-white/80">Проектов</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-accent mb-2">50+</div>
              <div className="text-sm text-white/80">AI интеграций</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-accent mb-2">99%</div>
              <div className="text-sm text-white/80">Довольных клиентов</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/60 animate-bounce">
        <div className="w-1 h-16 bg-gradient-to-b from-white/60 to-transparent rounded-full"></div>
      </div>
    </section>
  );
};

export default HeroSection;
