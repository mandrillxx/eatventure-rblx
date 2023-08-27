import { useState, withHooks } from "@rbxts/roact-hooked";
import { Button, Div, Text } from "@rbxts/rowindcss";
import { useMountEffect } from "@rbxts/pretty-roact-hooks";
import { FormatCompact } from "@rbxts/format-number";
import { ClientState } from "shared/clientState";
import { Network } from "shared/network";
import Roact from "@rbxts/roact";

interface MenuProps {
	state: ClientState;
}

function Menu({ state }: MenuProps) {
	const [balance, setBalance] = useState(0.0);
	const [open, setOpen] = useState(true);

	useMountEffect(() => {
		state.update = (key: "open" | "balance", value: unknown) => {
			if (key === "open") {
				setOpen(value as boolean);
			} else if (key === "balance") {
				setBalance(value as number);
			}
		};
	});

	return (
		<screengui Key="Stinky">
			<Div className="w-full h-full flex justify-start items-end">
				<Div className="flex w-full justify-between items-center p-3">
					<Text className="text-white font-bold text-4xl" Text="Balance: " />
					<Text
						className="text-green-500 font-bold text-4xl"
						Text={`$${FormatCompact(balance, balance > 1_000_000 ? 1 : 2)}`}
					/>
				</Div>
			</Div>
		</screengui>
	);
}

export default withHooks(Menu);
