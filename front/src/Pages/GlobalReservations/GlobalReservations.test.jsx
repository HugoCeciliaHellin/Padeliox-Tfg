import { render, screen, waitFor } from '@testing-library/react';
import GlobalReservations from './GlobalReservations';
import axios from 'axios';
import { MemoryRouter } from 'react-router-dom';

jest.mock('axios');

describe('Página GlobalReservations', () => {
  it('muestra el título principal', async () => {
    axios.get.mockResolvedValueOnce({ data: [] });

    render(
      <MemoryRouter>
        <GlobalReservations />
      </MemoryRouter>
    );
    // El título que debería verse en la página
    expect(screen.getByText(/Reservas próximas/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalled();
    });
  });
});
