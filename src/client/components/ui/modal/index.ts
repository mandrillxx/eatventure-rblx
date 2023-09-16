import { Element } from "@rbxts/roact";

type Footer = {
	primary?: {
		text: string;
		callback: () => void;
	};
	secondary?: {
		text: string;
		callback: () => void;
	};
	tertiary?: {
		text: string;
		callback: () => void;
	};
};

type ModalType = "GenericOkClose" | "GenericOk" | "GenericClose" | "Generic";

type ModalOptions = {
	title: string;
	type: ModalType;
	body: Element;
	footer?: Footer;
};

export class Modal {
	title: string;
	type: ModalType;
	footer?: Footer;

	constructor(options: ModalOptions) {
		const { title, type, footer } = options;
		this.title = title;
		this.type = type;
		this.footer = footer;
	}
}
