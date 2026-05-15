import { motion } from "motion/react";
import { Plane, MapPin, Compass, Globe } from "lucide-react";

export function FloatingElements() {
  const icons = [
    { Icon: Plane, delay: 0, duration: 8 },
    { Icon: MapPin, delay: 2, duration: 10 },
    { Icon: Compass, delay: 4, duration: 9 },
    { Icon: Globe, delay: 6, duration: 11 },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {icons.map(({ Icon, delay, duration }, i) => (
        <motion.div
          key={i}
          animate={{
            y: [0, -100, 0],
            x: [0, 50, 0],
            rotate: [0, 180, 360],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration,
            delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute"
          style={{
            left: `${20 + i * 20}%`,
            top: `${10 + i * 15}%`,
          }}
        >
          <Icon className="w-16 h-16 text-cyan-400/20" />
        </motion.div>
      ))}
    </div>
  );
}
