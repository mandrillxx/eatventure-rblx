import { AutoSizedText, Padding, PageController, RowView, UPaddingDim, View } from "@rbxts/zenui-core";
import Roact from "@rbxts/roact";

function zenui() {
	return (
		<View>
			<Padding
				Padding={{
					Horizontal: 0.1,
					Vertical: 0.1,
					Left: 0.1,
					Right: 0.1,
				}}
			/>
			<RowView>
				<AutoSizedText Text="Hellooo1" />
				<AutoSizedText Text="Hellooo2" />
			</RowView>
			<PageController SelectedPageIndex={1}>
				<View />
			</PageController>
		</View>
	);
}

export = zenui;
