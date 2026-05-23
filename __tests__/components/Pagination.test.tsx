import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/store/features/authSlice';
import notificationReducer from '@/store/features/notificationSlice';
import { apiSlice } from '@/store/services/api';
import Pagination from '@/components/ui/Pagination';

// Helper to create test store
const createTestStore = (preloadedState = {}) => {
  return configureStore({
    reducer: {
      [apiSlice.reducerPath]: apiSlice.reducer,
      auth: authReducer,
      notifications: notificationReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(apiSlice.middleware),
    preloadedState,
  });
};

// Wrapper component for testing
const TestWrapper = ({ children, store }: { children: React.ReactNode; store?: any }) => {
  const testStore = store || createTestStore();
  return <Provider store={testStore}>{children}</Provider>;
};

describe('Pagination Component', () => {
  it('renders correctly with pagination info', () => {
    const mockOnPageChange = jest.fn();

    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        total={50}
        limit={10}
        onPageChange={mockOnPageChange}
      />
    );

    expect(screen.getByText(/Showing 1 to 10 of 50 results/i)).toBeInTheDocument();
  });

  it('disables previous button on first page', () => {
    const mockOnPageChange = jest.fn();

    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        total={50}
        limit={10}
        onPageChange={mockOnPageChange}
      />
    );

    const prevButton = screen.getAllByRole('button')[0];
    expect(prevButton).toBeDisabled();
  });

  it('disables next button on last page', () => {
    const mockOnPageChange = jest.fn();

    render(
      <Pagination
        currentPage={5}
        totalPages={5}
        total={50}
        limit={10}
        onPageChange={mockOnPageChange}
      />
    );

    const buttons = screen.getAllByRole('button');
    const nextButton = buttons[buttons.length - 1];
    expect(nextButton).toBeDisabled();
  });

  it('calls onPageChange when clicking page numbers', () => {
    const mockOnPageChange = jest.fn();

    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        total={50}
        limit={10}
        onPageChange={mockOnPageChange}
      />
    );

    const page2Button = screen.getByText('2');
    fireEvent.click(page2Button);

    expect(mockOnPageChange).toHaveBeenCalledWith(2);
  });

  it('calls onPageChange when clicking next button', () => {
    const mockOnPageChange = jest.fn();

    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        total={50}
        limit={10}
        onPageChange={mockOnPageChange}
      />
    );

    const buttons = screen.getAllByRole('button');
    const nextButton = buttons[buttons.length - 1];
    fireEvent.click(nextButton);

    expect(mockOnPageChange).toHaveBeenCalledWith(2);
  });

  it('shows simple text for single page', () => {
    const mockOnPageChange = jest.fn();

    render(
      <Pagination
        currentPage={1}
        totalPages={1}
        total={5}
        limit={10}
        onPageChange={mockOnPageChange}
      />
    );

    expect(screen.getByText(/Showing 5 results/i)).toBeInTheDocument();
  });
});
