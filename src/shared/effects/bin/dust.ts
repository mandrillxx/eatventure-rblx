import { New } from "@rbxts/fusion";

export function dust(texture?: string, colour?: ColorSequence): ParticleEmitter {
	return New("ParticleEmitter")({
		Brightness: 1.5,
		Color: colour ?? new ColorSequence(Color3.fromRGB(191, 184, 148)),
		LightEmission: 0,
		LightInfluence: 0,
		Orientation: Enum.ParticleOrientation.FacingCamera,
		Size: new NumberSequence([new NumberSequenceKeypoint(0, 2), new NumberSequenceKeypoint(1, 4, 2)]),
		Texture: texture ?? "rbxassetid://9232117588",
		Transparency: new NumberSequence([
			new NumberSequenceKeypoint(0, 1),
			new NumberSequenceKeypoint(0.2, 0.95),
			new NumberSequenceKeypoint(1, 1),
		]),
		Lifetime: new NumberRange(0.75, 0.8),
		Rate: 15,
		RotSpeed: new NumberRange(-90, 90),
		SpreadAngle: new Vector2(5, 15),
		Shape: Enum.ParticleEmitterShape.Box,
		ShapeInOut: Enum.ParticleEmitterShapeInOut.Outward,
		ShapeStyle: Enum.ParticleEmitterShapeStyle.Volume,
		Drag: 3,
		TimeScale: 1,
		VelocityInheritance: 0,
	});
}
