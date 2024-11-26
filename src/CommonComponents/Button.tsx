// Path: components/Button.tsx
import { cva } from "class-variance-authority";

type ButtonProps = React.HTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "tertiary" | "fourthiary";
  size?: "lg" | "xl";
  className?: string;
  type?: "button" | "submit" | "reset";
  onSubmit?: (event: React.FormEvent<HTMLButtonElement>) => void; // Added onSubmit event type
};

const buttonVariants = cva("flex justify-center items-center  text-center", {
  variants: {
    variant: {
      primary:
        "bg-[#820000] rounded-md gap-2 border border-gray-500 text-white",
      fourthiary:
      "bg-[#F6F6F6] rounded-md gap-2 border border-[#820000] text-[fourthiary]",
      tertiary:
        "bg-tertiary_main hover:bg-tertiary_hover active:bg-tertiary_active disabled:bg-tertiary_disabled rounded-md gap-2 border border-outlineButton text-outlineButton",
      secondary:
        "bg-fourthiary_main hover:bg-fourthiary_hover active:bg-fourthiary_active disabled:bg-fourthiary_disabled rounded-md gap-2 border border-gray-500 text-white",
    },
    size: {
      lg: "px-8 py-3 rounded-lg",
      xl: "px-4 w-full py-3 rounded-lg",
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "lg",
  },
});

export default function Button({
  variant = "primary",
  size = "lg",
  className = "p-4",
  type = "button",
  onSubmit, // Added onSubmit prop
  ...props
}: ButtonProps) {
  const combinedClassName = `${buttonVariants({ variant, size })} ${className}`;

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (type === "submit" && onSubmit) {
      onSubmit(event as any); // Cast to `any` to simulate `onSubmit` behavior
    }

    if (props.onClick) {
      props.onClick(event);
    }
  };

  return (
    <button
      type={type}
      {...props}
      className={combinedClassName}
      onClick={handleClick} // Use handleClick to trigger onSubmit if type is "submit"
    >
      {props.children} {/* Ensure content is passed and rendered */}
    </button>
  );
}
