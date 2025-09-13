import { useState } from "react";
import { Award, Star, Calendar } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useIsMobile } from "@/hooks/use-mobile";

const AwardSection = () => {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();
  return (
    <section className="py-24 section-bg" data-animate>
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-success/10 text-success rounded-full border border-success/20 mb-6">
              <Award className="w-4 h-4" />
              <span className="text-sm font-medium">Признание</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold font-geist mb-6">
              Награды и достижения
            </h2>
            <p className="text-xl text-muted-foreground">
              Профессиональное признание и вклад в развитие отрасли
            </p>
          </div>

          {/* Award Card */}
          <div className="bg-card rounded-2xl border border-border/50 overflow-hidden shadow-lg hover-lift">
            <div className="grid md:grid-cols-2 gap-8 p-8">
              {/* Award Image */}
              <div className="order-2 md:order-1">
                {isMobile ? (
                  <div className="overflow-hidden">
                    <img src="/20150915_preview.jpg" alt="Почетная грамота" width="300" height="425" className="object-cover rounded-md" />
                  </div>
                ) : (
                  <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger asChild>
                      <div className="overflow-hidden cursor-pointer">
                        <img src="/20150915_preview.jpg" alt="Почетная грамота" width="300" height="425" className="object-cover rounded-md hover:opacity-90 transition-opacity" />
                      </div>
                    </DialogTrigger>
                    <DialogContent className="w-auto max-w-none p-6">
                      <DialogHeader>
                        <DialogTitle>Почетная грамота</DialogTitle>
                      </DialogHeader>
                      <div className="flex justify-center">
                        <img src="/20150915_full.jpg" alt="Полное изображение грамоты" className="max-w-full max-h-[80vh] object-contain" />
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </div>

              {/* Award Content */}
              <div className="order-1 md:order-2 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                    <Star className="w-6 h-6 text-success" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <Calendar className="w-4 h-4" />
                      <span>2015 год</span>
                    </div>
                    <h3 className="font-semibold text-success">
                      Правительство Нижегородской области
                    </h3>
                  </div>
                </div>

                <h4 className="text-2xl font-bold font-geist mb-4">
                  За вклад в развитие цифровых технологий
                </h4>

                <p className="text-muted-foreground leading-relaxed mb-6">
                  Награда получена за добросовестный труд, большой вклад в развитие и совершенствование
                  регионального инфокоммуникационного комплекса
                </p>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-success rounded-full"></div>
                    <span className="text-sm">50+ успешных цифровых трансформаций</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-success rounded-full"></div>
                    <span className="text-sm">Рост выручки клиентов в среднем на 40%</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-success rounded-full"></div>
                    <span className="text-sm">Внедрение AI-решений в бизнес-процессы</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Recognition */}
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Award className="w-6 h-6 text-accent" />
              </div>
              <h4 className="font-semibold mb-2">Топ-10 разработчиков</h4>
              <p className="text-sm text-muted-foreground">Региональный рейтинг веб-мастеров 2023</p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Star className="w-6 h-6 text-accent" />
              </div>
              <h4 className="font-semibold mb-2">5.0 рейтинг</h4>
              <p className="text-sm text-muted-foreground">Средняя оценка на фриланс платформах</p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Award className="w-6 h-6 text-accent" />
              </div>
              <h4 className="font-semibold mb-2">Сертификат AI</h4>
              <p className="text-sm text-muted-foreground">OpenAI API Integration Specialist</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AwardSection;
