import { Div, Text } from "@rbxts/rowindcss";
import Roact from "@rbxts/roact";
import { withHooks } from "@rbxts/roact-hooked";

interface NPCProps {
	npc: { name: NPCNames };
}

function NPC({ npc }: NPCProps) {
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
