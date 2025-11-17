import { useState, useRef, useEffect } from "react";
import { Pin, PinOff } from "lucide-react";

const TopbarCard = () => {
  const [isPinned, setIsPinned] = useState(true);
  const [isHeaderHovered, setIsHeaderHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState(null); // null means centered
  const dragInfoRef = useRef({ startX: 0, startPos: 0 });
  const cardRef = useRef(null);
  const containerRef = useRef(null);
  const animationFrameRef = useRef(null);

  // Calculate centered position on mount
  useEffect(() => {
    if (position === null && containerRef.current && cardRef.current) {
      const containerWidth = containerRef.current.offsetWidth;
      const cardWidth = cardRef.current.offsetWidth;
      const centeredX = (containerWidth - cardWidth) / 2;
      setPosition({ x: centeredX });
    }
  }, [position]);

  const handleMouseDown = (e) => {
    if (!isPinned) return;
    e.preventDefault();
    setIsDragging(true);
    dragInfoRef.current = {
      startX: e.clientX,
      startPos: position.x,
    };
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !containerRef.current || !cardRef.current || !position)
      return;

    // Cancel previous frame
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    // Use requestAnimationFrame for smooth, instant updates
    animationFrameRef.current = requestAnimationFrame(() => {
      if (!containerRef.current || !cardRef.current) return;

      const containerWidth = containerRef.current.offsetWidth;
      const cardWidth = cardRef.current.offsetWidth;
      const maxX = containerWidth - cardWidth - 20;

      const deltaX = e.clientX - dragInfoRef.current.startX;
      const newX = Math.max(
        20,
        Math.min(maxX, dragInfoRef.current.startPos + deltaX)
      );

      setPosition({ x: newX });
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove, { passive: false });
      window.addEventListener("mouseup", handleMouseUp);
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };
    }
  }, [isDragging]);

  const shouldShowCard = isPinned || isHeaderHovered;

  return (
    <div
      ref={containerRef}
      className="absolute left-0 right-0 top-0 bottom-0 pointer-events-none"
      onMouseEnter={() => !isDragging && setIsHeaderHovered(true)}
      onMouseLeave={() => !isDragging && setIsHeaderHovered(false)}
    >
      <div
        ref={cardRef}
        className={`absolute top-0 h-full pointer-events-auto ${
          shouldShowCard ? "opacity-100" : "opacity-0"
        } ${
          isDragging
            ? "cursor-grabbing"
            : isPinned
            ? "cursor-grab"
            : "cursor-default"
        }`}
        style={{
          left: position ? `${position.x}px` : "50%",
          transform: position
            ? isDragging
              ? "scale(1.02)"
              : "scale(1)"
            : "translateX(-50%)",
          transition: isDragging ? "none" : "opacity 0.2s, transform 0.2s",
        }}
        onMouseDown={handleMouseDown}
      >
        {/* Reverse Trapezoid Shape */}
        <div className="relative h-full flex items-center">
          {/* Pin/Unpin Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsPinned(!isPinned);
            }}
            className="absolute top-1 left-3 p-1 bg-cyan-600 hover:bg-cyan-500 rounded-md shadow-lg transition-all duration-200 hover:scale-110 z-10"
            title={isPinned ? "Unpin card" : "Pin card"}
            onMouseDown={(e) => e.stopPropagation()}
          >
            {isPinned ? (
              <Pin size={12} className="text-white" />
            ) : (
              <PinOff size={12} className="text-white" />
            )}
          </button>

          {/* Trapezoid Container - Reduced slope */}
          <div
            className="relative h-full px-10 flex items-center bg-gray-900 backdrop-blur-md border-t border-b border-cyan-700/30 shadow-2xl"
            style={{
              clipPath: "polygon(0% 0%, 5% 100%, 95% 100%, 100% 0%)", // Reduced slope from 8%/92% to 5%/95%
              boxShadow:
                "0 0 20px rgba(6, 182, 212, 0.15), inset 0 1px 0 rgba(6, 182, 212, 0.2)",
            }}
          >
            {/* Stats Content */}
            <div className="flex items-center gap-8 py-1">
              {/* Stat 1 */}
              <div className="flex flex-col items-center min-w-[80px]">
                <div className="text-lg font-bold text-cyan-400">1,758</div>{" "}
                {/* Reduced from xl to lg */}
                <div className="text-[9px] text-gray-400 text-center leading-tight">
                  Active Machines
                </div>
              </div>

              {/* Divider */}
              <div className="h-8 w-px bg-gradient-to-b from-transparent via-gray-600 to-transparent"></div>

              {/* Stat 2 */}
              <div className="flex flex-col items-center min-w-[80px]">
                <div className="text-lg font-bold text-cyan-400">21.80M</div>{" "}
                {/* Changed to cyan-400 */}
                <div className="text-[9px] text-gray-400 text-center leading-tight">
                  Active Definitions
                </div>
              </div>

              {/* Divider */}
              <div className="h-8 w-px bg-gradient-to-b from-transparent via-gray-600 to-transparent"></div>

              {/* Stat 3 */}
              <div className="flex flex-col items-center min-w-[80px]">
                <div className="text-lg font-bold text-cyan-400">34</div>{" "}
                {/* Changed to cyan-400 */}
                <div className="text-[9px] text-gray-400 text-center leading-tight">
                  Scan Issues
                </div>
              </div>

              {/* Divider */}
              <div className="h-8 w-px bg-gradient-to-b from-transparent via-gray-600 to-transparent"></div>

              {/* Stat 4 */}
              <div className="flex flex-col items-center min-w-[80px]">
                <div className="text-lg font-bold text-cyan-400">7</div>{" "}
                {/* Changed to cyan-400 */}
                <div className="text-[9px] text-gray-400 text-center leading-tight">
                  Pending Updates
                </div>
              </div>
            </div>
          </div>

          {/* Drag Indicator */}
          {isPinned && (
            <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex gap-0.5 opacity-50">
              <div className="w-0.5 h-0.5 bg-gray-500 rounded-full"></div>
              <div className="w-0.5 h-0.5 bg-gray-500 rounded-full"></div>
              <div className="w-0.5 h-0.5 bg-gray-500 rounded-full"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopbarCard;
