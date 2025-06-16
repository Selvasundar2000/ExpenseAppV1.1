import { createRef } from 'react';

// Shared mutable ref object
const sharedRef = createRef();
sharedRef.current = []; // initial value

export default sharedRef;
