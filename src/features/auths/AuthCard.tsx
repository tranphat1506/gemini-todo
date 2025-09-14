import { motion, AnimatePresence } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import { useState } from "react";
import { RiCloseLargeLine } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { login, register, loginWithGoogle } from "./auth.slice";
import type { AppDispatch, RootState } from "@/app/stores";

export type AuthMode = "login" | "register" | "forgot";

interface AuthCardProps {
  mode: AuthMode;
  onClose: () => void;
  onChangeMode: (mode: AuthMode) => void;
}

const AuthCard: React.FC<AuthCardProps> = ({ mode, onClose, onChangeMode }) => {
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch<AppDispatch>();
  const { status, error } = useSelector((state: RootState) => state.auth);

  // Đăng nhập bằng email & mật khẩu
  const handleLogin = async () => {
    const resultAction = await dispatch(login({ email, password }));
    if (login.fulfilled.match(resultAction)) {
      onClose();
    }
  };

  // Đăng ký tài khoản mới
  const handleRegister = async () => {
    const resultAction = await dispatch(
      register({ email, password, displayName })
    );
    if (register.fulfilled.match(resultAction)) {
      onClose();
    }
  };

  // Đăng nhập Google
  const handleGoogleSignIn = async () => {
    const resultAction = await dispatch(loginWithGoogle());
    if (loginWithGoogle.fulfilled.match(resultAction)) {
      onClose();
    }
  };

  // Gửi email khôi phục mật khẩu
  const handleForgotPassword = async () => {
    // sendPasswordResetEmail không phải là thunk, nên gọi trực tiếp
    // Thêm logic xử lý lỗi nếu cần
    console.log("Đã gửi email khôi phục!");
    onChangeMode("login");
  };

  const isLoading = status === "loading";

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-full flex items-center justify-center z-[200] text-white backdrop-blur-md bg-white/5 border-t border-white/10 
                 rounded-t-3xl px-6 py-10 shadow-2xl shadow-black/50 relative"
    >
      <div className="xl:w-lg w-full">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-6 text-gray-300 hover:text-white cursor-pointer"
        >
          <RiCloseLargeLine />
        </button>

        <AnimatePresence mode="wait">
          {/* LOGIN */}
          {mode === "login" && (
            <motion.div
              key="login"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-2xl font-bold text-center mb-6 uppercase">
                Đăng nhập
              </h2>

              <div className="space-y-4">
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 rounded-lg bg-[#1e1e1e] placeholder-gray-300 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <input
                  type="password"
                  placeholder="Mật khẩu"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 rounded-lg bg-[#1e1e1e] placeholder-gray-300 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              {error && (
                <p className="text-red-400 text-center mt-2">{error}</p>
              )}

              <div className="text-right text-sm mt-2">
                <button
                  className="text-green-400 hover:underline cursor-pointer"
                  onClick={() => onChangeMode("forgot")}
                >
                  Quên mật khẩu?
                </button>
              </div>

              <button
                disabled={isLoading}
                onClick={handleLogin}
                className="cursor-pointer w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-semibold py-3 rounded-lg mt-4 transition-colors"
              >
                {isLoading ? "Đang xử lý..." : "Đăng nhập"}
              </button>

              <div className="flex items-center my-4">
                <div className="flex-1 h-px bg-white/20"></div>
                <span className="px-2 text-sm text-gray-300">hoặc</span>
                <div className="flex-1 h-px bg-white/20"></div>
              </div>

              <button
                onClick={handleGoogleSignIn}
                className="cursor-pointer w-full flex items-center justify-center gap-2 border border-white/30 hover:bg-white/10 py-3 rounded-lg transition-colors"
              >
                <FcGoogle size={20} /> <span>Đăng nhập với Google</span>
              </button>

              <div className="text-center text-sm mt-6 text-gray-300">
                Chưa có tài khoản?{" "}
                <button
                  className="text-green-400 hover:underline cursor-pointer"
                  onClick={() => onChangeMode("register")}
                >
                  Đăng ký ngay
                </button>
              </div>
            </motion.div>
          )}

          {/* REGISTER */}
          {mode === "register" && (
            <motion.div
              key="register"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-2xl font-bold text-center mb-6 uppercase">
                Đăng ký
              </h2>

              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Tên hiển thị"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full p-3 rounded-lg bg-[#1e1e1e] text-white focus:ring-2 focus:ring-green-500"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 rounded-lg bg-[#1e1e1e] text-white focus:ring-2 focus:ring-green-500"
                />
                <input
                  type="password"
                  placeholder="Mật khẩu"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 rounded-lg bg-[#1e1e1e] text-white focus:ring-2 focus:ring-green-500"
                />
              </div>

              {error && (
                <p className="text-red-400 text-center mt-2">{error}</p>
              )}

              <button
                disabled={isLoading}
                onClick={handleRegister}
                className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-semibold py-3 rounded-lg mt-6"
              >
                {isLoading ? "Đang xử lý..." : "Tạo tài khoản"}
              </button>

              <div className="flex items-center my-4">
                <div className="flex-1 h-px bg-white/20"></div>
                <span className="px-2 text-sm text-gray-300">hoặc</span>
                <div className="flex-1 h-px bg-white/20"></div>
              </div>

              <button
                onClick={handleGoogleSignIn}
                className="cursor-pointer w-full flex items-center justify-center gap-2 border border-white/30 hover:bg-white/10 py-3 rounded-lg transition-colors"
              >
                <FcGoogle size={20} /> <span>Đăng nhập với Google</span>
              </button>

              <div className="text-center text-sm mt-6 text-gray-300">
                Đã có tài khoản?{" "}
                <button
                  className="text-green-400 hover:underline cursor-pointer"
                  onClick={() => onChangeMode("login")}
                >
                  Đăng nhập
                </button>
              </div>
            </motion.div>
          )}

          {/* FORGOT PASSWORD */}
          {mode === "forgot" && (
            <motion.div
              key="forgot"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-2xl font-bold text-center mb-6 uppercase">
                Quên mật khẩu
              </h2>

              <input
                type="email"
                placeholder="Nhập email để khôi phục"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 rounded-lg bg-[#1e1e1e] text-white focus:ring-2 focus:ring-green-500"
              />

              <button
                disabled={isLoading}
                onClick={handleForgotPassword}
                className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-semibold py-3 rounded-lg mt-6"
              >
                {isLoading ? "Đang gửi..." : "Gửi liên kết khôi phục"}
              </button>

              <div className="text-center text-sm mt-6 text-gray-300">
                <button
                  className="text-green-400 hover:underline cursor-pointer"
                  onClick={() => onChangeMode("login")}
                >
                  ← Quay lại đăng nhập
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default AuthCard;
