import variantModule, { TypeNames, VariantOf } from "@rbxts/variant";

export const ControlEvent = variantModule({});

export type ControlEvent<T extends TypeNames<typeof ControlEvent> = undefined> = VariantOf<typeof ControlEvent, T>;
