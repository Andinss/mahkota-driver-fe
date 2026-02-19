export const ChartVisual = () => {
  return (
    <div className="flex-1 w-full min-h-[250px] relative mt-2">
      {/* SVG Chart Representation */}
      <svg
        className="w-full h-full overflow-visible"
        preserveAspectRatio="none"
        viewBox="0 0 800 200"
      >
        <defs>
          <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#137fec" stopOpacity="0.2"></stop>
            <stop offset="100%" stopColor="#137fec" stopOpacity="0"></stop>
          </linearGradient>
        </defs>
        {/* Grid Lines */}
        <line
          className="dark:stroke-slate-700"
          stroke="#e2e8f0"
          strokeDasharray="4"
          x1="0"
          x2="800"
          y1="150"
          y2="150"
        ></line>
        <line
          className="dark:stroke-slate-700"
          stroke="#e2e8f0"
          strokeDasharray="4"
          x1="0"
          x2="800"
          y1="100"
          y2="100"
        ></line>
        <line
          className="dark:stroke-slate-700"
          stroke="#e2e8f0"
          strokeDasharray="4"
          x1="0"
          x2="800"
          y1="50"
          y2="50"
        ></line>
        {/* Area Path */}
        <path
          d="M0,150 C50,140 100,100 150,110 C200,120 250,80 300,70 C350,60 400,90 450,80 C500,70 550,40 600,50 C650,60 700,30 750,20 L800,10 V200 H0 Z"
          fill="url(#chartGradient)"
        ></path>
        {/* Line Path */}
        <path
          d="M0,150 C50,140 100,100 150,110 C200,120 250,80 300,70 C350,60 400,90 450,80 C500,70 550,40 600,50 C650,60 700,30 750,20 L800,10"
          fill="none"
          stroke="#137fec"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="3"
        ></path>
        {/* Data Points */}
        <circle
          cx="150"
          cy="110"
          fill="white"
          r="4"
          stroke="#137fec"
          strokeWidth="2"
        ></circle>
        <circle
          cx="300"
          cy="70"
          fill="white"
          r="4"
          stroke="#137fec"
          strokeWidth="2"
        ></circle>
        <circle
          cx="450"
          cy="80"
          fill="white"
          r="4"
          stroke="#137fec"
          strokeWidth="2"
        ></circle>
        <circle
          cx="600"
          cy="50"
          fill="white"
          r="4"
          stroke="#137fec"
          strokeWidth="2"
        ></circle>
        <circle
          cx="800"
          cy="10"
          fill="white"
          r="4"
          stroke="#137fec"
          strokeWidth="2"
        ></circle>
      </svg>
    </div>
  );
};
