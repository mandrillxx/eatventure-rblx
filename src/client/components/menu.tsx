import { Button, Div, Text } from "@rbxts/rowindcss";
import Roact from "@rbxts/roact";
import Log from "@rbxts/log";
import { useState, withHooks } from "@rbxts/roact-hooked";
import { AnyEntity, World } from "@rbxts/matter";
import { Client } from "shared/components";
import { Balance } from "shared/components/game";

interface MenuProps {
	world: World;
	playerId: AnyEntity;
}

function Test({ world, playerId }: MenuProps) {
	const [state, setState] = useState<"State1" | "State2">("State1");
	const balance = world.get(playerId, Balance);

	return (
		<screengui Key="Stinky">
			<Div className="rounded-xl w-full h-full flex justify-center items-center">
				<Div className="rounded-lg bg-gray-700 border-red-600 border-4 flex flex-col justify-center items-center p-3">
					<Text Text="Eatventure" className="text-8xl font-bold" />
					<Text Text={state} className="text-4xl" />
					<Text Text={`Balance: ${balance}`} className="text-4xl" />
					<Div className="h-4" />
					<Div className="flex gap-1">
						<Button
							Text="Begin"
							className="bg-blue-500 hover:bg-blue-700 rounded-lg text-3xl px-2 py-1 text-white"
							Event={{
								MouseButton1Click: () => {
									setState(state === "State1" ? "State2" : "State1");
								},
							}}
						/>
						<Button
							Text="Settings"
							className="bg-blue-400 hover:bg-blue-600 rounded-lg text-3xl px-2 py-1 text-white"
							Event={{
								MouseButton1Click: () => {
									Log.Debug("Clicked!");
								},
							}}
						/>
					</Div>
				</Div>
			</Div>
		</screengui>
	);
}

export default withHooks(Test);
