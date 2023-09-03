import { Div, Text as UIText } from "@rbxts/rowindcss";
import Roact from "@rbxts/roact";

interface VariantProps {
	Type: "Default" | "Destructive" | "Secondary" | "Success";
	TextSize: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "6xl";
}

interface BadgeProps extends VariantProps {
	Text: string;
}

const buttonTypes: { [key in VariantProps["Type"]]: string } = {
	Default:
		"border-transparent bg-neutral-900 text-neutral-50 shadow hover:bg-neutral-900:80 dark:bg-neutral-50 dark:text-neutral-900 dark:hover:bg-neutral-50:80",
	Destructive:
		"border-transparent bg-red-500 text-neutral-50 shadow hover:bg-red-500:80 dark:bg-red-900 dark:text-red-50 dark:hover:bg-red-900:80",
	Secondary:
		"border-transparent bg-neutral-100 text-neutral-900 hover:bg-neutral-100:80 dark:bg-neutral-800 dark:text-neutral-50 dark:hover:bg-neutral-800:80",
	Success:
		"bg-green-500 text-neutral-50 shadow-sm hover:bg-green-500:90 dark:bg-green-900 dark:text-green-50 dark:hover:bg-green-900:90",
};

const badgeTextSizes: { [key in VariantProps["TextSize"]]: string } = {
	sm: "text-sm",
	md: "text-md",
	lg: "text-lg",
	xl: "text-xl",
	["2xl"]: "text-2xl",
	["3xl"]: "text-3xl",
	["4xl"]: "text-4xl",
	["5xl"]: "text-5xl",
	["6xl"]: "text-6xl",
};

function Badge({ Text, TextSize, Type }: BadgeProps) {
	return (
		<Div className="w-full h-full">
			<UIText
				Text={Text}
				className={`${buttonTypes[Type] ?? buttonTypes["Default"]} ${
					badgeTextSizes[TextSize] ?? badgeTextSizes["sm"]
				} text-center inline-flex items-center px-6 py-3 rounded-lg`}
			/>
		</Div>
	);
}

export = Badge;
