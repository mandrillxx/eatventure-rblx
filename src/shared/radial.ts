import { RunService, TweenService } from "@rbxts/services";
import { New } from "@rbxts/fusion";

interface Config {
	ImageColor: Color3;
	ImageId: string;
	ImageTransparency: number;
	FlipProgress: boolean;
	BackgroundTransparency: number;
	BackgroundType: "TransAndColor" | "Color" | "Trans";
	BackgroundColor: Color3;
	ProgressTransparency: number;
	ProgressColor: Color3;
}

export class radialObject {
	public progress = 0;
	private config: Config;
	private ColorSequenceColor: ColorSequence;
	private NumberSequenceTrans: NumberSequence;
	private instance: RadialInstance;

	constructor(imageObject: Frame, options?: Partial<Config>) {
		this.config = {
			ImageColor: new Color3(255, 255, 255),
			ImageId: "6553408336",
			ImageTransparency: 0,
			FlipProgress: false,
			BackgroundTransparency: 0.8,
			BackgroundType: "TransAndColor",
			BackgroundColor: new Color3(0, 0, 0),
			ProgressTransparency: 0,
			ProgressColor: new Color3(0.25, 0.98, 0.54),
			...options,
		};
		this.ColorSequenceColor = new ColorSequence([
			new ColorSequenceKeypoint(0, this.config.ProgressColor),
			new ColorSequenceKeypoint(0.5, this.config.ProgressColor),
			new ColorSequenceKeypoint(0.51, this.config.BackgroundColor),
			new ColorSequenceKeypoint(1, this.config.BackgroundColor),
		]);
		this.NumberSequenceTrans = new NumberSequence([
			new NumberSequenceKeypoint(0, this.config.ProgressTransparency),
			new NumberSequenceKeypoint(0.5, this.config.ProgressTransparency),
			new NumberSequenceKeypoint(0.51, this.config.BackgroundTransparency),
			new NumberSequenceKeypoint(1, this.config.BackgroundTransparency),
		]);
		this.instance = imageObject as RadialInstance;
	}

	update() {
		const percentNumber = math.clamp(this.progress * 3.6, 0, 360);
		const F1 = this.instance.Frame1.ImageLabel;
		const F2 = this.instance.Frame2.ImageLabel;

		F1.UIGradient.Rotation = !this.config.FlipProgress
			? math.clamp(percentNumber, 180, 360)
			: 180 - math.clamp(percentNumber, 0, 180);
		F2.UIGradient.Rotation = !this.config.FlipProgress
			? math.clamp(percentNumber, 0, 180)
			: 180 - math.clamp(percentNumber, 180, 360);
		F1.ImageColor3 = this.config.ImageColor;
		F2.ImageColor3 = this.config.ImageColor;
		F1.ImageTransparency = this.config.ImageTransparency;
		F2.ImageTransparency = this.config.ImageTransparency;
		F1.Image = "rbxassetid://" + this.config.ImageId;
		F2.Image = "rbxassetid://" + this.config.ImageId;

		if (this.config.BackgroundType === "Color") {
			F1.UIGradient.Color = this.ColorSequenceColor;
			F2.UIGradient.Color = this.ColorSequenceColor;
			F1.UIGradient.Transparency = new NumberSequence(0);
			F2.UIGradient.Transparency = new NumberSequence(0);
		} else if (this.config.BackgroundType === "Trans") {
			F1.UIGradient.Transparency = this.NumberSequenceTrans;
			F2.UIGradient.Transparency = this.NumberSequenceTrans;
			F1.UIGradient.Color = new ColorSequence(new Color3(1, 1, 1));
			F2.UIGradient.Color = new ColorSequence(new Color3(1, 1, 1));
		} else if (this.config.BackgroundType === "TransAndColor") {
			F1.UIGradient.Transparency = this.NumberSequenceTrans;
			F2.UIGradient.Transparency = this.NumberSequenceTrans;
			F1.UIGradient.Color = this.ColorSequenceColor;
			F2.UIGradient.Color = this.ColorSequenceColor;
		} else {
			this.config.BackgroundType = "Trans";
		}
	}

	setProgress(progress: number) {
		this.progress = progress;
		this.update();
	}

	tweenProgress(progress: number = 100, time: number = 1, finished: Callback) {
		const TI = new TweenInfo(time, Enum.EasingStyle.Quad, Enum.EasingDirection.InOut);
		const tweenProgressObj = New("NumberValue")({
			Value: this.progress,
		});
		const tween = TweenService.Create(tweenProgressObj, TI, {
			Value: progress,
		});

		const newConn = RunService.Heartbeat.Connect(() => {
			this.progress = tweenProgressObj.Value;
			this.update();
		});

		tween.Play();

		tween.Completed.Connect(() => {
			newConn.Disconnect();
			tweenProgressObj.Destroy();
			this.progress = progress;
			finished();
		});
	}
}
