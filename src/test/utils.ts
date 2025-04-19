// src/test/utils.ts
import { render } from '@testing-library/react';
import { ReactElement } from 'react';

// Re-export everything from @testing-library/react
export * from '@testing-library/react';

// Custom render function that can be extended if needed
const customRender = (ui: ReactElement, options = {}) => {
  return render(ui, {
    // Add custom wrapper if needed
    // wrapper: ({ children }) => <SomeProvider>{children}</SomeProvider>,
    ...options,
  });
};

// Override render method
export { customRender as render };
