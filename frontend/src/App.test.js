import { render, screen } from '@testing-library/react';
import App from './App';

beforeEach(() => {
  // Sidebar pings /health on mount; keep tests offline
  global.fetch = jest.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve({ status: 'ok' }) }));
});

test('opens straight into the app without a login screen', async () => {
  render(<App />);
  expect(screen.getAllByText(/TrueTrace/i).length).toBeGreaterThan(0);
  expect(screen.queryByText(/sign in/i)).not.toBeInTheDocument();
  expect(await screen.findByText(/Neural Engine Online/i)).toBeInTheDocument();
});
