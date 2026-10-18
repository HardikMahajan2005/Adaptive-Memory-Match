import React from 'react';

export const AmbientBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
      {/* Top-left electric blue / cyan glow */}
      <div className="absolute -top-[15%] -left-[10%] w-[55vw] h-[55vw] rounded-full bg-gradient-to-br from-blue-600/25 via-cyan-500/15 to-transparent blur-[120px] dark:opacity-80 light:opacity-30" />
      
      {/* Top-right violet / indigo glow */}
      <div className="absolute top-[5%] -right-[15%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-bl from-purple-600/20 via-indigo-500/15 to-transparent blur-[130px] dark:opacity-70 light:opacity-25" />
      
      {/* Center-bottom soft magenta / coral accent */}
      <div className="absolute -bottom-[20%] left-[25%] w-[60vw] h-[50vw] rounded-full bg-gradient-to-t from-violet-600/15 via-rose-500/10 to-transparent blur-[140px] dark:opacity-60 light:opacity-20" />

      {/* Subtle grid mesh overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:32px_32px] dark:opacity-50 light:opacity-20" />
    </div>
  );
};
