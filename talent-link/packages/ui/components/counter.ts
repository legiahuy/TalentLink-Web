import React from 'react';

export interface CounterProps {
  initialValue?: number;
}

export function Counter({ initialValue = 0 }: CounterProps = {}) {
  const [count, setCount] = React.useState(initialValue);
  
  return {
    count,
    increment: () => setCount(prev => prev + 1),
    decrement: () => setCount(prev => prev - 1),
    reset: () => setCount(initialValue)
  };
}
