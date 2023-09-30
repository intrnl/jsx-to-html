import type { JSXInternal } from './internal.js';
import { JSXElement, type Component, type JSXKey, type JSXNode } from './types.js';

export type { JSXInternal as JSX };

interface JSXFunction {
	<T extends keyof JSXInternal.IntrinsicElements>(
		type: T,
		props: JSXInternal.IntrinsicElements[T],
		key?: JSXKey,
	): JSXElement;
	<P>(type: Component<P>, props: P, key?: JSXKey): JSXElement;
}

export const Fragment = (props: { children: JSXNode }) => {
	return props.children;
};

const createElement = ((type: string | Component, props: any, _key?: JSXKey) => {
	return new JSXElement(type, props);
}) as JSXFunction;

export { createElement as jsx, createElement as jsxDEV, createElement as jsxs, createElement as jsxsDEV };
