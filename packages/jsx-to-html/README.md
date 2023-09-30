# jsx-to-html

Serialize JSX to HTML directly and nothing more, with fully typed JSX allowing for a nice experience.

## Usage

Configure `tsconfig.json` as follows:

```json
{
	"compilerOptions": {
		"jsx": "react-jsx",
		"jsxImportSource": "@intrnl/jsx-to-html"
	}
}
```

You can then use it to render JSX!

```tsx
import { type JSXNode, render } from '@intrnl/jsx-to-html';

const Card = (props: { children?: JSXNode; title?: string }) => {
	return (
		<div class="card">
			<div class="card__title">{props.title}</div>
			<div class="card__body">{props.children}</div>
		</div>
	);
};

const App = () => {
	return (
		<>
			<h1>Hello!</h1>
			<Card title="Card title">
				<p>We're inside a card!</p>
			</Card>
		</>
	);
};

const result = render(<App />);
// -> '<h1>Hello!</h1><div class="card"><div class="card__title"> ...'
```
