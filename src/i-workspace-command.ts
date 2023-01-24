export default interface IWorkspaceCommand {
	name: string;
	handler: (...args: any[]) => void;
}
