// This doesn't really do anything.
export type JSXKey = string | number;

export class JSXElement<P = any> {
	constructor(
		public type: string | Component<P>,
		public props: P,
	) {}
}

export type JSXText = string | number;
export type JSXChild = JSXText | JSXElement;

export type JSXNodeArray = JSXNode[];
export type JSXNode = JSXChild | JSXNodeArray | boolean | null | undefined;

export interface Component<P = {}> {
	(props: P): JSXElement | null;
}
