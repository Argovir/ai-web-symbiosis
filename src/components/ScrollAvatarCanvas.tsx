import { useEffect, useRef } from "react";

const ScrollAvatarCanvas = ({ className = "" }: { className?: string }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    // Создаем массив путей к изображениям (правильные пути для Vite)
    const images: string[] = [];
    for (let i = 1; i <= 55; i++) {
      const frameNumber = i.toString().padStart(3, "0");
      images.push(`/animation/avatars/${frameNumber}.jpg`);
    }

    // Загружаем изображения
    const loadImages = images.map((src) => {
      return new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
      });
    });

    // Функция для рисования кадра
    const drawFrame = (frame: number) => {
      if (!imagesRef.current[frame]) return;
      const img = imagesRef.current[frame];
      context.clearRect(0, 0, canvas.width, canvas.height);

      // Растягиваем по высоте с сохранением пропорций
      const scale = canvas.height / img.height;
      const scaledWidth = img.width * scale;
      const scaledHeight = canvas.height;

      let sx = 0, sy = 0, sWidth = img.width, sHeight = img.height;
      let dx = 0, dy = 0, dWidth = canvas.width, dHeight = canvas.height;

      if (scaledWidth > canvas.width) {
        // Обрезаем по ширине, центрируя
        const excessWidth = scaledWidth - canvas.width;
        sx = (excessWidth / scale) / 2;
        sWidth = img.width - (excessWidth / scale);
        dWidth = canvas.width;
      } else {
        // Центрируем по ширине
        dx = (canvas.width - scaledWidth) / 2;
        dWidth = scaledWidth;
      }

      context.drawImage(img, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
    };

    // Загружаем все изображения и запускаем анимацию
    Promise.all(loadImages).then((loadedImages) => {
      imagesRef.current = loadedImages;

      // Устанавливаем размеры canvas
      const canvasSize = Math.min(256, window.innerWidth < 768 ? 128 : 256);
      const adjustedSize = canvasSize * 1.2 * 1.1;
      canvas.width = adjustedSize * 1.35 * 1.1;
      canvas.height = adjustedSize * 1.1;

      // Рисуем первый кадр
      drawFrame(0);

      // Находим CTA секцию для анимации
      const ctaSection = document.querySelector('.cta-section') as HTMLElement;
      if (!ctaSection) return;

      // Функция для обновления анимации
      const updateAnimation = () => {
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;
        const sectionRect = ctaSection.getBoundingClientRect();
        const sectionTop = scrollY + sectionRect.top;
        const sectionHeight = sectionRect.height;

        // Проверяем, находится ли секция в viewport
        const isInView = scrollY + windowHeight > sectionTop && scrollY < sectionTop + sectionHeight;

        if (isInView) {
          // Вычисляем прогресс (0-1)
          const progress = Math.max(0, Math.min(1,
            (scrollY + windowHeight / 2 - sectionTop) / sectionHeight
          ));

          // Вычисляем кадр
          const frame = Math.round(progress * (loadedImages.length - 1));

          // Рисуем кадр если он изменился
          if (frame !== currentFrameRef.current) {
            currentFrameRef.current = frame;
            drawFrame(frame);
          }
        }
      };

      // Запускаем анимацию
      const animate = () => {
        updateAnimation();
        requestAnimationFrame(animate);
      };

      animate();
    }).catch((error) => {
      console.error("Ошибка загрузки изображений:", error);
    });
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`rounded-xl object-cover border-4 border-white/20 shadow-lg hover:scale-105 transition-transform duration-300 ${className}`}
      style={{
        width: "100%",
        height: "100%",
        maxWidth: "502px",
        maxHeight: "372px",
      }}
    />
  );
};

export default ScrollAvatarCanvas;
