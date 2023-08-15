import { Button, Div, Text } from "@rbxts/rowindcss";
import Roact from "@rbxts/roact";
import Log from "@rbxts/log";
import { useEffect, useState, withHooks } from "@rbxts/roact-hooked";
import { AnyEntity, World } from "@rbxts/matter";
import { Client } from "shared/components";
import { Balance } from "shared/components/game";
import { Network } from "shared/network";

interface MenuProps {
	world: World;
	playerId: AnyEntity;
}

function Test({ world, playerId }: MenuProps) {
	const [bal, setBal] = useState(0.0);

	let ranOnce = false;
	Network.updateBalance.client.connect((amount) => {
		if (!ranOnce) {
			ranOnce = true;
			return;
		}
		setBal(amount);
	});

	return (
		<screengui Key="Stinky">
			<Div className="w-full h-full flex justify-start items-end">
				<Div className="flex w-full justify-between items-center bg-blue-900">
					<Text className="text-white font-bold text-4xl" Text="Balance: " />
					<Text className="text-yellow-500 font-bold text-4xl" Text={`${bal} coins`} />
				</Div>
			</Div>
		</screengui>
	);
}

export default withHooks(Test);
