import { render, repeat } from '@intrnl/jsx-to-html';

const Counter = (props: { defaultValue?: number }) => {
	return <button>clicked {props.defaultValue ?? 0} times</button>;
};

const vnode = (
	<>
		<Counter />
		<Counter defaultValue={20} />
		<div title="hello niece & nephew">hello world</div>
		<ul>
			{repeat([1, 3, 3], (value) => {
				return <li>{value}</li>;
			})}
		</ul>
	</>
);

const result = render(vnode);

console.log(result);
