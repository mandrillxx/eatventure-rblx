const Products = [
	"apple",
	"bacon",
	"banana",
	"carrot",
	"burger",
	"chicken",
	"chocolate",
	"cookie",
	"corn",
	"drink",
	"doughnut",
	"egg",
	"fries",
	"hotdog",
	"icecream",
	"muffin",
	"onion",
	"orange",
	"peach",
	"pizzaitalian",
	"pizza",
	"potato",
	"sausage",
	"steak",
	"strawberry",
	"taco",
	"tomato",
] as const;
export type Foods = (typeof Products)[number];

export const AssetMap: Map<Foods, string> = new Map();
AssetMap.set("apple", "rbxassetid://14567688227");
AssetMap.set("bacon", "rbxassetid://14567687993");
AssetMap.set("banana", "rbxassetid://14567687818");
AssetMap.set("carrot", "rbxassetid://14567687818");
AssetMap.set("burger", "rbxassetid://14567687469");
AssetMap.set("chicken", "rbxassetid://14567599208");
AssetMap.set("chocolate", "rbxassetid://14567687060");
AssetMap.set("cookie", "rbxassetid://14567686889");
AssetMap.set("corn", "rbxassetid://14567686742");
AssetMap.set("drink", "rbxassetid://14567815333");
AssetMap.set("doughnut", "rbxassetid://14567686511");
AssetMap.set("egg", "rbxassetid://14567686280");
AssetMap.set("fries", "rbxassetid://14567686090");
AssetMap.set("hotdog", "rbxassetid://14567685848");
AssetMap.set("icecream", "rbxassetid://14567685749");
AssetMap.set("muffin", "rbxassetid://14567685632");
AssetMap.set("onion", "rbxassetid://14567685441");
AssetMap.set("orange", "rbxassetid://14567685203");
AssetMap.set("peach", "rbxassetid://14567685072");
AssetMap.set("pizzaitalian", "rbxassetid://14567684770");
AssetMap.set("pizza", "rbxassetid://14567684927");
AssetMap.set("potato", "rbxassetid://14567689045");
AssetMap.set("sausage", "rbxassetid://14567684590");
AssetMap.set("steak", "rbxassetid://14567684420");
AssetMap.set("strawberry", "rbxassetid://14567684242");
AssetMap.set("taco", "rbxassetid://14567684126");
AssetMap.set("tomato", "rbxassetid://14567683935");
