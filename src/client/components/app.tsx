import { Modal, ModalContext } from "./context/modal";
import Overlay from "./overlay";
import Roact from "@rbxts/roact";

export function App() {
	const [openModal, setOpenModal] = Roact.useState<Modal>("rewards");

	return (
		<ModalContext.Provider value={openModal}>
			<Overlay setOpenModal={setOpenModal} />
		</ModalContext.Provider>
	);
}
