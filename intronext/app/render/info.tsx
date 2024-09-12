/*
SOME LIBRARIES of REACT

Key = It's a type that represents the value of the key prop used in React. When rendering lists of elements, React needs a unique key for each item to track their identity across renders.
ReactElement = A ReactElement is the type of the object returned from components before being rendered by the virtual DOM.
JSXElementConstructor = Represents a constructor (function or class) that returns a JSX element. This is useful when defining a component in TypeScript and ensuring that the component follows React's expectations for returning valid JSX.
ReactNode = Represents anything that can be rendered by React. This includes strings, numbers, JSX elements, arrays of nodes, fragments, etc.It is used as a type for props like children, since children can be anything that React can render
ReactPortal = Represents a Portal, which is a feature in React that allows you to render components outside of the main DOM hierarchy of your app. It is typically used when you need to render something like a modal or tooltip outside of its parent component’s DOM hierarchy.
AwaitedReactNode = This type represents a ReactNode that can also be awaited. It’s used in the context of Suspense or React.lazy where components are asynchronously loaded. It allows React to handle async operations and eventually render the appropriate content once the promise resolves.

::SUMMARY::
    Key= Used for unique keys when rendering lists in React.
    ReactElement= Represents a valid React element that is returned by a component.
    JSXElementConstructor= Describes a function or class that constructs JSX elements.
    ReactNode= Represents anything that React can render, often used for children.
    ReactPortal= Used to create portals, rendering content outside of the normal DOM hierarchy.
    AwaitedReactNode= Represents a ReactNode that can be awaited in asynchronous components.
*/