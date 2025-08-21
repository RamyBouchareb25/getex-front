"use client";
import React from "react";

const SalamiLoadingAnimation = ({
  size = "md",
  showLoading = true,
}: {
  size?: "lg" | "sm" | "md";
  showLoading?: boolean;
}) => {
  // Define size classes
  const sizeMap = {
    lg: {
      tube: "w-32 h-12",
      endCap: "w-12 h-12 -right-2",
      knifeHandle: "w-10 h-4",
      knifeBlade: "w-12 h-2",
      slice: "w-10 h-10",
      sliceArea: "w-24 h-36 right-0 top-8",
      loadingText: "mt-16 text-lg",
    },
    md: {
      tube: "w-20 h-8",
      endCap: "w-8 h-8 -right-1",
      knifeHandle: "w-6 h-3",
      knifeBlade: "w-8 h-1.5",
      slice: "w-6 h-6",
      sliceArea: "w-16 h-24 right-0 top-4",
      loadingText: "mt-12 text-base",
    },
    sm: {
      tube: "w-12 h-5",
      endCap: "w-5 h-5 -right-0.5",
      knifeHandle: "w-4 h-2",
      knifeBlade: "w-6 h-1",
      slice: "w-4 h-4",
      sliceArea: "w-10 h-16 right-0 top-2",
      loadingText: "mt-8 text-sm",
    },
  };
  const sz = sizeMap[size] || sizeMap["md"];
  return (
    <div className="flex-col inline-flex items-center justify-center">
      <div className="relative flex items-center justify-center">
        {/* Main container for salami and cutting area */}
        <div className="relative">
          {/* Salami/Kachir body */}
          <div className="relative">
            {/* Main salami tube */}
            <div
              className={`${sz.tube} bg-gradient-to-r from-red-600 via-red-500 to-red-600 rounded-full relative overflow-hidden shadow-lg`}
            >
              {/* Salami pattern/texture */}
              <div className="absolute inset-0 bg-gradient-to-b from-red-400 to-red-700 opacity-50"></div>
              {/* White fat spots */}
              <div className="absolute top-1 left-2 w-1 h-1 bg-white rounded-full opacity-80"></div>
              <div className="absolute top-4 left-6 w-1 h-1 bg-white rounded-full opacity-80"></div>
              <div className="absolute top-2 left-10 w-1 h-1 bg-white rounded-full opacity-80"></div>
              <div className="absolute top-5 left-14 w-1 h-1 bg-white rounded-full opacity-80"></div>
            </div>

            {/* End cap - cutting surface */}
            <div
              className={`absolute ${sz.endCap} top-0 bg-gradient-to-r from-red-600 to-red-700 rounded-full shadow-md`}
            >
              <div className="absolute inset-1 bg-gradient-to-br from-red-400 to-red-800 rounded-full">
                {/* Inner pattern */}
                <div className="absolute top-1 left-1 w-1 h-1 bg-white rounded-full opacity-70"></div>
                <div className="absolute top-3 left-2 w-1 h-1 bg-white rounded-full opacity-70"></div>
                <div className="absolute top-2 left-4 w-1 h-1 bg-white rounded-full opacity-70"></div>
              </div>
            </div>
          </div>

          {/* Animated knife - angled for cutting */}
          <div className="absolute -right-2 top-0">
            <div
              className="relative flex items-center"
              style={{
                transform: "rotate(15deg)",
                transformOrigin: "left center",
                animation: "slice 1.2s ease-in-out infinite",
              }}
            >
              {/* Knife handle */}
              <div
                className={`${sz.knifeHandle} bg-gradient-to-r from-amber-700 to-amber-900 rounded-sm shadow-sm relative`}
              >
                <div className="absolute inset-0.5 bg-gradient-to-r from-amber-600 to-amber-800 rounded-sm"></div>
                <div className="absolute top-0.5 left-1 right-1 h-0.5 bg-amber-500 rounded-sm opacity-60"></div>
              </div>

              {/* Knife blade */}
              <div
                className={`${sz.knifeBlade} bg-gradient-to-r from-gray-200 to-gray-500 relative shadow-sm`}
                style={{
                  clipPath: "polygon(0 20%, 85% 0, 100% 50%, 85% 100%, 0 80%)",
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-white to-gray-400 opacity-70"></div>
                <div className="absolute top-0 left-0 right-2 h-px bg-white opacity-90"></div>
              </div>
            </div>
          </div>

          {/* Falling slices - positioned to fall from the salami's right end */}
          <div className={`absolute ${sz.sliceArea}`}>
            {/* Slice 1 */}
            <div
              className={`absolute ${sz.slice} bg-gradient-to-br from-red-500 to-red-700 rounded-full shadow-md border border-red-800`}
              style={{
                animation: "fall1 1.5s ease-in infinite",
                right: "0px",
                top: "0px",
              }}
            >
              <div className="absolute inset-0.5 bg-gradient-to-br from-red-400 to-red-800 rounded-full">
                <div className="absolute top-1 right-1 w-0.5 h-0.5 bg-pink-200 rounded-full opacity-80"></div>
                <div className="absolute top-3 right-1 w-0.5 h-0.5 bg-pink-200 rounded-full opacity-80"></div>
                <div className="absolute top-2 right-3 w-0.5 h-0.5 bg-pink-200 rounded-full opacity-80"></div>
              </div>
            </div>

            {/* Slice 2 */}
            <div
              className={`absolute ${sz.slice} bg-gradient-to-br from-red-500 to-red-700 rounded-full shadow-md border border-red-800`}
              style={{
                animation: "fall2 1.5s ease-in infinite",
                right: "0px",
                top: "0px",
              }}
            >
              <div className="absolute inset-0.5 bg-gradient-to-br from-red-400 to-red-800 rounded-full">
                <div className="absolute top-1 right-1 w-0.5 h-0.5 bg-pink-200 rounded-full opacity-80"></div>
                <div className="absolute top-1 right-3 w-0.5 h-0.5 bg-pink-200 rounded-full opacity-80"></div>
                <div className="absolute top-3 right-2 w-0.5 h-0.5 bg-pink-200 rounded-full opacity-80"></div>
              </div>
            </div>

            {/* Slice 3 */}
            <div
              className={`absolute ${sz.slice} bg-gradient-to-br from-red-500 to-red-700 rounded-full shadow-md border border-red-800`}
              style={{
                animation: "fall3 1.5s ease-in infinite",
                right: "0px",
                top: "0px",
              }}
            >
              <div className="absolute inset-0.5 bg-gradient-to-br from-red-400 to-red-800 rounded-full">
                <div className="absolute top-1 right-2 w-0.5 h-0.5 bg-pink-200 rounded-full opacity-80"></div>
                <div className="absolute top-3 right-1 w-0.5 h-0.5 bg-pink-200 rounded-full opacity-80"></div>
                <div className="absolute top-2 right-1 w-0.5 h-0.5 bg-pink-200 rounded-full opacity-80"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Loading text */}
      {showLoading && (
        <div
          className={`${sz.loadingText} text-gray-600 font-medium animate-pulse`}
        >
          Loading...
        </div>
      )}

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes slice {
          0% {
            transform: translateY(0px) rotate(15deg);
          }
          30% {
            transform: translateY(6px) rotate(15deg);
          }
          60% {
            transform: translateY(10px) rotate(15deg);
          }
          100% {
            transform: translateY(0px) rotate(15deg);
          }
        }

        @keyframes fall1 {
          0% {
            transform: translateY(0px) translateX(0px) rotate(0deg);
            opacity: 0;
          }
          20% {
            opacity: 1;
          }
          100% {
            transform: translateY(70px) translateX(8px) rotate(180deg);
            opacity: 0;
          }
        }

        @keyframes fall2 {
          0% {
            transform: translateY(0px) translateX(0px) rotate(0deg);
            opacity: 0;
          }
          30% {
            opacity: 1;
          }
          100% {
            transform: translateY(75px) translateX(4px) rotate(220deg);
            opacity: 0;
          }
        }

        @keyframes fall3 {
          0% {
            transform: translateY(0px) translateX(0px) rotate(0deg);
            opacity: 0;
          }
          40% {
            opacity: 1;
          }
          100% {
            transform: translateY(80px) translateX(12px) rotate(270deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default SalamiLoadingAnimation;
