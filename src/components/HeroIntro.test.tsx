import { render, screen } from '@testing-library/react';
import { HeroIntro } from './HeroIntro';

describe('HeroIntro', () => {
  it('zobrazí všetky hlavné texty', () => {
    render(<HeroIntro />);

    expect(screen.getByText('Household budget calculator')).toBeInTheDocument();
    expect(screen.getByText('Monthly household finance overview')).toBeInTheDocument();
    expect(
      screen.getByText('Enter your income, savings goal, and monthly expenses.')
    ).toBeInTheDocument();
    //screen.debug();
  });
  
});