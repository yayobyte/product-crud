import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProductForm } from './ProductForm';
import type { Product } from '../../types/product';

const mockInitialProduct: Product = {
  id: 1,
  title: 'Test Product',
  price: 99.99,
  description: 'This is a test product description.',
  category: 'Test Category',
  image: 'https://example.com/test.jpg',
  rating: { rate: 4.5, count: 100 },
};

const mockEmptyProductData: Omit<Product, 'id' | 'rating'> = {
  title: '',
  price: 0,
  description: '',
  category: '',
  image: '',
};

describe('ProductForm', () => {
  let onSubmitMock: ReturnType<typeof vi.fn>;
  let onCancelMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    onSubmitMock = vi.fn();
    onCancelMock = vi.fn();
    // Mock window.alert
    global.alert = vi.fn();
  });

  const renderComponent = (props = {}) => {
    const defaultProps = {
      onSubmit: onSubmitMock,
    };
    return render(<ProductForm {...defaultProps} {...props} />);
  };

  it('renders all input fields and default submit button text', () => {
    renderComponent();
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/price/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/category/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/image url/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /add product/i })
    ).toBeInTheDocument();
  });

  it('displays "Update Product" on submit button when isEditMode is true', () => {
    renderComponent({ isEditMode: true });
    expect(
      screen.getByRole('button', { name: /update product/i })
    ).toBeInTheDocument();
  });

  it('pre-fills form fields if initialData is provided', () => {
    renderComponent({ initialData: mockInitialProduct });
    expect(screen.getByLabelText<HTMLInputElement>(/title/i).value).toBe(
      mockInitialProduct.title
    );
    expect(screen.getByLabelText<HTMLInputElement>(/price/i).value).toBe(
      mockInitialProduct.price.toString()
    );
    expect(
      screen.getByLabelText<HTMLTextAreaElement>(/description/i).value
    ).toBe(mockInitialProduct.description);
    expect(screen.getByLabelText<HTMLInputElement>(/category/i).value).toBe(
      mockInitialProduct.category
    );
    expect(screen.getByLabelText<HTMLInputElement>(/image url/i).value).toBe(
      mockInitialProduct.image
    );
  });

  it('renders Cancel button if onCancel prop is provided', () => {
    renderComponent({ onCancel: onCancelMock });
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
  });

  it('does not render Cancel button if onCancel prop is not provided', () => {
    renderComponent();
    expect(
      screen.queryByRole('button', { name: /cancel/i })
    ).not.toBeInTheDocument();
  });

  it('updates internal state on input change', async () => {
    const user = userEvent.setup();
    renderComponent();
    const titleInput = screen.getByLabelText<HTMLInputElement>(/title/i);
    await user.type(titleInput, 'New Title');
    expect(titleInput.value).toBe('New Title');

    const priceInput = screen.getByLabelText<HTMLInputElement>(/price/i);
    await user.clear(priceInput); // Clear existing 0 if any
    await user.type(priceInput, '123.45');
    expect(priceInput.value).toBe('123.45');
  });

  it('calls onSubmit with product data when form is submitted with valid inputs', async () => {
    const user = userEvent.setup();
    renderComponent();

    await user.type(screen.getByLabelText(/title/i), 'Valid Title');
    await user.type(screen.getByLabelText(/price/i), '10.99');
    await user.type(screen.getByLabelText(/description/i), 'Valid Description');
    await user.type(screen.getByLabelText(/category/i), 'Valid Category');
    await user.type(
      screen.getByLabelText(/image url/i),
      'https://valid.url/image.png'
    );

    await user.click(screen.getByRole('button', { name: /add product/i }));

    expect(onSubmitMock).toHaveBeenCalledTimes(1);
    expect(onSubmitMock).toHaveBeenCalledWith({
      title: 'Valid Title',
      price: 10.99,
      description: 'Valid Description',
      category: 'Valid Category',
      image: 'https://valid.url/image.png',
    });
    expect(global.alert).not.toHaveBeenCalled();
  });

  it('shows an alert and does not call onSubmit if title is missing', async () => {
    const user = userEvent.setup();
    renderComponent(); // Render with no initialData for this specific test case

    // Fill all fields EXCEPT title
    const priceInput = screen.getByLabelText<HTMLInputElement>(/price/i);
    await user.clear(priceInput);
    await user.type(priceInput, '10.99');

    const descriptionInput =
      screen.getByLabelText<HTMLTextAreaElement>(/description/i);
    await user.clear(descriptionInput);
    await user.type(descriptionInput, 'Valid Description');

    const categoryInput = screen.getByLabelText<HTMLInputElement>(/category/i);
    await user.clear(categoryInput);
    await user.type(categoryInput, 'Valid Category');

    const imageInput = screen.getByLabelText<HTMLInputElement>(/image url/i);
    await user.clear(imageInput);
    await user.type(imageInput, 'https://valid.url/image.png');

    // Title field is left untouched, its state should remain the initial ''

    // Programmatically submit the form to bypass native HTML5 validation
    fireEvent.submit(screen.getByTestId('product-form'));

    expect(global.alert).toHaveBeenCalledWith('Please fill in all fields.');
    expect(onSubmitMock).not.toHaveBeenCalled();
  });

  it('calls onCancel when Cancel button is clicked', async () => {
    const user = userEvent.setup();
    renderComponent({ onCancel: onCancelMock });
    await user.click(screen.getByRole('button', { name: /cancel/i }));
    expect(onCancelMock).toHaveBeenCalledTimes(1);
  });
});
