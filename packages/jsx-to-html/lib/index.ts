import { Fragment } from './jsx-runtime.js';
import { JSXElement, type JSXNode } from './types.js';

export { Fragment } from './jsx-runtime.js';
export * from './types.js';

const $isArray = Array.isArray;

export const repeat = <T, R>(array: T[], mapper: (value: T, idx: number, array: T[]) => R): R[] => {
	let idx = 0;
	let len = array.length;

	let out = new Array(len);

	for (; idx < len; idx++) {
		out[idx] = mapper(array[idx], idx, array);
	}

	return out;
};

const UNSAFE_NAME = /[\s\\/='"\0<>]/;

const SELF_CLOSING = new Set([
	'area',
	'base',
	'br',
	'col',
	'command',
	'embed',
	'hr',
	'img',
	'input',
	'keygen',
	'link',
	'meta',
	'param',
	'source',
	'track',
	'wbr',
]);

export const render = (node: JSXNode, unsafe?: boolean): string => {
	if (node == null || node === true || node === false || node === '') {
		return '';
	}

	if ($isArray(node)) {
		let rendered = '';

		for (let idx = 0, len = node.length; idx < len; idx++) {
			const child = node[idx];

			if (child == null || child === true || child === false || child === '') {
				continue;
			}

			rendered += render(child, unsafe);
		}

		return rendered;
	}

	if (!(node instanceof JSXElement)) {
		if (typeof node === 'function') {
			return '';
		}

		return escape('' + node, false);
	}

	const type = node.type;
	const props = node.props;

	if (typeof type === 'function') {
		let rendered: JSXNode;

		if (type === Fragment) {
			rendered = props.children;
		} else {
			rendered = type(props);
		}

		return render(rendered, unsafe);
	}

	let res = '<' + type;
	let html = '';

	let children: JSXNode;
	let unsafeHTML: string | undefined;

	for (const name in props) {
		let value = props[name];

		switch (name) {
			case 'children':
				children = value;
				continue;

			case 'innerHTML':
				unsafeHTML = value;
				continue;

			case 'key':
			case 'ref':
			case '__self':
			case '__source':
				continue;

			case 'style':
				if (typeof value === 'object') {
					value = renderStyleMap(value);
				}
				break;

			default:
				if (!unsafe && UNSAFE_NAME.test(name)) {
					continue;
				}
		}

		if (value != null && value !== false && typeof value !== 'function') {
			if (value === true || value === '') {
				res = res + ' ' + name;
			} else {
				res = res + ' ' + name + '="' + escape('' + value, true) + '"';
			}
		}
	}

	if (unsafe && UNSAFE_NAME.test(type)) {
		throw new Error(`${type} is not a valid HTML tag name in ${res}>`);
	}

	if (unsafeHTML !== undefined) {
		html = unsafeHTML;
	} else if (typeof children === 'string') {
		html = escape(children, false);
	} else if (children != null && children !== false && children !== true) {
		html = render(children, unsafe);
	}

	if (!html && SELF_CLOSING.has(type)) {
		return res + '/>';
	}

	return res + '>' + html + '</' + type + '>';
};

const escape = (str: string, attr: boolean) => {
	let escaped = '';
	let last = 0;

	for (let idx = 0, len = str.length; idx < len; idx++) {
		const char = str.charCodeAt(idx);

		if (char === 38 || char === (attr ? 34 : 60)) {
			escaped += str.substring(last, idx) + ('&#' + char + ';');
			last = idx + 1;
		}
	}

	if (last === 0) {
		return str;
	}

	return escaped + str.substring(last);
};

const renderStyleMap = (map: Record<string, any>) => {
	let result = '';

	for (const prop in map) {
		const val = map[prop];
		result += prop + ':' + val + ';';
	}

	return result;
};
