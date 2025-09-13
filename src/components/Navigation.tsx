import { useState, useEffect } from "react";
import { Menu, X, Sun, Moon, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useTheme } from "@/hooks/useTheme";
const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const { theme, setTheme } = useTheme();
  useEffect(() => {
    const handleScroll = () => {
      const progress = Math.min(window.scrollY / (window.innerHeight / 4), 1);
      setScrollProgress(progress);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  const navItems = [{
    href: "#about",
    label: "Обо мне"
  }, {
    href: "#portfolio",
    label: "Портфолио"
  }, {
    href: "#blog",
    label: "Блог"
  }, {
    href: "#contact",
    label: "Контакты"
  }];
  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth'
      });
      setIsMenuOpen(false);
    }
  };

  const getThemeIcon = () => {
    if (theme === 'light') return <Sun className="w-4 h-4" />;
    if (theme === 'dark') return <Moon className="w-4 h-4" />;
    return <Monitor className="w-4 h-4" />;
  };
  const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  const navBackground = isDark
    ? `rgba(35, 35, 39, ${scrollProgress * 0.95})` // #232327
    : `rgba(255, 255, 255, ${scrollProgress * 0.95})`;
  const textColor = isDark
    ? `rgb(${Math.round(255 - scrollProgress * 64)}, ${Math.round(255 - scrollProgress * 64)}, ${Math.round(255 - scrollProgress * 64)})`
    : `rgb(${Math.round(255 - scrollProgress * 192)}, ${Math.round(255 - scrollProgress * 192)}, ${Math.round(255 - scrollProgress * 185)})`;
  const logoColor = isDark
    ? `rgb(${Math.round(255 - scrollProgress * 64)}, ${Math.round(255 - scrollProgress * 64)}, ${Math.round(255 - scrollProgress * 64)})`
    : `rgb(${Math.round(255 - scrollProgress * 192)}, ${Math.round(255 - scrollProgress * 192)}, ${Math.round(255 - scrollProgress * 185)})`;

  return <nav
      className="fixed top-0 w-full z-50 transition-all duration-300"
      style={{
        backgroundColor: navBackground,
        backdropFilter: scrollProgress > 0 ? 'blur(4px)' : 'none',
        borderBottom: scrollProgress > 0 ? `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}` : 'none',
        boxShadow: scrollProgress > 0 ? `0 4px 6px -1px ${isDark ? 'rgba(0, 0, 0, 0.25)' : 'rgba(0, 0, 0, 0.1)'}` : 'none'
      }}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <div className="font-geist font-bold text-xl">
            <span
              className="transition-colors duration-300"
              style={{ color: logoColor }}
            >
              WebMaster
            </span>
            <span className="text-accent">.AI</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map(item => <button
                key={item.href}
                onClick={() => scrollToSection(item.href)}
                className="transition-colors duration-200 font-medium hover:text-accent"
                style={{ color: textColor }}
              >
                {item.label}
              </button>)}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" style={{ color: textColor }}>
                  {getThemeIcon()}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme('light')}>
                  <Sun className="w-4 h-4 mr-2" />
                  Светлая
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('dark')}>
                  <Moon className="w-4 h-4 mr-2" />
                  Тёмная
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('system')}>
                  <Monitor className="w-4 h-4 mr-2" />
                  Системная
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="default" size="sm" onClick={() => scrollToSection('#contact')}>
              Написать мне
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button variant="ghost" size="sm" onClick={() => setIsMenuOpen(!isMenuOpen)} style={{ color: textColor }}>
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && <div className="md:hidden bg-background border-t border-border">
            <div className="py-4 space-y-2">
              {navItems.map(item => <button key={item.href} onClick={() => scrollToSection(item.href)} className="block w-full text-left px-4 py-2 text-foreground hover:text-accent hover:bg-muted/50 transition-colors duration-200">
                  {item.label}
                </button>)}
              <div className="px-4 py-2 space-y-2">
                <div className="flex justify-center space-x-2">
                  <Button variant={theme === 'light' ? 'default' : 'outline'} size="sm" onClick={() => setTheme('light')}>
                    <Sun className="w-4 h-4" />
                  </Button>
                  <Button variant={theme === 'dark' ? 'default' : 'outline'} size="sm" onClick={() => setTheme('dark')}>
                    <Moon className="w-4 h-4" />
                  </Button>
                  <Button variant={theme === 'system' ? 'default' : 'outline'} size="sm" onClick={() => setTheme('system')}>
                    <Monitor className="w-4 h-4" />
                  </Button>
                </div>
                <Button variant="default" size="sm" className="w-full" onClick={() => scrollToSection('#contact')}>
                  Написать мне
                </Button>
              </div>
            </div>
          </div>}
      </div>
    </nav>;
};
export default Navigation;
