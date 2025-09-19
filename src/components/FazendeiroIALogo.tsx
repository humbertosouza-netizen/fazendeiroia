import React from 'react';

interface FazendeiroIALogoProps {
  width?: number;
  height?: number;
  className?: string;
}

/**
 * Componente que renderiza a logo do Fazendeiro IA
 * Baseado na imagem compartilhada pelo usuário (um robô com chapéu de fazendeiro)
 */
export default function FazendeiroIALogo({ width = 24, height = 24, className = '' }: FazendeiroIALogoProps) {
  return (
    <div className={`flex items-center justify-center ${className}`} style={{ width, height }}>
      <svg
        width={width}
        height={height}
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Chapéu de Fazendeiro */}
        <path
          d="M30 40C30 30 50 15 90 25C92 40 85 60 60 58C40 56 30 50 30 40Z"
          fill="#E6B651"
          stroke="#234041"
          strokeWidth="4"
        />
        <path
          d="M25 45C25 45 70 55 95 30"
          stroke="#8B5D2E"
          strokeWidth="6"
        />
        <path
          d="M25 42C25 42 40 37 60 43"
          stroke="#AA7F34"
          strokeWidth="3"
        />
        
        {/* Rosto do Robô */}
        <rect
          x="35"
          y="55"
          width="50"
          height="45"
          rx="10"
          fill="#A8C7D7"
          stroke="#234041"
          strokeWidth="4"
        />
        
        {/* Olhos */}
        <ellipse cx="50" cy="75" rx="7" ry="9" fill="#234041" />
        <ellipse cx="70" cy="75" rx="7" ry="9" fill="#234041" />
        
        {/* Sorriso */}
        <path
          d="M47 90C47 90 55 95 73 90"
          stroke="#234041"
          strokeWidth="4"
          strokeLinecap="round"
        />
        
        {/* Antena */}
        <path
          d="M25 65C25 65 15 50 20 40"
          stroke="#234041"
          strokeWidth="4"
        />
        <circle cx="20" cy="40" r="5" fill="#6D96AA" stroke="#234041" strokeWidth="2" />
        
        {/* Reflexo nos olhos */}
        <circle cx="48" cy="72" r="2" fill="#FFFFFF" />
        <circle cx="68" cy="72" r="2" fill="#FFFFFF" />
        
        {/* Bochecha */}
        <path
          d="M38 85C38 85 42 87 45 85"
          stroke="#80A0B0"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M75 85C75 85 79 87 82 85"
          stroke="#80A0B0"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
} 