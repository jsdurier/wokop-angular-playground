export default interface IPositionInOverlay {
	x: Axis;
	y: Axis;
}

export type Axis = number | 'center';
