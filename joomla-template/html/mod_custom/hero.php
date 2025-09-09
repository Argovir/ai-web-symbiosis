<?php
/**
 * @package     WebMaster.AI Template
 * @subpackage  mod_custom override for hero section
 * @copyright   Copyright (C) 2024 WebMaster.AI. All rights reserved.
 * @license     GNU General Public License version 2 or later
 */

defined('_JEXEC') or die;

use Joomla\CMS\Factory;

$app = Factory::getApplication();
$params = $app->getTemplate(true)->params;

?>
<div class="container mx-auto px-4">
    <div class="max-w-6xl mx-auto">
        <!-- Section Header -->
        <div class="text-center mb-16">
            <h2 class="text-4xl md:text-5xl font-bold font-geist mb-6">
                Обо мне
            </h2>
            <p class="text-xl text-muted-foreground max-w-3xl mx-auto">
                От верстки в Notepad++ до AI-интеграций: путь длиною в 15 лет
            </p>
        </div>

        <!-- Story and Values Grid -->
        <div class="grid lg:grid-cols-2 gap-12 mb-20">
            <!-- Story -->
            <div class="space-y-6">
                <h3 class="text-2xl font-semibold font-geist" style="color: var(--primary);">
                    Мой путь в веб-разработке
                </h3>
                <p class="text-lg leading-relaxed">
                    15 лет назад начинал с верстки в Notepad++. Прошел путь через HTML, jQuery, PHP 
                    и до современных нейросетевых фреймворков. Видел, как меняются технологии, 
                    тренды и подходы к разработке.
                </p>
                <p class="text-lg leading-relaxed">
                    Сегодня верю, что будущее веба — за гибридом человеческой логики и машинной 
                    эффективности. AI не заменяет разработчика, а делает его более продуктивным 
                    и креативным.
                </p>
                <p class="text-lg leading-relaxed font-medium" style="color: var(--accent);">
                    Специализируюсь на создании быстрых, умных и адаптивных веб-решений 
                    для малого и среднего бизнеса.
                </p>
            </div>

            <!-- Values -->
            <div class="space-y-6">
                <h3 class="text-2xl font-semibold font-geist" style="color: var(--primary);">
                    Принципы работы
                </h3>
                
                <div class="flex gap-4">
                    <div class="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center" 
                         style="background: hsla(200, 80%, 55%, 0.1);">
                        <i class="fas fa-bolt" style="color: var(--accent);"></i>
                    </div>
                    <div>
                        <h4 class="font-semibold mb-2">Сложные задачи</h4>
                        <p style="color: var(--muted-foreground);">
                            Люблю решать нестандартные технические задачи, которые требуют творческого подхода
                        </p>
                    </div>
                </div>

                <div class="flex gap-4">
                    <div class="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center" 
                         style="background: hsla(200, 80%, 55%, 0.1);">
                        <i class="fas fa-heart" style="color: var(--accent);"></i>
                    </div>
                    <div>
                        <h4 class="font-semibold mb-2">Долгосрочное сотрудничество</h4>
                        <p style="color: var(--muted-foreground);">
                            Ценю партнерские отношения с клиентами и развиваю проекты на долгой дистанции
                        </p>
                    </div>
                </div>

                <div class="flex gap-4">
                    <div class="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center" 
                         style="background: hsla(200, 80%, 55%, 0.1);">
                        <i class="fas fa-bullseye" style="color: var(--accent);"></i>
                    </div>
                    <div>
                        <h4 class="font-semibold mb-2">Фокус на результат</h4>
                        <p style="color: var(--muted-foreground);">
                            Каждый проект должен приносить реальную пользу бизнесу клиента
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Skills Grid -->
        <div class="grid lg:grid-cols-2 gap-12">
            <!-- Classic Skills -->
            <div class="rounded-2xl p-8 border" style="background: var(--card); border-color: hsla(215, 15%, 90%, 0.5);">
                <h3 class="text-2xl font-semibold font-geist mb-6" style="color: var(--primary);">
                    Классические технологии
                </h3>
                <div class="space-y-3">
                    <div class="flex items-center gap-3">
                        <i class="fas fa-check flex-shrink-0" style="color: var(--success);"></i>
                        <span class="text-lg">HTML5, CSS3 (SASS/LESS)</span>
                    </div>
                    <div class="flex items-center gap-3">
                        <i class="fas fa-check flex-shrink-0" style="color: var(--success);"></i>
                        <span class="text-lg">JavaScript (ES6+)</span>
                    </div>
                    <div class="flex items-center gap-3">
                        <i class="fas fa-check flex-shrink-0" style="color: var(--success);"></i>
                        <span class="text-lg">Joomla, WordPress</span>
                    </div>
                    <div class="flex items-center gap-3">
                        <i class="fas fa-check flex-shrink-0" style="color: var(--success);"></i>
                        <span class="text-lg">Django - Python</span>
                    </div>
                    <div class="flex items-center gap-3">
                        <i class="fas fa-check flex-shrink-0" style="color: var(--success);"></i>
                        <span class="text-lg">Responsive Design</span>
                    </div>
                    <div class="flex items-center gap-3">
                        <i class="fas fa-check flex-shrink-0" style="color: var(--success);"></i>
                        <span class="text-lg">Performance Optimization</span>
                    </div>
                </div>
            </div>

            <!-- AI Skills -->
            <div class="rounded-2xl p-8 border relative overflow-hidden" 
                 style="background: var(--card); border-color: hsla(215, 15%, 90%, 0.5);">
                <div class="absolute top-0 right-0 w-32 h-32 rounded-full -translate-y-16 translate-x-16" 
                     style="background: hsla(200, 80%, 55%, 0.05);"></div>
                <h3 class="text-2xl font-semibold font-geist mb-6" style="color: var(--accent);">
                    AI & Инновации
                </h3>
                <div class="space-y-3">
                    <div class="flex items-center gap-3">
                        <i class="fas fa-check flex-shrink-0" style="color: var(--accent);"></i>
                        <span class="text-lg">OpenAI API интеграция</span>
                    </div>
                    <div class="flex items-center gap-3">
                        <i class="fas fa-check flex-shrink-0" style="color: var(--accent);"></i>
                        <span class="text-lg">Midjourney автоматизация</span>
                    </div>
                    <div class="flex items-center gap-3">
                        <i class="fas fa-check flex-shrink-0" style="color: var(--accent);"></i>
                        <span class="text-lg">AI чат-боты</span>
                    </div>
                    <div class="flex items-center gap-3">
                        <i class="fas fa-check flex-shrink-0" style="color: var(--accent);"></i>
                        <span class="text-lg">ML аналитика</span>
                    </div>
                    <div class="flex items-center gap-3">
                        <i class="fas fa-check flex-shrink-0" style="color: var(--accent);"></i>
                        <span class="text-lg">Генерация контента</span>
                    </div>
                    <div class="flex items-center gap-3">
                        <i class="fas fa-check flex-shrink-0" style="color: var(--accent);"></i>
                        <span class="text-lg">Персонализация UX</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>