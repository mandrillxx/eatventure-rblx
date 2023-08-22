import { ReplicatedStorage } from "@rbxts/services";
import { AnyEntity, World } from "@rbxts/matter";
import { ComponentCtor } from "@rbxts/matter/lib/component";
import Log from "@rbxts/log";

export interface ComponentInfo<T extends ComponentCtor> {
	componentId: AnyEntity;
	component: ReturnType<T>;
}

export function fetchComponent<T extends ComponentCtor>(
	world: World,
	componentId: AnyEntity,
	component: T,
): ComponentInfo<T> {
	const _component = getOrError(
		world,
		componentId,
		component,
		"Component {@Component} does not exist",
		"error",
		component,
	);
	return { componentId, component: _component };
}

export function getOrError<T extends ComponentCtor>(
	world: World,
	id: AnyEntity,
	component: T,
	errorMessage: string = "",
	logType: "warn" | "info" | "error" = "error",
	...args: object[]
) {
	if (!world.contains(id)) throw "World does not contain entity";
	const componentInstance = world.get(id, component);

	if (!componentInstance) {
		if (logType === "error") Log.Error(errorMessage, args);
		else if (logType === "warn") Log.Warn(errorMessage, args);
		else Log.Info(errorMessage, args);
		throw errorMessage;
	}
	return componentInstance;
}

export function randomIndex<T>(array: Array<T>) {
	return array[math.random(1, array.size()) - 1];
}

type CustomerKeys = keyof Customers;
const customerModelNames: Array<CustomerKeys> = [
	"Customer1",
	"Customer2",
	"Customer3",
	"Customer4",
	"Customer5",
	"Customer6",
	"Customer7",
	"Customer8",
	"Customer9",
];

type EmployeeKeys = keyof Employees;
const employeeModelNames: Array<EmployeeKeys> = [
	"Employee1",
	"Employee2",
	"Employee3",
	"Employee4",
	"Employee5",
	"Employee6",
];

function getGenderValue(npcName: NPCNames): Gender {
	return (ReplicatedStorage.Assets.NPCs.FindFirstChild(npcName)! as BaseNPC).Gender.Value === "Male"
		? "Male"
		: "Female";
}

const getRandomCustomerNPC = () => randomIndex(customerModelNames);
const getRandomEmployeeNPC = () => randomIndex(employeeModelNames);

export const randomCustomerModel = (gender: Gender): CustomerNames => {
	const npc = getRandomCustomerNPC();
	if (getGenderValue(npc) !== gender) return randomCustomerModel(gender);
	return npc;
};

export const randomEmployeeModel = (gender: Gender): EmployeeNames => {
	const npc = getRandomEmployeeNPC();
	if (getGenderValue(npc) !== gender) return randomEmployeeModel(gender);
	return npc;
};

export type npcMaleName =
	| "Kenny"
	| "Karl"
	| "Erik"
	| "Evan"
	| "Ryan"
	| "Russel"
	| "Pete"
	| "Paul"
	| "John"
	| "George"
	| "Ringo"
	| "Keith"
	| "Mick"
	| "Charlie"
	| "Ronnie"
	| "Bill"
	| "Brian"
	| "Roger"
	| "David"
	| "Richard"
	| "Robert"
	| "Jimmy";
export const npcMaleNames: npcMaleName[] = [
	"Kenny",
	"Karl",
	"Erik",
	"Evan",
	"Ryan",
	"Russel",
	"Pete",
	"Paul",
	"John",
	"George",
	"Ringo",
	"Keith",
	"Mick",
	"Charlie",
	"Ronnie",
	"Bill",
	"Brian",
	"Roger",
	"David",
	"Richard",
	"Robert",
	"Jimmy",
];

export type npcFemaleName =
	| "Katie"
	| "Kathy"
	| "Kendra"
	| "Sophia"
	| "Amy"
	| "Amanda"
	| "Ashley"
	| "Alyssa"
	| "Beth"
	| "Brianna"
	| "Bridget"
	| "Brenda"
	| "Caitlin"
	| "Candice"
	| "Cara"
	| "Danielle"
	| "Dawn"
	| "Diana"
	| "Diane"
	| "Eileen"
	| "Eleanor"
	| "Elena"
	| "Ella"
	| "Elsa"
	| "Eva"
	| "Evelyn"
	| "Fiona"
	| "Florence"
	| "Faith"
	| "Gloria"
	| "Hannah"
	| "Jade"
	| "Jasmine"
	| "Olivia"
	| "Ophelia";
export const npcFemaleNames: npcFemaleName[] = [
	"Katie",
	"Kathy",
	"Kendra",
	"Sophia",
	"Amy",
	"Amanda",
	"Ashley",
	"Alyssa",
	"Beth",
	"Brianna",
	"Bridget",
	"Brenda",
	"Caitlin",
	"Candice",
	"Cara",
	"Danielle",
	"Dawn",
	"Diana",
	"Diane",
	"Eileen",
	"Eleanor",
	"Elena",
	"Ella",
	"Elsa",
	"Eva",
	"Evelyn",
	"Fiona",
	"Florence",
	"Faith",
	"Gloria",
	"Hannah",
	"Jade",
	"Jasmine",
	"Olivia",
	"Ophelia",
];

export type NPCDisplayNames = npcMaleName | npcFemaleName;

type GenderMale = "Male";
type GenderFemale = "Female";
type Gender = GenderMale | GenderFemale;

export function randomNPCName<T extends Gender>(gender: T) {
	if (gender === "Male") {
		return randomIndex(npcMaleNames) as T extends GenderMale ? npcMaleName : never;
	} else if (gender === "Female") {
		return randomIndex(npcFemaleNames) as T extends GenderFemale ? npcFemaleName : never;
	} else {
		throw "Invalid gender";
	}
}

export const randomNpcName = (gender?: "Male" | "Female") => {
	if (!gender) return randomIndex([...npcMaleNames, ...npcFemaleNames]);
	const nameList = gender === "Male" ? npcMaleNames : npcFemaleNames;
	const name = randomIndex(nameList);
	if (gender === "Male") return name as npcMaleName;
	return name as npcFemaleName;
};
