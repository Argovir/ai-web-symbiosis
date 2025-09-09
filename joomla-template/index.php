<?php
/**
 * @package     WebMaster.AI Template
 * @subpackage  Templates.webmaster-ai
 * @copyright   Copyright (C) 2024 WebMaster.AI. All rights reserved.
 * @license     GNU General Public License version 2 or later
 */

defined('_JEXEC') or die;

use Joomla\CMS\Factory;
use Joomla\CMS\HTML\HTMLHelper;
use Joomla\CMS\Language\Text;
use Joomla\CMS\Uri\Uri;

$app = Factory::getApplication();
$wa = $app->getDocument()->getWebAssetManager();
$this->language = $app->getLanguage()->getTag();
$this->direction = $app->getLanguage()->isRtl() ? 'rtl' : 'ltr';
$templatePath = 'templates/' . $this->template;

// Get template parameters
$params = $app->getTemplate(true)->params;

// Add template CSS and JS
$wa->addStyleSheetVersion($templatePath . '/css/template.css');
$wa->addScriptVersion($templatePath . '/js/template.js');

// Add Google Fonts
$wa->addStyleSheet('https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap');

// Add Font Awesome for icons
$wa->addStyleSheet('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');

// Set viewport
$this->setMetaData('viewport', 'width=device-width, initial-scale=1');

// Get menu items for navigation
$menu = $app->getMenu();
$active = $menu->getActive();
$default = $menu->getDefault();

?>
<!DOCTYPE html>
<html lang="<?php echo $this->language; ?>" dir="<?php echo $this->direction; ?>">
<head>
    <jdoc:include type="metas" />
    <jdoc:include type="styles" />
    <jdoc:include type="scripts" />
</head>

