import Button from "./button";
import Roact from "@rbxts/roact";

interface ButtonProps {
	onActivated: () => void;
}

function CloseButton({ onActivated }: ButtonProps) {
	return <Button Size="icon" Text="X" TextSize="2xl" Type="Destructive" Bold={true} onActivated={onActivated} />;
}

export = CloseButton;
