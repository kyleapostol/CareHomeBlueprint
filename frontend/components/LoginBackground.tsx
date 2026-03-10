export default function LoginBackground() {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden -z-10">
      <svg
        className="absolute w-full h-full opacity-80"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
        viewBox="0 0 100 100"
      >
        <defs>
          <radialGradient id="grad1" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#3b82f6" /> {/* Bright Blue */}
            <stop offset="100%" stopColor="#f8fafc" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="grad2" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#8b5cf6" /> {/* Bright Purple */}
            <stop offset="100%" stopColor="#f8fafc" stopOpacity="0" />
          </radialGradient>
        </defs>
        
        <circle cx="20" cy="20" r="40" fill="url(#grad1)">
          <animate attributeName="cx" values="20; 80; 20" dur="20s" repeatCount="indefinite" />
          <animate attributeName="cy" values="20; 80; 20" dur="25s" repeatCount="indefinite" />
        </circle>

        <circle cx="80" cy="80" r="50" fill="url(#grad2)">
          <animate attributeName="cx" values="80; 20; 80" dur="22s" repeatCount="indefinite" />
          <animate attributeName="cy" values="80; 20; 80" dur="18s" repeatCount="indefinite" />
        </circle>
      </svg>
    </div>
  );
}