type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  intent?: "primary" | "secondary";
};

const Input = ({ intent = "primary", className, ...props }: InputProps) => {
  const baseStyle = intent === "secondary" ? "border border-gray-300 focus:border-blue-500" : "border border-black";
  return (
    <input
      {...props}
      className={`w-full px-4 py-2 rounded ${baseStyle} ${className}`}
    />
  );
};

export default Input;
