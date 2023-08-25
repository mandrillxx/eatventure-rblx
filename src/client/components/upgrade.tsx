import { ClientState } from "shared/clientState";
import { withHooks } from "@rbxts/roact-hooked";
import Roact from "@rbxts/roact";

interface UpgradeProps {
	state: ClientState;
}

function Upgrade({ state }: UpgradeProps) {
	return <screengui Key="Upgrade"></screengui>;
}

export default withHooks(Upgrade);
