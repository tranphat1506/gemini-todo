import { motion } from "framer-motion";
import { RiGeminiLine, RiGeminiFill } from "react-icons/ri";
import { TbZodiacGemini } from "react-icons/tb";
import { AiOutlineLoading } from "react-icons/ai";
import React from "react";

const stars = Array.from({ length: 50 });

const geminiIcons = [RiGeminiLine, TbZodiacGemini, RiGeminiFill];

const SplashScreen: React.FC = () => {
  return (
    <div className="w-full h-screen relative overflow-hidden bg-black text-white">
      {stars.map((_, i) => {
        const color = i % 2 === 0 ? "bg-white" : "bg-green-400";
        return (
          <motion.div
            key={i}
            className={`absolute rounded-full ${color}`}
            style={{
              width: Math.random() * 3 + 2,
              height: Math.random() * 3 + 2,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              repeatType: "mirror",
            }}
          />
        );
      })}

      {geminiIcons.map((Icon, i) => {
        const color = i % 2 === 0 ? "text-white" : "text-green-400";
        const positions = [
          { top: "15%", left: "10%" },
          { top: "40%", right: "12%" },
          { bottom: "30%", left: "20%" },
        ];
        return (
          <motion.div
            key={i}
            className={`absolute ${color}`}
            style={positions[i]}
            animate={{ y: [0, i % 2 === 0 ? -15 : 15, 0] }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Icon size={30} />
          </motion.div>
        );
      })}

      {/* Main Logo */}
      <motion.h1
        className="text-[clamp(2.25rem,5vw,4.5rem)] font-bold text-center absolute left-1/2 -translate-x-1/2"
        initial={{ top: "50%", opacity: 0 }}
        animate={{ top: "25%", opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 25 }}
      >
        Gemini<span className="text-green-400">Todo.</span>
      </motion.h1>

      {/* Loading và logo ở dưới */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center z-50">
        <div className="flex">
          <AiOutlineLoading
            className="my-auto animate-spin text-white"
            size={"1.5rem"}
          />
        </div>
        <div className="mx-auto mt-4 text-white">
          <TbZodiacGemini className="mx-auto" size={"1.25rem"} />
          <h2 className="text-sm leading-normal">GeminiCanCode</h2>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
