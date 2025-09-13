import { Mail, Phone, MessageCircle, Github, ExternalLink } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { href: "#about", label: "Обо мне" },
    { href: "#portfolio", label: "Портфолио" },
    { href: "#blog", label: "Блог" },
    { href: "#contact", label: "Контакты" }
  ];

  const services = [
    { href: "#", label: "Веб-разработка" },
    { href: "#", label: "AI интеграции" },
    { href: "#", label: "Консультации" },
    { href: "#", label: "Аудит сайтов" }
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-primary relative z-20 text-white force-light">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Brand & Description */}
          <div className="lg:col-span-1">
            <div className="font-geist font-bold text-2xl mb-4">
              <span className="text-white">WebMaster</span>
              <span className="text-accent">.AI</span>
            </div>
            <p className="text-white/80 mb-6 leading-relaxed">
              Веб-мастер с 15-летним опытом. Создаю современные сайты с интеграцией AI-технологий
              для развития вашего бизнеса.
            </p>
            
            {/* Social Links */}
            <div className="flex gap-3">
              <a 
                href="mailto:contact@example.com"
                className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-accent transition-colors duration-200"
              >
                <Mail className="w-5 h-5" />
              </a>
              <a 
                href="tel:+7900000000"
                className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-accent transition-colors duration-200"
              >
                <Phone className="w-5 h-5" />
              </a>
              <a 
                href="https://t.me/webmaster"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-accent transition-colors duration-200"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
              <a 
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-accent transition-colors duration-200"
              >
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-6">Навигация</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <button
                    onClick={() => scrollToSection(link.href)}
                    className="text-white/80 hover:text-accent transition-colors duration-200"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold text-lg mb-6">Услуги</h3>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service.href}>
                  <a
                    href={service.href}
                    className="text-white/80 hover:text-accent transition-colors duration-200"
                  >
                    {service.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-lg mb-6">Контакты</h3>
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Mail className="w-5 h-5 text-accent" />
                  <span className="font-medium">Email</span>
                </div>
                <a
                  href="mailto:contact@example.com"
                  className="text-white/80 hover:text-accent transition-colors duration-200 ml-8"
                >
                  contact@example.com
                </a>
              </div>
              
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Phone className="w-5 h-5 text-accent" />
                  <span className="font-medium">Телефон</span>
                </div>
                <a
                  href="tel:+7900000000"
                  className="text-white/80 hover:text-accent transition-colors duration-200 ml-8"
                >
                  +7 (900) 000-00-00
                </a>
              </div>

              <div>
                <div className="flex items-center gap-3 mb-2">
                  <MessageCircle className="w-5 h-5 text-accent" />
                  <span className="font-medium">Telegram</span>
                </div>
                <a
                  href="https://t.me/webmaster"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/80 hover:text-accent transition-colors duration-200 ml-8 flex items-center gap-1"
                >
                  @webmaster
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/60 text-sm">
              © {currentYear} WebMaster.AI. Все права защищены.
            </p>
            <p className="text-white/60 text-sm">
              Сделано с ❤️ и современными технологиями
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
