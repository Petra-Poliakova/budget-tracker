import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import {ExpenseInput} from './ExpenseInput';    


describe('ExpenseInput', () => {
  it('zavolá callback keď používateľ píše do inputu', async () => {
    const mockOnChange = vi.fn();
    const user = userEvent.setup();
    
    render(
      <ExpenseInput 
        expenseId="test-input"
        expenseLabel="Test Label"
        expenseValue=""
        onExpenseChange={mockOnChange}
      />
    );
    
    const input = screen.getByLabelText('Test Label');
    await user.type(input, '100');

    expect(mockOnChange).toHaveBeenCalled();
  });
});

//https://github.com/alexhddev/React-testing-course/tree/main

//https://medium.com/@ignatovich.dm/testing-react-hooks-best-practices-with-examples-d3fb5246aa09
//https://www.geeksforgeeks.org/reactjs/testing-custom-hooks-with-react-testing-library/
//https://dev.to/kevinccbsg/react-testing-setup-vitest-typescript-react-testing-library-42c8
//https://oneuptime.com/blog/post/2026-01-15-test-react-hooks-testing-library/view
//https://github.com/testing-library/react-hooks-testing-library
//https://github.com/testing-library/react-hooks-testing-library
//https://dev.to/teyim/effortless-testing-setup-for-react-with-vite-typescript-jest-and-react-testing-library-1c48