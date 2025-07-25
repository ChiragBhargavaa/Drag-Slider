import { useState } from 'react'
import { useEffect , useRef } from 'react';
import gsap from 'gsap';

function DragSlider({
  containerWidth = 80,
  imgWidth = 50,
  containerHeight = 60,
  images = [],
  fadeMask = true,
  showDragHint = true
}) {

  const imageRefs = useRef([]);
  const containerRef = useRef(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const dragPromptRef = useRef(null);
  const innerFlexRef = useRef(null);

  const [activeIndex, setActiveIndex] = useState(null);
  const [showDragPrompt, setShowDragPrompt] = useState(true);

  useEffect(() => {
    imageRefs.current.forEach((el, i) => {
      if (el) {
        gsap.to(el, {
          scale: activeIndex === null ? 1 : i === activeIndex ? 1.15 : 0.85,
          filter: activeIndex === null || i === activeIndex ? "brightness(1)" : "brightness(0.5)",
          transformOrigin: "center center",
          duration: 0.3,
          ease: "power2.out",
        });
      }
    });
  }, [activeIndex]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseDown = (e) => {
      isDragging.current = true;
      container.classList.add('dragging');
      startX.current = e.pageX - container.offsetLeft;
      scrollLeft.current = container.scrollLeft;
      setShowDragPrompt(false);
    };

    const handleMouseLeave = () => {
      isDragging.current = false;
      container.classList.remove('dragging');
      setActiveIndex(null);
    };

    const handleMouseUp = () => {
      isDragging.current = false;
      container.classList.remove('dragging');
      setActiveIndex(null);
    };

    const handleMouseMove = (e) => {
      if (!isDragging.current) return;
      e.preventDefault();
      const x = e.pageX - container.offsetLeft;
      const walk = (x - startX.current) * 1.5;
      gsap.to(container, { scrollLeft: scrollLeft.current - walk, duration: 0.2, ease: "power2.out" });
    };

    // Touch event handlers
    const handleTouchStart = (e) => {
      isDragging.current = true;
      container.classList.add('dragging');
      startX.current = e.touches[0].pageX - container.offsetLeft;
      scrollLeft.current = container.scrollLeft;
      setShowDragPrompt(false);
    };

    const handleTouchMove = (e) => {
      if (!isDragging.current) return;
      e.preventDefault();
      const x = e.touches[0].pageX - container.offsetLeft;
      const walk = (x - startX.current) * 1.5;
      gsap.to(container, { scrollLeft: scrollLeft.current - walk, duration: 0.2, ease: "power2.out" });
    };

    const handleTouchEnd = () => {
      isDragging.current = false;
      container.classList.remove('dragging');
      setActiveIndex(null);
    };

    const scrollIllusion = () => {
      if (!container) return;
      const scrollWidth = container.scrollWidth;
      const containerWidth = container.clientWidth;
      const scrollLeft = container.scrollLeft;
      const threshold = containerWidth / 4; // smaller threshold

      if (scrollLeft < threshold) {
        gsap.set(container, { scrollLeft: scrollLeft + scrollWidth / 2 });
      } else if (scrollLeft + containerWidth > scrollWidth - threshold) {
        gsap.set(container, { scrollLeft: scrollLeft - scrollWidth / 2 });
      }
    };

    container.addEventListener("mousedown", handleMouseDown);
    container.addEventListener("mouseleave", handleMouseLeave);
    container.addEventListener("mouseup", handleMouseUp);
    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("scroll", scrollIllusion);

    // Touch event listeners
    container.addEventListener("touchstart", handleTouchStart, { passive: false });
    container.addEventListener("touchmove", handleTouchMove, { passive: false });
    container.addEventListener("touchend", handleTouchEnd);

    return () => {
      container.removeEventListener("mousedown", handleMouseDown);
      container.removeEventListener("mouseleave", handleMouseLeave);
      container.removeEventListener("mouseup", handleMouseUp);
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("scroll", scrollIllusion);
      // Remove touch event listeners
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchmove", handleTouchMove);
      container.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      const containerWidthPx = container.offsetWidth;
      const imageWidthPx = (imgWidth / 100) * window.innerWidth;
      container.scrollLeft = (container.scrollWidth / 2) - (containerWidthPx / 2 - imageWidthPx / 2 - 8); // 8px is half of 16px gap
    }
  }, []);

  useEffect(() => {
    if (!showDragPrompt) return;
    const interval = setInterval(() => {
      if (dragPromptRef.current) {
        gsap.fromTo(
          dragPromptRef.current,
          { x: -5 },
          { x: 5, yoyo: true, repeat: 1, duration: 0.1, ease: "power1.inOut" }
        );
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [showDragPrompt]);

  if (
    images.length < 4 ||
    (imgWidth * images.length + (images.length - 1) * (16 / window.innerWidth * 100)) <= containerWidth
  ) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center text-center text-lg text-white px-4">
        <p>ADD MORE IMAGES OR INCREASE THE SIZE OF IMAGE</p>
        <p>FOR THE SLIDER TO FUNCTION PROPERLY.</p>
      </div>
    );
  }

  // Move handleFlexMouseDown inside the component, above the return statement
  const handleFlexMouseDown = (e) => {
    if (!innerFlexRef.current) return;
    const children = innerFlexRef.current.children;
    let minDist = Infinity;
    let nearestIdx = null;

    for (let i = 0; i < children.length; i++) {
      const rect = children[i].getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const dist = Math.abs(e.clientX - centerX);
      if (dist < minDist) {
        minDist = dist;
        nearestIdx = i;
      }
    }

    if (nearestIdx !== null) {
      setActiveIndex(nearestIdx);
    }
  };

  return (
    <div className='w-full flex items-center justify-center'>
      {showDragPrompt && showDragHint && (
        <div
          ref={dragPromptRef}
          style={{
            position: 'fixed',
            top: `calc(50% + ${containerHeight / 2}vh + 16px)`,
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '8px',
            zIndex: 1000,
            fontSize: '1rem',
            pointerEvents: 'none',
            textTransform: 'uppercase',
            fontWeight: 'bold',
          }}
        >
          &lt; drag &gt;
        </div>
      )}
      <div
        ref={containerRef}
        style={{
          width: `${containerWidth}vw`,
          paddingTop: window.innerWidth < 768 ? '2vh' : '5vh',
          paddingBottom: window.innerWidth < 768 ? '2vh' : '5vh',
          overflow: 'hidden',
          overflowX: 'auto',
          overflowY: 'hidden',
          userSelect: 'none',
          cursor: 'grab',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          position: 'relative',
          ...(fadeMask && {
            maskImage: 'linear-gradient(to right, transparent 0px, black 20px, black calc(100% - 20px), transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to right, transparent 0px, black 20px, black calc(100% - 20px), transparent 100%)',
          }),
        }}
      >
        <div
          className='flex gap-4 w-max'
          ref={innerFlexRef}
          onMouseDown={handleFlexMouseDown}
        >
          {[...images, ...images].map((src, i) => (
            <div
              key={i}
              ref={el => (imageRefs.current[i] = el)}
              className="flex-shrink-0"
              onMouseDown={() => setActiveIndex(i)}
              onMouseUp={() => setActiveIndex(null)}
              style={{
                width: `${imgWidth}vw`,
                height: window.innerWidth < 768 ? `${containerHeight * 0.30}vh` : `${containerHeight}vh`,
                position: "relative",
              }}
            >
              <div style={{ position: "relative", width: "100%", height: "100%" }}>
                <img
                  src={src}
                  draggable="false"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: activeIndex !== null && i !== activeIndex ? "rgba(0,0,0,0.4)" : "transparent",
                    pointerEvents: "none",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DragSlider