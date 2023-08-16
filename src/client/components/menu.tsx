import { Button, Div, Text } from "@rbxts/rowindcss";
import Roact from "@rbxts/roact";
import { useState, withHooks } from "@rbxts/roact-hooked";
import { AnyEntity, World } from "@rbxts/matter";
import { Network } from "shared/network";
import { ClientState } from "shared/clientState";

interface MenuProps {
	world: World;
	playerId: AnyEntity;
	state: ClientState;
}

function Menu({ world, playerId, state }: MenuProps) {
	const [bal, setBal] = useState(0.0);
	const [open, setOpen] = useState(true);

	const ranOnce = [false, false];

	return (
		<screengui Key="Stinky">
			<Div className="w-full h-full flex justify-start items-end">
				<Div className="flex w-full justify-between items-center p-3">
					<Text className="text-white font-bold text-4xl" Text="Balance: " />
					<Text className="text-yellow-500 font-bold text-4xl" Text={`${bal} coins`} />
					<Div className="flex gap-4 px-12 items-center">
						<Text className="text-white font-bold text-4xl" Text={`Store Open: ${open}`} />
						<Button
							className="rounded-xl bg-blue-500 text-white text-2xl px-4 py-2"
							Text="Open Store"
							Event={{
								MouseButton1Click: () => {
									Network.setStoreStatus.client.fire(true);
								},
							}}
						/>
						<Button
							className="rounded-xl bg-red-500 text-white text-2xl px-4 py-2"
							Text="Close Store"
							Event={{
								MouseButton1Click: () => {
									Network.setStoreStatus.client.fire(false);
								},
							}}
						/>
					</Div>
				</Div>
			</Div>
		</screengui>
	);
}

export default withHooks(Menu);
