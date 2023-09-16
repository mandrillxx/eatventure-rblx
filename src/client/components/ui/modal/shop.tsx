import { useMemo } from "@rbxts/roact";
import { Modal } from ".";
import Roact from "@rbxts/roact";

const modal = new Modal({
	body: <frame />,
	title: "Shop",
	type: "GenericOkClose",
});
