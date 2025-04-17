type TextProps = {
  children: React.ReactNode;
  size?: string;
  color?: string;
  weight?: number;
  family?: string;
  className?: string;
};

const Text = ({ children, size = "base", color = "black", weight = 400, family = "sans", className = "" }: TextProps) => {
  return (
    <p className={`font-${family} text-${size} text-${color} font-${weight} ${className}`}>
      {children}
    </p>
  );
};

export default Text;
