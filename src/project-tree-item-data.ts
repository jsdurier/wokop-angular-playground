export default interface IData {
	icon?: string;
	label: string;
	actions?: IAction[];
}

interface IAction {
	icon: string;
	callack: () => void;
}
