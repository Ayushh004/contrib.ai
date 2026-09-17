function LogoIcon() {
  return (
    <div className="flex items-center justify-center w-8 h-8 bg-[#ADFF45] rounded-md">
      {/* Outer Hexagon Border */}
      <div 
        className="flex items-center justify-center w-6 h-6 bg-black"
        style={{ clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)' }}
      >
        {/* Inner Hexagon (Green) to create the "stroke" effect */}
        <div 
          className="flex items-center justify-center w-[85%] h-[85%] bg-[#ADFF45]"
          style={{ clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)' }}
        >
          {/* Center Dot */}
          <div className="w-2 h-2 bg-black rounded-full" />
        </div>
      </div>
    </div>
  );
}

export default LogoIcon