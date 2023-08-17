import { Div, Text } from "@rbxts/rowindcss";
import { withHooks } from "@rbxts/roact-hooked";
import { ClientState } from "shared/clientState";
import Roact from "@rbxts/roact";

interface NPCProps {
	npc: { name: NPCNames };
	state: ClientState;
}

function NPC({ npc, state }: NPCProps) {
	return (
		<screengui Key="NPCInfo">
			<Div className="w-full h-full justify-end items-center">
				<Div className="flex flex-col w-48 h-96 rounded-l-xl bg-blue-500 justify-between items-center p-3">
					<Text className="text-white text-2xl font-bold" Text={npc.name} />
				</Div>
			</Div>
		</screengui>
	);
}

export default withHooks(NPC);