<body class="site <?php echo $active->alias ?? ''; ?>">
    <!-- Navigation -->
    <nav class="webmaster-nav fixed top-0 w-full z-50 transition-all duration-300" id="main-nav">
        <div class="container mx-auto px-4">
            <div class="flex items-center justify-between h-16 md:h-20">
                <!-- Logo -->
                <div class="font-geist font-bold text-xl">
                    <a href="<?php echo Uri::root(); ?>" class="logo-link">
                        <span class="logo-text transition-colors duration-300">WebMaster</span>
                        <span class="logo-accent">.AI</span>
                    </a>
                </div>

                <!-- Desktop Navigation -->
                <div class="hidden md:flex items-center space-x-8">
                    <a href="#about" class="nav-link transition-colors duration-200 font-medium">
                        <?php echo Text::_('TPL_WEBMASTER_AI_ABOUT'); ?>
                    </a>
                    <a href="#portfolio" class="nav-link transition-colors duration-200 font-medium">
                        <?php echo Text::_('TPL_WEBMASTER_AI_PORTFOLIO'); ?>
                    </a>
                    <a href="#blog" class="nav-link transition-colors duration-200 font-medium">
                        <?php echo Text::_('TPL_WEBMASTER_AI_BLOG'); ?>
                    </a>
                    <a href="#contact" class="nav-link transition-colors duration-200 font-medium">
                        <?php echo Text::_('TPL_WEBMASTER_AI_CONTACT'); ?>
                    </a>
                    <a href="#contact" class="btn btn-primary">
                        <?php echo Text::_('TPL_WEBMASTER_AI_WRITE_ME'); ?>
                    </a>
                </div>

                <!-- Mobile Menu Button -->
                <div class="md:hidden">
                    <button class="mobile-menu-btn" id="mobile-menu-btn">
                        <i class="fas fa-bars"></i>
                    </button>
                </div>
            </div>

            <!-- Mobile Navigation -->
            <div class="mobile-menu hidden md:hidden" id="mobile-menu">
                <div class="py-4 space-y-2">
                    <a href="#about" class="mobile-nav-link block w-full text-left px-4 py-2">
                        <?php echo Text::_('TPL_WEBMASTER_AI_ABOUT'); ?>
                    </a>
                    <a href="#portfolio" class="mobile-nav-link block w-full text-left px-4 py-2">
                        <?php echo Text::_('TPL_WEBMASTER_AI_PORTFOLIO'); ?>
                    </a>
                    <a href="#blog" class="mobile-nav-link block w-full text-left px-4 py-2">
                        <?php echo Text::_('TPL_WEBMASTER_AI_BLOG'); ?>
                    </a>
                    <a href="#contact" class="mobile-nav-link block w-full text-left px-4 py-2">
                        <?php echo Text::_('TPL_WEBMASTER_AI_CONTACT'); ?>
                    </a>
                    <div class="px-4 py-2">
                        <a href="#contact" class="btn btn-primary w-full block text-center">
                            <?php echo Text::_('TPL_WEBMASTER_AI_WRITE_ME'); ?>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </nav>

    <!-- Main Content -->
    <main class="main-content">
        <!-- Hero Section -->
        <?php if ($this->countModules('hero') || $active == $default) : ?>
        <section class="hero-section relative min-h-screen flex items-center justify-center overflow-hidden">
            <!-- Background -->
            <?php if ($params->get('hero_background')) : ?>
            <div class="hero-bg absolute inset-0" 
                 style="background-image: url('<?php echo Uri::root() . $params->get('hero_background'); ?>');">
            </div>
            <?php else : ?>
            <div class="hero-bg absolute inset-0" 
                 style="background-image: url('<?php echo $templatePath; ?>/images/hero-bg.jpg');">
            </div>
            <?php endif; ?>
            
            <!-- Overlay -->
            <div class="hero-overlay absolute inset-0"></div>

            <!-- Content -->
            <div class="relative z-10 container mx-auto px-4 text-center text-white">
                <div class="max-w-5xl mx-auto">
                    <!-- Badge -->
                    <div class="hero-badge inline-flex items-center gap-2 px-4 py-2 mb-8 fade-in-up">
                        <i class="fas fa-code"></i>
                        <span class="text-sm font-medium">15 лет в веб-разработке</span>
                        <i class="fas fa-brain"></i>
                    </div>

                    <!-- Main Heading -->
                    <h1 class="hero-title text-5xl md:text-7xl font-bold font-geist mb-6 leading-tight fade-in-up stagger-1">
                        <?php echo $params->get('hero_title', 'Веб-мастер & <span class="text-accent hero-text-glow">AI-интегратор</span>'); ?>
                    </h1>

                    <!-- Subheading -->
                    <p class="hero-subtitle text-xl md:text-2xl mb-12 max-w-3xl mx-auto leading-relaxed fade-in-up stagger-2">
                        <?php echo $params->get('hero_subtitle', 'Создаю сайты, которые работают. 15 лет опыта + современные AI-технологии = быстрые, умные и адаптивные веб-решения для вашего бизнеса'); ?>
                    </p>

                    <!-- CTA Buttons -->
                    <div class="hero-cta flex flex-col sm:flex-row gap-4 justify-center items-center fade-in-up stagger-3">
                        <a href="#portfolio" class="btn btn-accent btn-lg">
                            <?php echo Text::_('TPL_WEBMASTER_AI_VIEW_WORKS'); ?>
                            <i class="fas fa-arrow-right ml-2"></i>
                        </a>
                        <a href="#contact" class="btn btn-outline btn-lg">
                            <?php echo Text::_('TPL_WEBMASTER_AI_WRITE_ME'); ?>
                        </a>
                    </div>

                    <!-- Stats -->
                    <div class="hero-stats grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 fade-in-up stagger-4">
                        <div class="text-center">
                            <div class="stat-number text-3xl md:text-4xl font-bold mb-2">
                                <?php echo $params->get('stat1_number', '15+'); ?>
                            </div>
                            <div class="stat-text text-sm">
                                <?php echo $params->get('stat1_text', 'Лет опыта'); ?>
                            </div>
                        </div>
                        <div class="text-center">
                            <div class="stat-number text-3xl md:text-4xl font-bold mb-2">
                                <?php echo $params->get('stat2_number', '200+'); ?>
                            </div>
                            <div class="stat-text text-sm">
                                <?php echo $params->get('stat2_text', 'Проектов'); ?>
                            </div>
                        </div>
                        <div class="text-center">
                            <div class="stat-number text-3xl md:text-4xl font-bold mb-2">
                                <?php echo $params->get('stat3_number', '50+'); ?>
                            </div>
                            <div class="stat-text text-sm">
                                <?php echo $params->get('stat3_text', 'AI интеграций'); ?>
                            </div>
                        </div>
                        <div class="text-center">
                            <div class="stat-number text-3xl md:text-4xl font-bold mb-2">
                                <?php echo $params->get('stat4_number', '99%'); ?>
                            </div>
                            <div class="stat-text text-sm">
                                <?php echo $params->get('stat4_text', 'Довольных клиентов'); ?>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Scroll Indicator -->
            <div class="scroll-indicator absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
                <div class="w-1 h-16 bg-gradient-to-b from-white/60 to-transparent rounded-full"></div>
            </div>
        </section>
        <?php endif; ?>

        <!-- About Section -->
        <?php if ($this->countModules('about')) : ?>
        <section id="about" class="about-section py-24 section-bg" data-animate>
            <jdoc:include type="modules" name="about" style="none" />
        </section>
        <?php endif; ?>

        <!-- Portfolio Section -->
        <?php if ($this->countModules('portfolio')) : ?>
        <section id="portfolio" class="portfolio-section py-24" data-animate>
            <jdoc:include type="modules" name="portfolio" style="none" />
        </section>
        <?php endif; ?>

        <!-- Awards Section -->
        <?php if ($this->countModules('awards')) : ?>
        <section id="awards" class="awards-section py-24 section-bg" data-animate>
            <jdoc:include type="modules" name="awards" style="none" />
        </section>
        <?php endif; ?>

        <!-- Blog Section -->
        <?php if ($this->countModules('blog')) : ?>
        <section id="blog" class="blog-section py-24" data-animate>
            <jdoc:include type="modules" name="blog" style="none" />
        </section>
        <?php endif; ?>

        <!-- CTA Section -->
        <?php if ($this->countModules('cta')) : ?>
        <section id="cta" class="cta-section py-24 section-bg" data-animate>
            <jdoc:include type="modules" name="cta" style="none" />
        </section>
        <?php endif; ?>

        <!-- Main Joomla Content -->
        <?php if ($this->countModules('breadcrumbs')) : ?>
        <div class="breadcrumbs">
            <jdoc:include type="modules" name="breadcrumbs" />
        </div>
        <?php endif; ?>

        <div class="main-content-area">
            <jdoc:include type="component" />
        </div>
    </main>

    <!-- Footer -->
    <footer id="contact" class="footer-section py-16">
        <?php if ($this->countModules('footer')) : ?>
        <jdoc:include type="modules" name="footer" style="none" />
        <?php else : ?>
        <div class="container mx-auto px-4">
            <div class="grid md:grid-cols-3 gap-12">
                <!-- Contact Info -->
                <div>
                    <h3 class="text-xl font-semibold mb-6">Контакты</h3>
                    <div class="space-y-4">
                        <?php if ($params->get('email')) : ?>
                        <div class="flex items-center gap-3">
                            <i class="fas fa-envelope text-accent"></i>
                            <a href="mailto:<?php echo $params->get('email'); ?>" class="contact-link">
                                <?php echo $params->get('email'); ?>
                            </a>
                        </div>
                        <?php endif; ?>
                        
                        <?php if ($params->get('phone')) : ?>
                        <div class="flex items-center gap-3">
                            <i class="fas fa-phone text-accent"></i>
                            <a href="tel:<?php echo str_replace([' ', '(', ')', '-'], '', $params->get('phone')); ?>" class="contact-link">
                                <?php echo $params->get('phone'); ?>
                            </a>
                        </div>
                        <?php endif; ?>
                        
                        <?php if ($params->get('telegram')) : ?>
                        <div class="flex items-center gap-3">
                            <i class="fab fa-telegram text-accent"></i>
                            <a href="https://t.me/<?php echo ltrim($params->get('telegram'), '@'); ?>" class="contact-link" target="_blank">
                                <?php echo $params->get('telegram'); ?>
                            </a>
                        </div>
                        <?php endif; ?>
                        
                        <?php if ($params->get('github')) : ?>
                        <div class="flex items-center gap-3">
                            <i class="fab fa-github text-accent"></i>
                            <a href="<?php echo $params->get('github'); ?>" class="contact-link" target="_blank">
                                GitHub
                            </a>
                        </div>
                        <?php endif; ?>
                    </div>
                </div>

                <!-- Quick Links -->
                <div>
                    <h3 class="text-xl font-semibold mb-6">Быстрые ссылки</h3>
                    <nav class="space-y-3">
                        <a href="#about" class="footer-link block">Обо мне</a>
                        <a href="#portfolio" class="footer-link block">Портфолио</a>
                        <a href="#blog" class="footer-link block">Блог</a>
                        <a href="#contact" class="footer-link block">Контакты</a>
                    </nav>
                </div>

                <!-- About -->
                <div>
                    <h3 class="text-xl font-semibold mb-6">WebMaster.AI</h3>
                    <p class="text-muted-foreground mb-4">
                        Создаю современные веб-решения с интеграцией AI-технологий 
                        для успешного развития вашего бизнеса.
                    </p>
                </div>
            </div>

            <div class="border-t border-border mt-12 pt-8 text-center">
                <p class="text-muted-foreground">
                    © <?php echo date('Y'); ?> WebMaster.AI. Все права защищены.
                </p>
            </div>
        </div>
        <?php endif; ?>
    </footer>

    <!-- Debug -->
    <?php if ($this->countModules('debug')) : ?>
    <div class="debug-position">
        <jdoc:include type="modules" name="debug" />
    </div>
    <?php endif; ?>

    <jdoc:include type="modules" name="debug" style="none" />
</body>
</html>