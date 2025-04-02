import '@testing-library/jest-dom';
import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import matchers from '@testing-library/jest-dom/matchers';

// Estende o expect do Vitest com os matchers do jest-dom
expect.extend(matchers);

// Limpa o DOM após cada teste
afterEach(() => {
  cleanup();
}); 