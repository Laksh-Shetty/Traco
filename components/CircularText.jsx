import { useEffect } from "react";
import { motion, useAnimation, useMotionValue } from "motion/react";

const getRotationTransition = (duration, from, loop = true) => ({
  from,
  to: from + 360,
  ease: "linear",
  duration,
  type: "tween",
  repeat: loop ? Infinity : 0,
});

const getTransition = (duration, from) => ({
  rotate: getRotationTransition(duration, from),
  scale: {
    type: "spring",
    damping: 20,
    stiffness: 300,
  },
});

const CircularText = ({ text, spinDuration = 20, onHover = 'speedUp', className = '', children }) => {
  const letters = Array.from(text);
  const controls = useAnimation();
  const rotation = useMotionValue(0);

  // RESPONSIVE LOGIC: 80vw for small screens, 40vw for large
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const sizeVw = isMobile ? 80 : 40; 
  const radiusVw = sizeVw / 2;

  useEffect(() => {
    const start = rotation.get();
    controls.start({
      rotate: start + 360,
      scale: 1,
      transition: getTransition(spinDuration, start)
    });
  }, [spinDuration, text, onHover, controls, rotation]);


  const handleHoverStart = () => {
    const start = rotation.get();
    console.log("CircularText mounted with text:", text);
    if (!onHover) return;

    let transitionConfig;
    let scaleVal = 1;

    switch (onHover) {
      case "slowDown":
        transitionConfig = getTransition(spinDuration * 2, start);
        break;
      case "speedUp":
        transitionConfig = getTransition(spinDuration / 4, start);
        break;
      case "pause":
        transitionConfig = {
          rotate: { type: "spring", damping: 20, stiffness: 300 },
          scale: { type: "spring", damping: 20, stiffness: 300 },
        };
        scaleVal = 1;
        break;
      case "goBonkers":
        transitionConfig = getTransition(spinDuration / 20, start);
        scaleVal = 0.8;
        break;
      default:
        transitionConfig = getTransition(spinDuration, start);
    }

    controls.start({
      rotate: start + 360,
      scale: scaleVal,
      transition: transitionConfig,
    });
  };

  const handleHoverEnd = () => {
    const start = rotation.get();
    controls.start({
      rotate: start + 360,
      scale: 1,
      transition: getTransition(spinDuration, start),
    });
  };


  return (
    <div 
      className={`circular-container ${className}`} 
      style={{ 
        position: 'relative', 
        width: `${sizeVw}vw`, 
        height: `${sizeVw}vw`,
        margin: '0 auto' // Keeps it centered on the page
      }}
    >
      <motion.div
        className="circular-text"
        style={{ 
          rotate: rotation,
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        animate={controls}
        onMouseEnter={handleHoverStart}
        onMouseLeave={handleHoverEnd}
      >
        {letters.map((letter, i) => {
          const rotationDeg = (360 / letters.length) * i;
          // Dynamically uses the 40vw or 80vw radius
          const transform = `rotateZ(${rotationDeg}deg) translateY(-${radiusVw}vw)`;

          return (
            <span 
              key={i} 
              style={{ 
                position: 'absolute', 
                transform, 
                left: '50%', 
                top: '50%', 
                transformOrigin: '0 0',
                fontSize: isMobile ? '3.5vw' : '1.5vw', // Larger font on mobile
                fontWeight: 'bold',
                whiteSpace: 'pre'
              }}
            >
              {letter}
            </span>
          );
        })}
      </motion.div>

      <div className="circular-center-content" style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        zIndex: 10,
        pointerEvents: 'none',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {children}
      </div>
    </div>
  );

};

export default CircularText;