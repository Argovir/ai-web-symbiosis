import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const ScrollVideoCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    contextRef.current = context;

    // Генерируем пути к изображениям, пропуская отсутствующий 007.jpg
    const images: string[] = [];
    for (let i = 0; i < 59; i++) {
      if (i === 7) continue; // Пропустить 007.jpg
      const frameNumber = i.toString().padStart(3, "0");
      images.push(`/animation/${frameNumber}.jpg`);
    }
    const frameCount = images.length; // 58

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
      if (!contextRef.current || !imagesRef.current[frame]) return;
      const img = imagesRef.current[frame];
      contextRef.current.clearRect(0, 0, canvas.width, canvas.height);
      contextRef.current.drawImage(img, 0, 0, canvas.width, canvas.height);
    };

    Promise.all(loadImages).then((loadedImages) => {
      imagesRef.current = loadedImages;

      // Устанавливаем размеры canvas на всю ширину и высоту
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      canvas.width = windowWidth;
      canvas.height = windowHeight;

      // Рисуем первый кадр
      drawFrame(0);

      // Настраиваем ScrollTrigger
      ScrollTrigger.create({
        trigger: "body",
        start: 0,
        end: window.innerHeight,
        scrub: true,
        onUpdate: (self) => {
          const progress = self.progress;
          const frame = Math.round(progress * (frameCount - 1));
          drawFrame(frame);
        },
      });
    });

    // Обновляем размеры canvas при изменении размера окна
    const resizeCanvas = () => {
      if (!canvas) return;
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;

      canvas.width = windowWidth;
      canvas.height = windowHeight;
      canvas.style.width = `${windowWidth}px`;
      canvas.style.height = `${windowHeight}px`;
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
      }}
    />
  );
};

export default ScrollVideoCanvas;
