import clsx from "clsx";
import React, { useState } from "react";

interface AvatarProps {
  displayName: string;
  photoURL?: string | null;
  className?: string;
}

const Avatar: React.FC<AvatarProps> = ({
  displayName,
  photoURL,
  className,
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const initial = displayName.charAt(0).toUpperCase();

  if (hasError || !photoURL) {
    return (
      <div
        className={clsx(
          "w-10 h-10 rounded-full flex items-center justify-center bg-gray-300 text-gray-700 font-medium",
          className
        )}
      >
        {initial}
      </div>
    );
  }

  return (
    <img
      src={photoURL}
      alt={`${displayName}'s avatar`}
      onLoad={() => setIsLoaded(true)}
      onError={() => setHasError(true)}
      referrerPolicy="no-referrer"
      className={clsx(
        "w-10 h-10 rounded-full object-cover",
        className,
        !isLoaded && "hidden"
      )}
    />
  );
};

export default Avatar;
