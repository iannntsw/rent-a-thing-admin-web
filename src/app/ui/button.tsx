type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  width?: "full" | "auto";
  children: React.ReactNode;
  className?: string;
};

const Button = ({ width = "auto", children, className, ...props }: ButtonProps) => {
  return (
    <button
      {...props}
      className={`rounded bg-primary text-white px-4 py-2 ${width === "full" ? "w-full" : ""} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
