// Path: components/Button.tsx
import { cva } from "class-variance-authority";

type ButtonProps = React.HTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "tertiary" | "fourthiary";
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  type?: "button" | "submit" | "reset";
  onSubmit?: (event: React.FormEvent<HTMLButtonElement>) => void; // Added onSubmit event type
};


const buttonVariants = cva("flex text-center items-center", {
  variants: {
    variant: {
      primary:
        "bg-[#820000] rounded-md gap-2 border border-gray-500 text-white",
      secondary:
        "bg-secondary_main hover:bg-secondary_hover active:bg-secondary_active disabled:bg-secondary_disabled rounded-md gap-2 border border-outlineButton text-outlineButton",
      tertiary:
        "bg-tertiary_main hover:bg-tertiary_hover active:bg-tertiary_active disabled:bg-tertiary_disabled rounded-md gap-2 border border-outlineButton text-outlineButton",
      fourthiary:
        "bg-[#F6F6F6] rounded-md gap-2 border border-[#820000] text-[fourthiary]",
    },
    size: {
      sm: " py-2 px-[1rem] rounded-[8px]",
      md: "px-[0.625rem] py-3 rounded-lg",
      lg: "px-4 py-3 rounded-lg ",
      xl: "px-4 py-3 rounded-lg",
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "sm",
  },
});

export default function Button({
  variant = "primary",
  size = "sm",
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
    />
  );
}
