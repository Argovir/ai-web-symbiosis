<?php
/**
 * @package     WebMaster.AI Template
 * @subpackage  mod_articles_news override for portfolio section
 * @copyright   Copyright (C) 2024 WebMaster.AI. All rights reserved.
 * @license     GNU General Public License version 2 or later
 */

defined('_JEXEC') or die;

use Joomla\CMS\Helper\ModuleHelper;
use Joomla\CMS\Language\Text;

?>
<div class="container mx-auto px-4">
    <div class="max-w-7xl mx-auto">
        <!-- Section Header -->
        <div class="text-center mb-16">
            <h2 class="text-4xl md:text-5xl font-bold font-geist mb-6">
                Портфолио
            </h2>
            <p class="text-xl max-w-3xl mx-auto" style="color: var(--muted-foreground);">
                Избранные проекты: от классических сайтов до AI-интеграций
            </p>
        </div>

        <!-- Filter Buttons -->
        <div class="flex flex-wrap justify-center gap-3 mb-12">
            <i class="fas fa-filter mt-2 mr-2" style="color: var(--muted-foreground);"></i>
            <button class="portfolio-filter btn active" data-filter="all">Все</button>
            <button class="portfolio-filter btn" data-filter="classic">Классические сайты</button>
            <button class="portfolio-filter btn" data-filter="ai">AI-проекты</button>
            <button class="portfolio-filter btn" data-filter="ecommerce">Интернет-магазины</button>
        </div>

        <!-- Projects Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            <!-- AI E-commerce Project -->
            <div class="portfolio-item ai ecommerce rounded-2xl overflow-hidden border fade-in-up stagger-1" 
                 style="background: var(--card); border-color: var(--border); box-shadow: 0 4px 6px -1px hsla(215, 28%, 17%, 0.1);">
                <div class="aspect-video bg-gray-200 overflow-hidden">
                    <div class="w-full h-full flex items-center justify-center" style="background: var(--muted);">
                        <i class="fas fa-robot text-4xl" style="color: var(--accent);"></i>
                    </div>
                </div>
                
                <div class="p-6">
                    <h3 class="text-xl font-semibold font-geist mb-3">
                        AI-Помощник для E-commerce
                    </h3>
                    <p class="mb-4 leading-relaxed" style="color: var(--muted-foreground);">
                        Интеллектуальный чат-бот с интеграцией GPT-4 для консультации покупателей 
                        и персонализации рекомендаций
                    </p>

                    <!-- Tech Tags -->
                    <div class="flex flex-wrap gap-2 mb-6">
                        <span class="tech-tag">React</span>
                        <span class="tech-tag">OpenAI API</span>
                        <span class="tech-tag">Node.js</span>
                        <span class="tech-tag">MongoDB</span>
                    </div>

                    <!-- Action Buttons -->
                    <div class="flex gap-3">
                        <a href="#" class="btn btn-accent flex-1 text-center">
                            <i class="fas fa-external-link-alt mr-2"></i>
                            Демо
                        </a>
                        <a href="#" class="btn btn-outline">
                            <i class="fab fa-github mr-2"></i>
                            Код
                        </a>
                    </div>
                </div>
            </div>

            <!-- Corporate Website -->
            <div class="portfolio-item classic rounded-2xl overflow-hidden border fade-in-up stagger-2" 
                 style="background: var(--card); border-color: var(--border); box-shadow: 0 4px 6px -1px hsla(215, 28%, 17%, 0.1);">
                <div class="aspect-video bg-gray-200 overflow-hidden">
                    <div class="w-full h-full flex items-center justify-center" style="background: var(--muted);">
                        <i class="fas fa-building text-4xl" style="color: var(--primary);"></i>
                    </div>
                </div>
                
                <div class="p-6">
                    <h3 class="text-xl font-semibold font-geist mb-3">
                        Корпоративный сайт с CMS
                    </h3>
                    <p class="mb-4 leading-relaxed" style="color: var(--muted-foreground);">
                        Современный корпоративный сайт с кастомной CMS, адаптивным дизайном 
                        и высокой производительностью
                    </p>

                    <!-- Tech Tags -->
                    <div class="flex flex-wrap gap-2 mb-6">
                        <span class="tech-tag">Joomla</span>
                        <span class="tech-tag">PHP</span>
                        <span class="tech-tag">MySQL</span>
                        <span class="tech-tag">SCSS</span>
                    </div>

                    <!-- Action Buttons -->
                    <div class="flex gap-3">
                        <a href="#" class="btn btn-accent flex-1 text-center">
                            <i class="fas fa-external-link-alt mr-2"></i>
                            Демо
                        </a>
                        <a href="#" class="btn btn-outline">
                            <i class="fab fa-github mr-2"></i>
                            Код
                        </a>
                    </div>
                </div>
            </div>

            <!-- Content Automation -->
            <div class="portfolio-item ai rounded-2xl overflow-hidden border fade-in-up stagger-3" 
                 style="background: var(--card); border-color: var(--border); box-shadow: 0 4px 6px -1px hsla(215, 28%, 17%, 0.1);">
                <div class="aspect-video bg-gray-200 overflow-hidden">
                    <div class="w-full h-full flex items-center justify-center" style="background: var(--muted);">
                        <i class="fas fa-magic text-4xl" style="color: var(--accent);"></i>
                    </div>
                </div>
                
                <div class="p-6">
                    <h3 class="text-xl font-semibold font-geist mb-3">
                        Автоматизация контента с AI
                    </h3>
                    <p class="mb-4 leading-relaxed" style="color: var(--muted-foreground);">
                        Система автоматической генерации и публикации контента с использованием 
                        Midjourney API и ChatGPT
                    </p>

                    <!-- Tech Tags -->
                    <div class="flex flex-wrap gap-2 mb-6">
                        <span class="tech-tag">Python</span>
                        <span class="tech-tag">Midjourney API</span>
                        <span class="tech-tag">WordPress</span>
                        <span class="tech-tag">Automation</span>
                    </div>

                    <!-- Action Buttons -->
                    <div class="flex gap-3">
                        <a href="#" class="btn btn-accent flex-1 text-center">
                            <i class="fas fa-external-link-alt mr-2"></i>
                            Демо
                        </a>
                        <a href="#" class="btn btn-outline">
                            <i class="fab fa-github mr-2"></i>
                            Код
                        </a>
                    </div>
                </div>
            </div>
        </div>

        <!-- Load More Button -->
        <div class="text-center mt-12">
            <button class="btn btn-outline btn-lg px-8">
                Загрузить ещё проекты
            </button>
        </div>
    </div>
</div>

<style>
.tech-tag {
    display: inline-flex;
    align-items: center;
    padding: 0.25rem 0.75rem;
    font-size: 0.75rem;
    font-weight: 500;
    background: var(--secondary);
    color: var(--secondary-foreground);
    border-radius: 9999px;
    border: 1px solid var(--border);
}

.portfolio-filter {
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
    font-weight: 500;
    border-radius: 0.5rem;
    transition: var(--transition-smooth);
    border: 1px solid var(--border);
    background: var(--secondary);
    color: var(--secondary-foreground);
}

.portfolio-filter:hover {
    background: var(--muted);
}

.portfolio-filter.active {
    background: var(--accent);
    color: var(--accent-foreground);
    box-shadow: 0 10px 25px hsla(200, 80%, 55%, 0.15);
}

.portfolio-item {
    transition: var(--transition-smooth);
}

.portfolio-item:hover {
    transform: translateY(-4px);
    box-shadow: 0 25px 50px -12px hsla(215, 28%, 17%, 0.15), 0 10px 15px -3px hsla(215, 28%, 17%, 0.1);
}
</style>