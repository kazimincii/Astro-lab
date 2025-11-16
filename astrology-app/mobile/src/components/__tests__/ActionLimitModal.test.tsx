import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ActionLimitModal from '../ActionLimitModal';

// Mock navigation
const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}));

describe('ActionLimitModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Plan User', () => {
    it('should render modal for basic plan user', () => {
      const { getByText } = render(
        <ActionLimitModal
          visible={true}
          onClose={jest.fn()}
          currentPlan="basic"
          actionsUsed={2}
          dailyLimit={2}
        />
      );

      expect(getByText("You've used all your daily actions")).toBeTruthy();
      expect(getByText("You've used 2 out of 2 free actions today.")).toBeTruthy();
    });

    it('should show upgrade benefits for basic plan', () => {
      const { getByText } = render(
        <ActionLimitModal
          visible={true}
          onClose={jest.fn()}
          currentPlan="basic"
          actionsUsed={2}
          dailyLimit={2}
        />
      );

      expect(getByText('Upgrade to get:')).toBeTruthy();
      expect(getByText('Standard: 4 actions/day for $10/month')).toBeTruthy();
      expect(getByText('Premium: UNLIMITED actions for $19/month')).toBeTruthy();
    });

    it('should show "View Plans" button for basic plan', () => {
      const { getByText } = render(
        <ActionLimitModal
          visible={true}
          onClose={jest.fn()}
          currentPlan="basic"
          actionsUsed={2}
          dailyLimit={2}
        />
      );

      expect(getByText('View Plans')).toBeTruthy();
    });

    it('should navigate to MyPlan when upgrade button is pressed', () => {
      const onClose = jest.fn();
      const { getByText } = render(
        <ActionLimitModal
          visible={true}
          onClose={onClose}
          currentPlan="basic"
          actionsUsed={2}
          dailyLimit={2}
        />
      );

      fireEvent.press(getByText('View Plans'));

      expect(onClose).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('MyPlan');
    });

    it('should show "Maybe Later" button for basic plan', () => {
      const { getByText } = render(
        <ActionLimitModal
          visible={true}
          onClose={jest.fn()}
          currentPlan="basic"
          actionsUsed={2}
          dailyLimit={2}
        />
      );

      expect(getByText('Maybe Later')).toBeTruthy();
    });
  });

  describe('Standard Plan User', () => {
    it('should render modal for standard plan user', () => {
      const { getByText } = render(
        <ActionLimitModal
          visible={true}
          onClose={jest.fn()}
          currentPlan="standard"
          actionsUsed={4}
          dailyLimit={4}
        />
      );

      expect(getByText("You've reached your daily limit")).toBeTruthy();
      expect(getByText("You've used all 4 actions today.")).toBeTruthy();
    });

    it('should show premium benefits for standard plan', () => {
      const { getByText } = render(
        <ActionLimitModal
          visible={true}
          onClose={jest.fn()}
          currentPlan="standard"
          actionsUsed={4}
          dailyLimit={4}
        />
      );

      expect(getByText('Premium: UNLIMITED actions')).toBeTruthy();
      expect(getByText('Pro mode interpretations')).toBeTruthy();
      expect(getByText('Up to 50 profiles')).toBeTruthy();
    });

    it('should show "Upgrade to Premium" button for standard plan', () => {
      const { getByText } = render(
        <ActionLimitModal
          visible={true}
          onClose={jest.fn()}
          currentPlan="standard"
          actionsUsed={4}
          dailyLimit={4}
        />
      );

      expect(getByText('Upgrade to Premium')).toBeTruthy();
    });

    it('should navigate to MyPlan when upgrade button is pressed', () => {
      const onClose = jest.fn();
      const { getByText } = render(
        <ActionLimitModal
          visible={true}
          onClose={onClose}
          currentPlan="standard"
          actionsUsed={4}
          dailyLimit={4}
        />
      );

      fireEvent.press(getByText('Upgrade to Premium'));

      expect(onClose).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('MyPlan');
    });
  });

  describe('Premium Plan User', () => {
    it('should render modal for premium plan user', () => {
      const { getByText } = render(
        <ActionLimitModal
          visible={true}
          onClose={jest.fn()}
          currentPlan="premium"
          actionsUsed={100}
          dailyLimit={-1}
        />
      );

      expect(getByText('Daily limit reached')).toBeTruthy();
      expect(getByText('Come back tomorrow for more actions!')).toBeTruthy();
    });

    it('should not show upgrade benefits for premium plan', () => {
      const { queryByText } = render(
        <ActionLimitModal
          visible={true}
          onClose={jest.fn()}
          currentPlan="premium"
          actionsUsed={100}
          dailyLimit={-1}
        />
      );

      expect(queryByText('Upgrade to get:')).toBeNull();
    });

    it('should not show upgrade button for premium plan', () => {
      const { queryByText } = render(
        <ActionLimitModal
          visible={true}
          onClose={jest.fn()}
          currentPlan="premium"
          actionsUsed={100}
          dailyLimit={-1}
        />
      );

      expect(queryByText('View Plans')).toBeNull();
      expect(queryByText('Upgrade to Premium')).toBeNull();
    });

    it('should show "OK" button for premium plan', () => {
      const { getByText } = render(
        <ActionLimitModal
          visible={true}
          onClose={jest.fn()}
          currentPlan="premium"
          actionsUsed={100}
          dailyLimit={-1}
        />
      );

      expect(getByText('OK')).toBeTruthy();
    });
  });

  describe('Modal Behavior', () => {
    it('should call onClose when close button is pressed', () => {
      const onClose = jest.fn();
      const { getByText } = render(
        <ActionLimitModal
          visible={true}
          onClose={onClose}
          currentPlan="basic"
          actionsUsed={2}
          dailyLimit={2}
        />
      );

      fireEvent.press(getByText('Maybe Later'));

      expect(onClose).toHaveBeenCalled();
    });

    it('should not render when visible is false', () => {
      const { queryByText } = render(
        <ActionLimitModal
          visible={false}
          onClose={jest.fn()}
          currentPlan="basic"
          actionsUsed={2}
          dailyLimit={2}
        />
      );

      // Modal should not render content when visible is false
      expect(queryByText("You've used all your daily actions")).toBeNull();
    });

    it('should show reset info message', () => {
      const { getByText } = render(
        <ActionLimitModal
          visible={true}
          onClose={jest.fn()}
          currentPlan="basic"
          actionsUsed={2}
          dailyLimit={2}
        />
      );

      expect(getByText('Your actions will reset tomorrow at midnight')).toBeTruthy();
    });
  });

  describe('UI Elements', () => {
    it('should render lightning bolt icon', () => {
      const { getByText } = render(
        <ActionLimitModal
          visible={true}
          onClose={jest.fn()}
          currentPlan="basic"
          actionsUsed={2}
          dailyLimit={2}
        />
      );

      expect(getByText('⚡')).toBeTruthy();
    });

    it('should render checkmarks for benefits', () => {
      const { getAllByText } = render(
        <ActionLimitModal
          visible={true}
          onClose={jest.fn()}
          currentPlan="basic"
          actionsUsed={2}
          dailyLimit={2}
        />
      );

      const checkmarks = getAllByText('✓');
      expect(checkmarks.length).toBe(2); // Two benefits for basic plan
    });
  });

  describe('Actions Used Display', () => {
    it('should display correct actions used and limit for basic plan', () => {
      const { getByText } = render(
        <ActionLimitModal
          visible={true}
          onClose={jest.fn()}
          currentPlan="basic"
          actionsUsed={1}
          dailyLimit={2}
        />
      );

      expect(getByText("You've used 1 out of 2 free actions today.")).toBeTruthy();
    });

    it('should display correct actions used for standard plan', () => {
      const { getByText } = render(
        <ActionLimitModal
          visible={true}
          onClose={jest.fn()}
          currentPlan="standard"
          actionsUsed={4}
          dailyLimit={4}
        />
      );

      expect(getByText("You've used all 4 actions today.")).toBeTruthy();
    });

    it('should handle different limit values', () => {
      const { getByText } = render(
        <ActionLimitModal
          visible={true}
          onClose={jest.fn()}
          currentPlan="basic"
          actionsUsed={3}
          dailyLimit={3}
        />
      );

      expect(getByText("You've used 3 out of 3 free actions today.")).toBeTruthy();
    });
  });
});
