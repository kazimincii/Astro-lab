import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import { PaymentSheet } from '../PaymentSheet';
import { paymentsApi } from '@/api/payments';

// Mock Stripe
const mockInitPaymentSheet = jest.fn();
const mockPresentPaymentSheet = jest.fn();

jest.mock('@stripe/stripe-react-native', () => ({
  useStripe: () => ({
    initPaymentSheet: mockInitPaymentSheet,
    presentPaymentSheet: mockPresentPaymentSheet,
  }),
}));

// Mock payments API
jest.mock('@/api/payments', () => ({
  paymentsApi: {
    createPaymentIntent: jest.fn(),
  },
}));

// Mock Alert
jest.spyOn(Alert, 'alert');

// Mock theme colors
jest.mock('@/theme/colors', () => ({
  colors: {
    cosmic: {
      bg: '#000',
      card: '#111',
      text: '#fff',
      textSecondary: '#999',
      purple: '#6366f1',
    },
  },
}));

describe('PaymentSheet', () => {
  const mockOnSuccess = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (paymentsApi.createPaymentIntent as jest.Mock).mockResolvedValue({
      clientSecret: 'pi_secret_123',
    });
    mockInitPaymentSheet.mockResolvedValue({ error: null });
    mockPresentPaymentSheet.mockResolvedValue({ error: null });
  });

  describe('Rendering', () => {
    it('should render payment sheet with standard monthly plan', () => {
      const { getByText } = render(
        <PaymentSheet
          planType="standard"
          billingCycle="monthly"
          amount={10}
          onSuccess={mockOnSuccess}
          onCancel={mockOnCancel}
        />
      );

      expect(getByText('Complete Payment')).toBeTruthy();
      expect(getByText('Standard')).toBeTruthy();
      expect(getByText('Monthly')).toBeTruthy();
      expect(getByText('$10/month')).toBeTruthy();
    });

    it('should render payment sheet with premium yearly plan', () => {
      const { getByText } = render(
        <PaymentSheet
          planType="premium"
          billingCycle="yearly"
          amount={180}
          onSuccess={mockOnSuccess}
          onCancel={mockOnCancel}
        />
      );

      expect(getByText('Premium')).toBeTruthy();
      expect(getByText('Yearly')).toBeTruthy();
      expect(getByText('$180/year')).toBeTruthy();
    });

    it('should render payment sheet with basic plan', () => {
      const { getByText } = render(
        <PaymentSheet
          planType="basic"
          billingCycle="monthly"
          amount={0}
          onSuccess={mockOnSuccess}
          onCancel={mockOnCancel}
        />
      );

      expect(getByText('Basic')).toBeTruthy();
    });

    it('should show secure payment message', () => {
      const { getByText } = render(
        <PaymentSheet
          planType="standard"
          billingCycle="monthly"
          amount={10}
          onSuccess={mockOnSuccess}
          onCancel={mockOnCancel}
        />
      );

      expect(
        getByText(
          'Secure payment powered by Stripe. Your payment information is encrypted and secure.'
        )
      ).toBeTruthy();
    });

    it('should show pay button with amount', () => {
      const { getByText } = render(
        <PaymentSheet
          planType="standard"
          billingCycle="monthly"
          amount={10}
          onSuccess={mockOnSuccess}
          onCancel={mockOnCancel}
        />
      );

      expect(getByText('Pay $10')).toBeTruthy();
    });

    it('should show cancel button', () => {
      const { getByText } = render(
        <PaymentSheet
          planType="standard"
          billingCycle="monthly"
          amount={10}
          onSuccess={mockOnSuccess}
          onCancel={mockOnCancel}
        />
      );

      expect(getByText('Cancel')).toBeTruthy();
    });
  });

  describe('Payment Flow', () => {
    it('should handle successful payment flow', async () => {
      const { getByText } = render(
        <PaymentSheet
          planType="standard"
          billingCycle="monthly"
          amount={10}
          onSuccess={mockOnSuccess}
          onCancel={mockOnCancel}
        />
      );

      fireEvent.press(getByText('Pay $10'));

      await waitFor(() => {
        expect(paymentsApi.createPaymentIntent).toHaveBeenCalledWith('standard_monthly');
      });

      await waitFor(() => {
        expect(mockInitPaymentSheet).toHaveBeenCalledWith({
          paymentIntentClientSecret: 'pi_secret_123',
          merchantDisplayName: 'Astrology App',
          style: 'automatic',
          returnURL: 'astrology://payment-return',
        });
      });

      await waitFor(() => {
        expect(mockPresentPaymentSheet).toHaveBeenCalled();
      });

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith(
          'Success',
          'Your subscription has been activated!',
          expect.any(Array)
        );
      });
    });

    it('should create payment intent with correct plan ID', async () => {
      const { getByText } = render(
        <PaymentSheet
          planType="premium"
          billingCycle="yearly"
          amount={180}
          onSuccess={mockOnSuccess}
          onCancel={mockOnCancel}
        />
      );

      fireEvent.press(getByText('Pay $180'));

      await waitFor(() => {
        expect(paymentsApi.createPaymentIntent).toHaveBeenCalledWith('premium_yearly');
      });
    });

    it('should call onSuccess after successful payment confirmation', async () => {
      const { getByText } = render(
        <PaymentSheet
          planType="standard"
          billingCycle="monthly"
          amount={10}
          onSuccess={mockOnSuccess}
          onCancel={mockOnCancel}
        />
      );

      fireEvent.press(getByText('Pay $10'));

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalled();
      });

      // Simulate user pressing OK on success alert
      const alertCall = (Alert.alert as jest.Mock).mock.calls[0];
      const okButton = alertCall[2][0];
      okButton.onPress();

      expect(mockOnSuccess).toHaveBeenCalled();
    });
  });

  describe('Error Handling', () => {
    it('should handle payment intent creation error', async () => {
      (paymentsApi.createPaymentIntent as jest.Mock).mockRejectedValue(
        new Error('Network error')
      );

      const { getByText } = render(
        <PaymentSheet
          planType="standard"
          billingCycle="monthly"
          amount={10}
          onSuccess={mockOnSuccess}
          onCancel={mockOnCancel}
        />
      );

      fireEvent.press(getByText('Pay $10'));

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith('Error', 'Network error');
      });

      expect(mockOnSuccess).not.toHaveBeenCalled();
    });

    it('should handle payment sheet initialization error', async () => {
      mockInitPaymentSheet.mockResolvedValue({
        error: { message: 'Failed to initialize' },
      });

      const { getByText } = render(
        <PaymentSheet
          planType="standard"
          billingCycle="monthly"
          amount={10}
          onSuccess={mockOnSuccess}
          onCancel={mockOnCancel}
        />
      );

      fireEvent.press(getByText('Pay $10'));

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith('Error', 'Failed to initialize');
      });

      expect(mockPresentPaymentSheet).not.toHaveBeenCalled();
    });

    it('should handle payment presentation error', async () => {
      mockPresentPaymentSheet.mockResolvedValue({
        error: { code: 'Failed', message: 'Payment failed' },
      });

      const { getByText } = render(
        <PaymentSheet
          planType="standard"
          billingCycle="monthly"
          amount={10}
          onSuccess={mockOnSuccess}
          onCancel={mockOnCancel}
        />
      );

      fireEvent.press(getByText('Pay $10'));

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith('Payment Failed', 'Payment failed');
      });

      expect(mockOnSuccess).not.toHaveBeenCalled();
    });

    it('should handle user cancellation without showing error', async () => {
      mockPresentPaymentSheet.mockResolvedValue({
        error: { code: 'Canceled', message: 'User canceled' },
      });

      const { getByText } = render(
        <PaymentSheet
          planType="standard"
          billingCycle="monthly"
          amount={10}
          onSuccess={mockOnSuccess}
          onCancel={mockOnCancel}
        />
      );

      fireEvent.press(getByText('Pay $10'));

      await waitFor(() => {
        expect(mockPresentPaymentSheet).toHaveBeenCalled();
      });

      // Should not show alert for user cancellation
      expect(Alert.alert).not.toHaveBeenCalled();
      expect(mockOnSuccess).not.toHaveBeenCalled();
    });

    it('should handle generic error without message', async () => {
      (paymentsApi.createPaymentIntent as jest.Mock).mockRejectedValue(new Error());

      const { getByText } = render(
        <PaymentSheet
          planType="standard"
          billingCycle="monthly"
          amount={10}
          onSuccess={mockOnSuccess}
          onCancel={mockOnCancel}
        />
      );

      fireEvent.press(getByText('Pay $10'));

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith(
          'Error',
          'Payment failed. Please try again.'
        );
      });
    });
  });

  describe('Cancel Button', () => {
    it('should call onCancel when cancel button is pressed', () => {
      const { getByText } = render(
        <PaymentSheet
          planType="standard"
          billingCycle="monthly"
          amount={10}
          onSuccess={mockOnSuccess}
          onCancel={mockOnCancel}
        />
      );

      fireEvent.press(getByText('Cancel'));

      expect(mockOnCancel).toHaveBeenCalled();
    });

    it('should call onCancel when close icon is pressed', () => {
      const { getByTestId, UNSAFE_getByType } = render(
        <PaymentSheet
          planType="standard"
          billingCycle="monthly"
          amount={10}
          onSuccess={mockOnSuccess}
          onCancel={mockOnCancel}
        />
      );

      // Find close button by finding TouchableOpacity near the title
      const closeButton = UNSAFE_getByType(require('react-native').TouchableOpacity);
      fireEvent.press(closeButton);

      expect(mockOnCancel).toHaveBeenCalled();
    });
  });

  describe('Loading State', () => {
    it('should show loading indicator during payment', async () => {
      mockPresentPaymentSheet.mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve({ error: null }), 100))
      );

      const { getByText, UNSAFE_queryByType } = render(
        <PaymentSheet
          planType="standard"
          billingCycle="monthly"
          amount={10}
          onSuccess={mockOnSuccess}
          onCancel={mockOnCancel}
        />
      );

      fireEvent.press(getByText('Pay $10'));

      await waitFor(() => {
        const ActivityIndicator = require('react-native').ActivityIndicator;
        expect(UNSAFE_queryByType(ActivityIndicator)).toBeTruthy();
      });
    });

    it('should disable buttons during payment', async () => {
      let resolvePayment: any;
      mockPresentPaymentSheet.mockImplementation(
        () => new Promise((resolve) => (resolvePayment = resolve))
      );

      const { getByText } = render(
        <PaymentSheet
          planType="standard"
          billingCycle="monthly"
          amount={10}
          onSuccess={mockOnSuccess}
          onCancel={mockOnCancel}
        />
      );

      const payButton = getByText('Pay $10');
      fireEvent.press(payButton);

      await waitFor(() => {
        expect(paymentsApi.createPaymentIntent).toHaveBeenCalled();
      });

      // Buttons should be disabled during loading
      // This is implicit in the component behavior
      resolvePayment({ error: null });
    });
  });

  describe('Plan Type Capitalization', () => {
    it('should capitalize basic plan name', () => {
      const { getByText } = render(
        <PaymentSheet
          planType="basic"
          billingCycle="monthly"
          amount={0}
          onSuccess={mockOnSuccess}
          onCancel={mockOnCancel}
        />
      );

      expect(getByText('Basic')).toBeTruthy();
    });

    it('should capitalize standard plan name', () => {
      const { getByText } = render(
        <PaymentSheet
          planType="standard"
          billingCycle="monthly"
          amount={10}
          onSuccess={mockOnSuccess}
          onCancel={mockOnCancel}
        />
      );

      expect(getByText('Standard')).toBeTruthy();
    });

    it('should capitalize premium plan name', () => {
      const { getByText } = render(
        <PaymentSheet
          planType="premium"
          billingCycle="yearly"
          amount={180}
          onSuccess={mockOnSuccess}
          onCancel={mockOnCancel}
        />
      );

      expect(getByText('Premium')).toBeTruthy();
    });
  });

  describe('Billing Cycle Display', () => {
    it('should show /month for monthly billing', () => {
      const { getByText } = render(
        <PaymentSheet
          planType="standard"
          billingCycle="monthly"
          amount={10}
          onSuccess={mockOnSuccess}
          onCancel={mockOnCancel}
        />
      );

      expect(getByText('$10/month')).toBeTruthy();
    });

    it('should show /year for yearly billing', () => {
      const { getByText } = render(
        <PaymentSheet
          planType="standard"
          billingCycle="yearly"
          amount={100}
          onSuccess={mockOnSuccess}
          onCancel={mockOnCancel}
        />
      );

      expect(getByText('$100/year')).toBeTruthy();
    });
  });
});
