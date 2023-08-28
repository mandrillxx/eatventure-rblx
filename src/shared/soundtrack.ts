import { ReplicatedStorage, SoundService, TweenService } from "@rbxts/services";

// CREDIT TO: @rbxts/soundtrack
// GREAT LIBRARY BUT DOESNT WORK WITH MY CODE

const Transition: TweenInfo = new TweenInfo(4, Enum.EasingStyle.Quad, Enum.EasingDirection.Out);

const FadeIn = (Song: Sound, Volume = 1): void => {
	TweenService.Create(Song, Transition, {
		Volume: Volume,
	}).Play();
};

const FadeOut = (Song: Sound): void => {
	const Fade: Tween = TweenService.Create(Song, Transition, {
		Volume: 0,
	});

	Fade.Completed.Once(() => Song.Stop());
	Fade.Play();
};

const Shuffle = <T>(array: T[]): T[] => {
	let currentIndex = array.size(),
		randomIndex;

	while (currentIndex !== 0) {
		randomIndex = math.floor(math.random() * currentIndex);
		currentIndex--;
		[array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
	}

	return array;
};

export class Soundtrack {
	public Songs: Readonly<Sound[]> = [];
	public Playing = false;

	private Active = 0;
	private Reference: SoundGroup;

	constructor(Reference: SoundGroup) {
		this.Reference = Reference;

		ReplicatedStorage.Assets.Sounds.GetChildren().forEach((Value: Instance) => {
			if (Value.IsA("Sound") && Value.SoundGroup === SoundService.Soundtrack) {
				if (!Value.IsLoaded) Value.Loaded.Wait();

				Value.Volume = 0;
				(this.Songs as Sound[]).push(Value);
			}
		});

		this.Songs = table.freeze(this.Songs);
		this.Playing = true;
	}

	public Play(): Sound {
		const CurrentIndex: number = this.Active;
		const Active: Sound = this.Songs[CurrentIndex];
		const TimeLength: number = math.max(Active.TimeLength - Active.TimePosition - Transition.Time, 0);

		task.delay(TimeLength, (): void => {
			if (Active.Playing && this.Playing && CurrentIndex === this.Active) this.Skip();
		});

		Active.Volume = this.Reference.Volume;

		if (Active.IsPaused) {
			Active.Resume();
		} else {
			Active.Play();
		}

		this.Playing = true;

		return Active;
	}

	public Pause(): ThisType<Soundtrack> {
		this.Songs[this.Active].Pause();
		this.Playing = false;

		return this;
	}

	public Stop(): ThisType<Soundtrack> {
		this.Songs[this.Active].Stop();
		this.Playing = false;

		return this;
	}

	public Skip(): Sound {
		const index = !this.Songs[this.Active + 1] ? 0 : this.Active + 1;
		const nextInQueue = this.Songs[index];
		FadeOut(this.Songs[this.Active]);

		FadeIn(nextInQueue);
		this.Active = index;
		this.Play();

		return nextInQueue;
	}

	public Shuffle(): ThisType<Soundtrack> {
		this.Stop();
		this.Songs = Shuffle(table.clone(this.Songs));
		this.Play();

		return this;
	}
}
