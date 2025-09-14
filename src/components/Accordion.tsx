import { useState } from "react";

interface AccordionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export default function Accordion({
  title,
  children,
  className,
}: AccordionProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`flex flex-col ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center w-full px-4 py-2 bg-[#222] rounded-lg text-white font-medium focus:outline-none"
      >
        <span>{title}</span>
        <svg
          className={`w-4 h-4 transform transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? "max-h-96 mt-2" : "max-h-0"
        }`}
      >
        {children}
      </div>
    </div>
  );
}
