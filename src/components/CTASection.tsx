import { Button } from "@/components/ui/button";
import { ArrowRight, Mail, MessageCircle, Phone } from "lucide-react";

const CTASection = () => {
  const scrollToContact = () => {
    const element = document.querySelector('#contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Main CTA Section */}
      <section className="py-24 bg-gradient-to-br from-primary to-primary/90 text-white relative overflow-hidden force-light" data-animate>
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-72 h-72 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent rounded-full translate-x-1/3 translate-y-1/3"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-6xl font-bold font-geist mb-6 leading-tight">
              Готовы создать современный сайт для вашего бизнеса?
            </h2>
            <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed">
              Обсудим ваш проект, определим техническое решение и создадим сайт, 
              который будет приносить реальную пользу вашему бизнесу
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Button 
                size="lg" 
                variant="secondary"
                onClick={scrollToContact}
                className="bg-white text-primary hover:bg-white/90 px-8 py-4 text-lg font-medium gap-2 hover-glow"
              >
                Обсудить проект
                <ArrowRight className="w-5 h-5" />
              </Button>
              
              <div className="flex items-center gap-4 text-white/80">
                <span className="text-sm">или свяжитесь напрямую:</span>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20 p-2"
                    asChild
                  >
                    <a href="mailto:contact@example.com">
                      <Mail className="w-4 h-4" />
                    </a>
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20 p-2"
                    asChild
                  >
                    <a href="tel:+7900000000">
                      <Phone className="w-4 h-4" />
                    </a>
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20 p-2"
                    asChild
                  >
                    <a href="https://t.me/webmaster" target="_blank" rel="noopener noreferrer">
                      <MessageCircle className="w-4 h-4" />
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 section-bg" data-animate>
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold font-geist mb-6">
                Контакты
              </h2>
              <p className="text-xl text-muted-foreground">
                Свяжитесь со мной удобным способом
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Email */}
              <div className="text-center p-8 bg-card rounded-2xl border border-border/50 hover-lift flex flex-col h-full">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Mail className="w-8 h-8 text-accent" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Email</h3>
                <p className="text-muted-foreground mb-4 flex-grow">
                  Для деловых предложений и консультаций
                </p>
                <Button variant="outline" asChild className="mt-auto">
                  <a href="mailto:contact@example.com">
                    contact@example.com
                  </a>
                </Button>
              </div>

              {/* Phone */}
              <div className="text-center p-8 bg-card rounded-2xl border border-border/50 hover-lift flex flex-col h-full">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Phone className="w-8 h-8 text-accent" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Телефон</h3>
                <p className="text-muted-foreground mb-4 flex-grow">
                  Звоните в рабочее время (10:00 - 18:00)
                </p>
                <Button variant="outline" asChild className="mt-auto">
                  <a href="tel:+7900000000">
                    +7 (900) 000-00-00
                  </a>
                </Button>
              </div>

              {/* Telegram */}
              <div className="text-center p-8 bg-card rounded-2xl border border-border/50 hover-lift flex flex-col h-full">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <MessageCircle className="w-8 h-8 text-accent" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Telegram</h3>
                <p className="text-muted-foreground mb-4 flex-grow">
                  Быстрая связь и обмен файлами
                </p>
                <Button variant="outline" asChild className="mt-auto">
                  <a href="https://t.me/webmaster" target="_blank" rel="noopener noreferrer">
                    @webmaster
                  </a>
                </Button>
              </div>
            </div>

            {/* Response Time */}
            <div className="text-center mt-12 p-6 bg-accent/5 rounded-xl border border-accent/20">
              <p className="text-accent font-medium">
                ⚡ Отвечаю на сообщения в течение 2-4 часов в рабочее время
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default CTASection;
