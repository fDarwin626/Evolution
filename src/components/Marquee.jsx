import gsap from "gsap";
import { Observer } from "gsap/all";
import { useEffect, useRef, useMemo, memo } from "react"

gsap.registerPlugin(Observer);

const Marquee = memo(({ 
  items, 
  icon = "★", // Use simple text/emoji instead of Iconify
  className = "text-white bg-black",
  IconclassName = "w-10 h-15 text-gold", 
  reverse = false,
}) => {
  const containerRef = useRef(null);
  const itemsRef = useRef([]);
  const tlRef = useRef(null);
  const observerRef = useRef(null);
  const rafRef = useRef(null); // For throttling

  // Detect mobile for performance adjustments
  const isMobile = useMemo(() => 
    typeof window !== 'undefined' && window.innerWidth < 768, 
    []
  );

  // Memoize duplicated items - REDUCE duplicates
  const displayItems = useMemo(() => {
    if (!items || items.length === 0) return [];
    // Reduce duplicates: Mobile 2x, Desktop 2x (was 3x)
    const duplicateCount = 2;
    return Array(duplicateCount).fill(items).flat();
  }, [items, isMobile]);

  useEffect(() => {
    if (!itemsRef.current.length || !containerRef.current) return;

    const horizontalLoop = (items, config) => {
      items = gsap.utils.toArray(items);
      config = config || {};
      
      const tl = gsap.timeline({
        repeat: config.repeat, 
        paused: config.paused, 
        defaults: { ease: "none" }, 
        onReverseComplete: () => tl.totalTime(tl.rawTime() + tl.duration() * 100)
      });

      const length = items.length;
      const startX = items[0].offsetLeft;
      const times = [];
      const widths = [];
      const xPercents = [];
      let curIndex = 0;
      
      // Adjust speed based on device - SLOWER on mobile
      const baseSpeed = isMobile ? 0.5 : 0.8;
      const pixelsPerSecond = (config.speed || baseSpeed) * 100;
      const snap = config.snap === false ? v => v : gsap.utils.snap(config.snap || 1);

      // Set up initial positions
      gsap.set(items, {
        xPercent: (i, el) => {
          const w = widths[i] = parseFloat(gsap.getProperty(el, "width", "px"));
          xPercents[i] = snap(
            parseFloat(gsap.getProperty(el, "x", "px")) / w * 100 + 
            gsap.getProperty(el, "xPercent")
          );
          return xPercents[i];
        }
      });

      gsap.set(items, { x: 0 });

      const totalWidth = items[length - 1].offsetLeft + 
        xPercents[length - 1] / 100 * widths[length - 1] - startX + 
        items[length - 1].offsetWidth * gsap.getProperty(items[length - 1], "scaleX") + 
        (parseFloat(config.paddingRight) || 0);

      for (let i = 0; i < length; i++) {
        const item = items[i];
        const curX = xPercents[i] / 100 * widths[i];
        const distanceToStart = item.offsetLeft + curX - startX;
        const distanceToLoop = distanceToStart + widths[i] * gsap.getProperty(item, "scaleX");
        
        tl.to(item, {
          xPercent: snap((curX - distanceToLoop) / widths[i] * 100), 
          duration: distanceToLoop / pixelsPerSecond
        }, 0)
        .fromTo(item, 
          { xPercent: snap((curX - distanceToLoop + totalWidth) / widths[i] * 100) }, 
          { 
            xPercent: xPercents[i], 
            duration: (curX - distanceToLoop + totalWidth - curX) / pixelsPerSecond, 
            immediateRender: false 
          }, 
          distanceToLoop / pixelsPerSecond
        )
        .add("label" + i, distanceToStart / pixelsPerSecond);
        
        times[i] = distanceToStart / pixelsPerSecond;
      }

      function toIndex(index, vars) {
        vars = vars || {};
        if (Math.abs(index - curIndex) > length / 2) {
          index += index > curIndex ? -length : length;
        }
        const newIndex = gsap.utils.wrap(0, length, index);
        let time = times[newIndex];
        
        if (time > tl.time() !== index > curIndex) {
          vars.modifiers = { time: gsap.utils.wrap(0, tl.duration()) };
          time += tl.duration() * (index > curIndex ? 1 : -1);
        }
        curIndex = newIndex;
        vars.overwrite = true;
        return tl.tweenTo(time, vars);
      }

      tl.next = vars => toIndex(curIndex + 1, vars);
      tl.previous = vars => toIndex(curIndex - 1, vars);
      tl.current = () => curIndex;
      tl.toIndex = (index, vars) => toIndex(index, vars);
      tl.times = times;
      tl.progress(1, true).progress(0, true);
      
      if (config.reversed) {
        tl.vars.onReverseComplete();
        tl.reverse();
      }
      
      return tl;
    };

    // Create timeline with reduced speed
    tlRef.current = horizontalLoop(itemsRef.current, {
      repeat: -1,
      paddingRight: isMobile ? 15 : 25,
      reversed: reverse,
      speed: isMobile ? 0.5 : 0.8
    });

    // Create observer with HEAVY throttling on mobile
    let lastUpdate = 0;
    const throttleDelay = isMobile ? 100 : 50; // Throttle updates

    observerRef.current = Observer.create({
      target: window,
      type: isMobile ? "touch" : "wheel,touch", // Remove scroll on mobile
      tolerance: isMobile ? 30 : 10,
      onChangeY(self) {
        const now = Date.now();
        
        // Throttle updates on mobile
        if (now - lastUpdate < throttleDelay) {
          if (rafRef.current) cancelAnimationFrame(rafRef.current);
          return;
        }
        lastUpdate = now;
        
        if (!tlRef.current) return;
        
        // REDUCE effect intensity significantly on mobile
        const baseFactor = isMobile ? 1 : 2;
        let factor = baseFactor;
        
        if ((!reverse && self.deltaY < 0) || (reverse && self.deltaY > 0)) {
          factor *= -1;
        }
        
        // Use RAF to batch updates
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        
        rafRef.current = requestAnimationFrame(() => {
          gsap.timeline({
            defaults: { ease: "power1.out" }
          })
          .to(tlRef.current, { 
            timeScale: factor * (isMobile ? 1.2 : 2), 
            duration: isMobile ? 0.3 : 0.2, 
            overwrite: true 
          })
          .to(tlRef.current, { 
            timeScale: factor / (isMobile ? 1.2 : 2), 
            duration: isMobile ? 1.5 : 1 
          }, "+=0.2");
        });
      }
    });

    // Cleanup
    return () => {
      if (tlRef.current) {
        tlRef.current.kill();
        tlRef.current = null;
      }
      if (observerRef.current) {
        observerRef.current.kill();
        observerRef.current = null;
      }
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [items, reverse, isMobile]);

  return (
    <div 
      ref={containerRef}
      className={`overflow-hidden w-full h-15 md:h-[60px]
        flex items-center marquee-text-responsive uppercase
        whitespace-nowrap ${className}`}
      style={{ 
        willChange: 'transform',
        transform: 'translate3d(0, 0, 0)',
        WebkitTransform: 'translate3d(0, 0, 0)',
      }}
    >
      <div 
        className="flex"
        style={{ 
          transform: 'translate3d(0, 0, 0)',
        }}
      >
        {displayItems.map((text, index) => (
          <span
            ref={(el) => {
              if (el) itemsRef.current[index] = el;
            }}
            key={`${text}-${index}`}
            className="flex items-center px-8 gap-x-8 md:px-16 md:gap-x-16"
            style={{ 
              transform: 'translate3d(0, 0, 0)',
            }}
          >
            {text}
            <span className={IconclassName}>{icon}</span>
          </span>
        ))}
      </div>
    </div>
  );
});

Marquee.displayName = 'Marquee';

export default Marquee;