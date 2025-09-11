import { Check, Zap, Heart, Target } from "lucide-react";
const AboutSection = () => {
  const classicSkills = ["HTML5, CSS3 (SASS/LESS)", "JavaScript/TypeScript, Node.js", "Joomla, WordPress", "Django - Python", "Responsive Design", "Performance Optimization"];
  const aiSkills = ["OpenAI API интеграция", "Midjourney автоматизация", "AI чат-боты", "ML аналитика", "Генерация контента", "Персонализация UX"];
  const values = [{
    icon: Zap,
    title: "Сложные задачи",
    description: "Люблю решать нестандартные технические задачи, которые требуют творческого подхода"
  }, {
    icon: Heart,
    title: "Долгосрочное сотрудничество",
    description: "Ценю партнерские отношения с клиентами и развиваю проекты на долгой дистанции"
  }, {
    icon: Target,
    title: "Фокус на результат",
    description: "Каждый проект должен приносить реальную пользу бизнесу клиента"
  }];
  return <section id="about" className="py-24 section-bg" data-animate>
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold font-geist mb-6">
              Обо мне
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              От верстки в Notepad++ до AI-интеграций: путь длиною в 15 лет
            </p>
          </div>

          {/* Story */}
          <div className="grid lg:grid-cols-2 gap-12 mb-20">
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold font-geist text-primary">
                Мой путь в веб-разработке
              </h3>
              <p className="text-lg leading-relaxed">15 лет назад начинал с верстки в Notepad++. Прошел путь через HTML, jQuery, PHP и до современных нейросетевых фреймворков. Видел, как меняются технологии, тренды и подходы к разработке.</p>
              <p className="text-lg leading-relaxed">
                Сегодня верю, что будущее веба — за гибридом человеческой логики и машинной 
                эффективности. AI не заменяет разработчика, а делает его более продуктивным 
                и креативным.
              </p>
              <p className="text-lg leading-relaxed text-accent font-medium">
                Специализируюсь на создании быстрых, умных и адаптивных веб-решений 
                для малого и среднего бизнеса.
              </p>
            </div>

            {/* Values */}
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold font-geist text-primary">
                Принципы работы
              </h3>
              {values.map((value, index) => <div key={index} className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                    <value.icon className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">{value.title}</h4>
                    <p className="text-muted-foreground">{value.description}</p>
                  </div>
                </div>)}
            </div>
          </div>

          {/* Skills */}
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Classic Skills */}
            <div className="bg-card rounded-2xl p-8 border border-border/50">
              <h3 className="text-2xl font-semibold font-geist mb-6 text-primary">
                Классические технологии
              </h3>
              <div className="space-y-3">
                {classicSkills.map((skill, index) => <div key={index} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-success flex-shrink-0" />
                    <span className="text-lg">{skill}</span>
                  </div>)}
              </div>
            </div>

            {/* AI Skills */}
            <div className="bg-card rounded-2xl p-8 border border-border/50 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full -translate-y-16 translate-x-16"></div>
              <h3 className="text-2xl font-semibold font-geist mb-6 text-accent">
                AI & Инновации
              </h3>
              <div className="space-y-3">
                {aiSkills.map((skill, index) => <div key={index} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-accent flex-shrink-0" />
                    <span className="text-lg">{skill}</span>
                  </div>)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default AboutSection;