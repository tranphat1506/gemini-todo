import AuthCard, { type AuthMode } from "@/features/auths/AuthCard";
import { useAppSelector } from "@/hooks/storeHooks";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { RiGeminiLine, RiGeminiFill } from "react-icons/ri";
import { TbZodiacGemini } from "react-icons/tb";
import { useNavigate } from "react-router";

const stars = Array.from({ length: 50 });

const geminiIcons = [RiGeminiLine, TbZodiacGemini, RiGeminiFill];

const WelcomeScreen: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [showAuth, setShowAuth] = useState(false);
  const handleNavToRegisterPage = () => {
    setShowAuth(true);
    setAuthMode("register");
  };
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

      <motion.h1
        className="text-[clamp(2.25rem,5vw,4.5rem)] font-bold text-center absolute left-1/2 -translate-x-1/2"
        initial={{ top: "50%", opacity: 0 }}
        animate={{ top: "25%", opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 25 }}
      >
        Gemini<span className="text-green-400">Todo.</span>
      </motion.h1>

      <motion.div
        className="absolute bottom-0 w-full max-h-[90vh] overflow-y-auto"
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.6 }}
      >
        {!showAuth && (
          <div
            className="backdrop-blur-xs bg-white/5 border-t border-white/10 
                        rounded-t-3xl px-6 py-10 shadow-2xl shadow-black/50"
          >
            <h2 className="text-2xl font-semibold text-center mb-3">
              Welcome 👋
            </h2>
            <p className="text-center text-gray-200 mb-6">
              GeminiTodo giúp bạn quản lý công việc dễ dàng và tập trung hiệu
              quả với phương pháp Pomodoro.
            </p>

            <div className="flex w-full flex-col items-center">
              <motion.button
                onClick={handleNavToRegisterPage}
                whileTap={{ scale: 0.95 }}
                className="w-full max-w-md bg-green-600 text-white py-3 rounded-2xl font-medium 
                       backdrop-blur-md border border-green-400 cursor-pointer"
              >
                Bắt đầu ngay
              </motion.button>

              <button
                onClick={() => setShowAuth(true)}
                className="w-full max-w-md mt-4 text-sm text-gray-400 hover:underline cursor-pointer"
              >
                Đã có tài khoản? Đăng nhập
              </button>
            </div>
          </div>
        )}
        {showAuth && (
          <AuthCard
            mode={authMode}
            onClose={() => setShowAuth(false)}
            onChangeMode={(m) => setAuthMode(m)}
          />
        )}
      </motion.div>
    </div>
  );
};

export default WelcomeScreen;
