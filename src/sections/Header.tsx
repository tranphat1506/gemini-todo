import Container from "@/components/Container";
import IconButton from "@/components/IconButton";
import { RiArrowLeftSLine, RiSearch2Line } from "react-icons/ri";
import { Link, useLocation, useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";

interface HeaderButtonState {
  time?: boolean;
  search?: boolean;
  add?: boolean;
  logout?: boolean;
}

export interface HeaderProps {
  buttonState?: HeaderButtonState;
  className?: string;
}
const Header: React.FC<HeaderProps> = ({ buttonState, className }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  const isCanGoBack = currentPath != "/" && window.history.length > 1;
  const handleGoBack = () => {
    // Kiểm tra nếu history.length > 1, có nghĩa là có trang trước đó để quay lại.
    if (isCanGoBack) {
      navigate(-1); // Quay lại trang trước đó
    } else {
      // Nếu không có lịch sử để quay lại, chuyển hướng về trang chủ
      navigate("/");
    }
  };
  return (
    <div>
      <Container
        className={clsx(
          "bg-black px-4 py-4 flex items-center relative w-full",
          className
        )}
      >
        {/* Back Button */}
        <AnimatePresence>
          {isCanGoBack && (
            <motion.div
              key="back-btn"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="absolute left-4"
            >
              <IconButton
                onClick={handleGoBack}
                className="active:!text-gray-400 text-white"
                icon={<RiArrowLeftSLine size={"1.25rem"} />}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Logo */}
        <motion.div
          key="logo"
          initial={false}
          animate={{
            left: !isCanGoBack ? "1rem" : "50%",
            x: !isCanGoBack ? 0 : "-50%",
          }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="absolute"
        >
          <Link to={"/"}>
            <h1 className="text-2xl font-bold text-white">
              Gemini<span className="text-green-400">Todo.</span>
            </h1>
          </Link>
        </motion.div>

        {/* Right Buttons */}
        <div className="min-h-[28px] flex flex-1 justify-end items-center gap-3 ml-auto">
          {buttonState?.time && (
            <h2 className="text-sm font-light">
              {new Date().toLocaleString()}
            </h2>
          )}
          {buttonState?.search && (
            <IconButton
              className="active:!text-gray-400 text-white"
              icon={<RiSearch2Line size={"1.25rem"} />}
            />
          )}
        </div>
      </Container>
    </div>
  );
};

export default Header;
