export default interface ITreeNode<T> {
	value: T;
	children?: ITreeNode<T>[];
}
