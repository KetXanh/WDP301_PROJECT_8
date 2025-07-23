import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Gift, Zap } from "lucide-react";

function getSegments(discounts) {
  const segments = [];
  const colors = [
    '#10b981', // emerald-500
    '#f59e0b', // amber-500
    '#3b82f6', // blue-500
    '#ef4444'  // red-500
  ];
  
  discounts.forEach((d, idx) => {
    for (let i = 0; i < (d.quantity || 1); i++) {
      segments.push({
        type: "discount",
        label: `${d.code} (${d.discountValue || d.percentage || d.value || d.discount || 0}%)`,
        color: colors[idx % colors.length],
        discount: d
      });
    }
  });
  
  // Thêm segment may mắn
  segments.push({
    type: "lose",
    label: "Chúc bạn may mắn lần sau",
    color: "#8b5cf6", // violet-500
    isLucky: true
  });
  
  return segments;
}

export default function LuckyWheel({ discounts, receivableQuantity, onSpin }) {
  const segments = getSegments(discounts);
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [resultIdx, setResultIdx] = useState(null);
  const [result, setResult] = useState(null);
  const wheelRef = useRef(null);

  const spinWheel = () => {
    if (isSpinning || receivableQuantity <= 0) return;
    setIsSpinning(true);
    setResult(null);
    setResultIdx(null);
    
    // Random segment
    const idx = Math.floor(Math.random() * segments.length);
    
    // Quay nhiều vòng rồi dừng đúng segment
    const segAngle = 360 / segments.length;
    const randomFullRot = 8 + Math.floor(Math.random() * 5); // 8-12 vòng
    const targetAngle = 360 * randomFullRot - idx * segAngle - segAngle / 2;
    
    // Bắt đầu quay liên tục
    const startTime = Date.now();
    const spinDuration = 4000; // 4 giây quay
    
    const spinInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / spinDuration, 1);
      
      // Easing function để quay chậm dần
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentRotation = rotation + (targetAngle * easeOut);
      
      setRotation(currentRotation % 360);
      
      if (progress >= 1) {
        clearInterval(spinInterval);
        setResultIdx(idx);
        setResult(segments[idx]);
        setIsSpinning(false);
        onSpin(segments[idx]);
      }
    }, 16); // 60fps
  };

  // Vẽ segment SVG
  const createSegmentPath = (startAngle, endAngle, radius) => {
    const toRad = (a) => (a - 90) * Math.PI / 180;
    const x1 = 128 + radius * Math.cos(toRad(startAngle));
    const y1 = 128 + radius * Math.sin(toRad(startAngle));
    const x2 = 128 + radius * Math.cos(toRad(endAngle));
    const y2 = 128 + radius * Math.sin(toRad(endAngle));
    const largeArc = endAngle - startAngle > 180 ? 1 : 0;
    return `M128,128 L${x1},${y1} A${radius},${radius} 0 ${largeArc},1 ${x2},${y2} Z`;
  };

  const getTextPos = (startAngle, endAngle, radius) => {
    const mid = (startAngle + endAngle) / 2;
    const r = radius * 0.7;
    const toRad = (a) => (a - 90) * Math.PI / 180;
    return {
      x: 128 + r * Math.cos(toRad(mid)),
      y: 128 + r * Math.sin(toRad(mid))
    };
  };

  // Tính góc bắt đầu của từng segment
  let accAngle = 0;
  const segAngles = segments.map(() => {
    const start = accAngle;
    const end = accAngle + 360 / segments.length;
    accAngle = end;
    return [start, end];
  });

  return (
    <div className="flex flex-col items-center py-8 px-4 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 min-h-[600px]">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Sparkles className="w-6 h-6 text-emerald-600 animate-pulse" />
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Vòng Quay May Mắn
          </h1>
          <Sparkles className="w-6 h-6 text-emerald-600 animate-pulse" />
        </div>
        <p className="text-gray-600 text-sm md:text-base">Quay để nhận ngay ưu đãi hấp dẫn!</p>
      </div>

      {/* Remaining spins */}
      <div className="mb-6 p-3 bg-white rounded-lg shadow-md border border-emerald-200">
        <div className="flex items-center gap-2 justify-center">
          <Gift className="w-4 h-4 text-emerald-600" />
          <span className="font-medium text-gray-700 text-sm">Số lượt quay còn lại:</span>
          <Badge className="bg-emerald-600 text-white font-bold text-sm px-2 py-1">
            {receivableQuantity}
          </Badge>
        </div>
      </div>

      {/* Wheel Container */}
      <div className="relative mb-6">
        <div className={`relative w-64 h-64 md:w-80 md:h-80 mx-auto ${isSpinning ? 'animate-pulse' : ''}`}>
          {/* Outer ring decoration */}
          <div className={`absolute inset-0 rounded-full bg-gradient-to-r from-emerald-200 via-teal-200 to-cyan-200 ${
            isSpinning ? 'animate-pulse' : ''
          }`}></div>
          
          {/* Main wheel */}
          <div
            ref={wheelRef}
            className="relative w-full h-full z-10"
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: isSpinning ? 'none' : 'transform 0.3s ease-in-out'
            }}
          >
            <svg viewBox="0 0 256 256" className="w-full h-full drop-shadow-2xl">
              {segments.map((segment, i) => {
                const [start, end] = segAngles[i];
                const textPos = getTextPos(start, end, 120);
                return (
                  <g key={i}>
                    <path
                      d={createSegmentPath(start, end, 120)}
                      fill={segment.color}
                      opacity={resultIdx === i ? 1 : 0.9}
                      stroke="white"
                      strokeWidth="3"
                      className={`transition-all duration-300 ${
                        resultIdx === i 
                          ? 'drop-shadow-[0_0_16px_hsl(var(--primary))] brightness-110' 
                          : 'hover:brightness-105'
                      }`}
                    />
                    <text
                      x={textPos.x}
                      y={textPos.y}
                      fill={segment.isLucky ? '#ffffff' : '#1f2937'}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontWeight={segment.isLucky ? 700 : 600}
                      fontSize={segment.isLucky ? 10 : 9}
                      className="pointer-events-none select-none"
                    >
                      {segment.label}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Pointer */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 z-20">
            <div className="relative">
              <div className="w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-red-500 drop-shadow-md"></div>
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-2 h-2 bg-red-500 rounded-full"></div>
            </div>
          </div>

          {/* Center circle */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 md:w-20 md:h-20 bg-white border-4 border-emerald-300 rounded-full shadow-lg flex items-center justify-center z-20">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center">
              <Zap className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Spin Button */}
      <Button
        onClick={spinWheel}
        disabled={isSpinning || receivableQuantity <= 0}
        className={`px-8 py-4 md:px-12 md:py-6 text-lg md:text-xl font-bold rounded-full transition-all duration-300 transform ${
          isSpinning || receivableQuantity <= 0
            ? 'opacity-50 cursor-not-allowed bg-gray-400'
            : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl'
        } ${isSpinning ? 'animate-pulse' : ''}`}
      >
        {isSpinning ? (
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 md:w-6 md:h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span className="text-white">Đang quay...</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-white">
            <Sparkles className="w-5 h-5 md:w-6 md:h-6" />
            <span>Quay ngay</span>
            <Sparkles className="w-5 h-5 md:w-6 md:h-6" />
          </div>
        )}
      </Button>

      {/* Result */}
      {result && !isSpinning && (
        <div className="mt-6 p-4 bg-white rounded-lg shadow-md border border-emerald-200 max-w-sm text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Gift className="w-5 h-5 text-emerald-600" />
            <h3 className="text-lg font-bold text-gray-800">Kết quả</h3>
            <Gift className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="text-base font-semibold text-gray-700 mb-2">
            {result.label}
          </p>
          {result.type === "discount" && (
            <Badge className="bg-emerald-100 text-emerald-800 text-xs px-2 py-1">
              Chúc mừng bạn đã trúng thưởng! 🎉
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}