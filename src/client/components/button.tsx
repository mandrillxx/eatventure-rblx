import { Div, Button as UIButton } from "@rbxts/rowindcss";
import Roact from "@rbxts/roact";

interface VariantProps {
	Type: "Default" | "Destructive" | "Secondary" | "Ghost" | "Success";
	TextSize: "sm" | "md" | "lg" | "xl" | "2xl";
	Size: "sm" | "md" | "lg" | "icon";
}

interface ButtonProps extends VariantProps {
	Text: string;
	Bold?: boolean;
	LeadingIcon?: string;
	TrailingIcon?: string;
	onActivated: () => void;
}

const buttonTypes: { [key in VariantProps["Type"]]: string } = {
	Default:
		"bg-neutral-900 text-neutral-50 shadow hover:bg-neutral-900:90 dark:bg-neutral-50 dark:text-neutral-900 dark:hover:bg-neutral-50:90",
	Destructive:
		"bg-red-500 text-neutral-50 shadow-sm hover:bg-red-500:90 dark:bg-red-900 dark:text-red-50 dark:hover:bg-red-900:90",
	Secondary:
		"bg-neutral-100 text-neutral-900 shadow-sm hover:bg-neutral-100:80 dark:bg-neutral-800 dark:text-neutral-50 dark:hover:bg-neutral-800:80",
	Ghost: "hover:bg-neutral-100 hover:text-neutral-900 dark:hover:bg-neutral-800 dark:hover:text-neutral-50",
	Success:
		"bg-green-500 text-neutral-50 shadow-sm hover:bg-green-500:90 dark:bg-green-900 dark:text-green-50 dark:hover:bg-green-900:90",
};

const buttonSizes: { [key in VariantProps["Size"]]: string } = {
	sm: "w-24 h-8 px-3",
	md: "w-36 h-12 px-3",
	lg: "w-48 h-16 px-8",
	icon: "w-12 h-12 p-2",
};

const buttonTextSizes: { [key in VariantProps["TextSize"]]: string } = {
	sm: "text-sm",
	md: "text-md",
	lg: "text-lg",
	xl: "text-xl",
	["2xl"]: "text-2xl",
};

function Button({ Text, Bold, TextSize, Type, Size, onActivated }: ButtonProps) {
	return (
		<Div className="w-full h-full">
			<UIButton
				Text={Text}
				Event={{
					MouseButton1Click: () => {
						onActivated();
					},
				}}
				className={`${buttonTypes[Type] ?? buttonTypes["Default"]} ${buttonSizes[Size] ?? buttonSizes["sm"]} ${
					buttonTextSizes[TextSize] ?? buttonTextSizes["sm"]
				} ${
					Bold ? "font-bold" : "font-medium"
				} text-center inline-flex items-center justify-center rounded-md transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-400 disabled:pointer-events-none disabled:opacity-50 dark:focus-visible:ring-neutral-800`}
			/>
		</Div>
	);
}

export default Button;
