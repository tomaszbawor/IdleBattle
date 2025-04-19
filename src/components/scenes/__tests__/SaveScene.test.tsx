import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '../../../test/utils';
import SaveScene from '../SaveScene';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();

// Mock window.confirm
vi.stubGlobal('confirm', vi.fn(() => true));

// Mock FlickerButton and Button components
vi.mock('../../ui/FlickerButton', () => ({
  default: ({ text, onClick }: { text: string; onClick: () => void }) => (
    <button onClick={onClick} data-testid={`flicker-button-${text}`}>
      {text}
    </button>
  ),
}));

// Mock GameContext actions
vi.mock('../../../context/GameContext', async () => {
  const actual = await vi.importActual('../../../context/GameContext');
  return {
    ...actual,
    useGame: () => ({
      state: {},
      actions: {
        setPlayer: vi.fn(),
        loadGame: vi.fn(),
      },
    }),
  };
});

describe('SaveScene', () => {
  beforeEach(() => {
    // Setup localStorage mock
    Object.defineProperty(window, 'localStorage', { value: localStorageMock });
    localStorageMock.clear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders the scene title', () => {
    render(<SaveScene onNewGame={() => {}} onLoadGame={() => {}} />);
    expect(screen.getByText('Select or Create a Character')).toBeInTheDocument();
  });

  it('renders four save slots', () => {
    render(<SaveScene onNewGame={() => {}} onLoadGame={() => {}} />);
    
    // Each empty slot has name, password, and confirm password inputs
    const nameInputs = screen.getAllByLabelText(/NAME:/i);
    expect(nameInputs).toHaveLength(4);
    
    const passwordInputs = screen.getAllByLabelText(/Password:/i);
    expect(passwordInputs).toHaveLength(4);
    
    const confirmInputs = screen.getAllByLabelText(/Confirm:/i);
    expect(confirmInputs).toHaveLength(4);
  });

  it('shows warning when fields are empty', async () => {
    render(<SaveScene onNewGame={() => {}} onLoadGame={() => {}} />);
    
    // Get the first slot's inputs
    const nameInput = screen.getAllByLabelText(/NAME:/i)[0].nextElementSibling as HTMLInputElement;
    const passwordInput = screen.getAllByLabelText(/Password:/i)[0].nextElementSibling as HTMLInputElement;
    
    // Type in name but leave password empty
    fireEvent.change(nameInput, { target: { value: 'TestPlayer' } });
    fireEvent.change(passwordInput, { target: { value: '' } });
    
    // Check for warning
    await waitFor(() => {
      expect(screen.getByText('Please fill the blank')).toBeInTheDocument();
    });
  });

  it('shows warning when passwords do not match', async () => {
    render(<SaveScene onNewGame={() => {}} onLoadGame={() => {}} />);
    
    // Get the first slot's inputs
    const nameInput = screen.getAllByLabelText(/NAME:/i)[0].nextElementSibling as HTMLInputElement;
    const passwordInput = screen.getAllByLabelText(/Password:/i)[0].nextElementSibling as HTMLInputElement;
    const confirmInput = screen.getAllByLabelText(/Confirm:/i)[0].nextElementSibling as HTMLInputElement;
    
    // Type in different passwords
    fireEvent.change(nameInput, { target: { value: 'TestPlayer' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmInput, { target: { value: 'password456' } });
    
    // Check for warning
    await waitFor(() => {
      expect(screen.getByText('Password is not same')).toBeInTheDocument();
    });
  });

  it('shows NEW button when all fields are valid', async () => {
    render(<SaveScene onNewGame={() => {}} onLoadGame={() => {}} />);
    
    // Get the first slot's inputs
    const nameInput = screen.getAllByLabelText(/NAME:/i)[0].nextElementSibling as HTMLInputElement;
    const passwordInput = screen.getAllByLabelText(/Password:/i)[0].nextElementSibling as HTMLInputElement;
    const confirmInput = screen.getAllByLabelText(/Confirm:/i)[0].nextElementSibling as HTMLInputElement;
    
    // Fill in valid data
    fireEvent.change(nameInput, { target: { value: 'TestPlayer' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmInput, { target: { value: 'password123' } });
    
    // Check for OK message and NEW button
    await waitFor(() => {
      expect(screen.getByText('OK')).toBeInTheDocument();
      expect(screen.getByTestId('flicker-button-NEW')).toBeInTheDocument();
    });
  });

  it('calls onNewGame when NEW button is clicked', async () => {
    const handleNewGame = vi.fn();
    render(<SaveScene onNewGame={handleNewGame} onLoadGame={() => {}} />);
    
    // Get the first slot's inputs
    const nameInput = screen.getAllByLabelText(/NAME:/i)[0].nextElementSibling as HTMLInputElement;
    const passwordInput = screen.getAllByLabelText(/Password:/i)[0].nextElementSibling as HTMLInputElement;
    const confirmInput = screen.getAllByLabelText(/Confirm:/i)[0].nextElementSibling as HTMLInputElement;
    
    // Fill in valid data
    fireEvent.change(nameInput, { target: { value: 'TestPlayer' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmInput, { target: { value: 'password123' } });
    
    // Wait for NEW button to appear and click it
    await waitFor(() => {
      const newButton = screen.getByTestId('flicker-button-NEW');
      fireEvent.click(newButton);
    });
    
    expect(handleNewGame).toHaveBeenCalledTimes(1);
  });

  it('renders a filled slot when save data exists', async () => {
    // Setup mock save data
    const mockSaveData = JSON.stringify({
      player: { name: 'SavedPlayer' },
      time: '2023-01-01 12:00:00'
    });
    localStorageMock.getItem.mockReturnValueOnce(mockSaveData);
    
    render(<SaveScene onNewGame={() => {}} onLoadGame={() => {}} />);
    
    // Check for saved player name and time
    expect(screen.getByText('SavedPlayer')).toBeInTheDocument();
    expect(screen.getByText('Saved: 2023-01-01 12:00:00')).toBeInTheDocument();
    
    // Check for LOAD button
    expect(screen.getByTestId('flicker-button-LOAD')).toBeInTheDocument();
  });

  it('calls onLoadGame when LOAD button is clicked', async () => {
    // Setup mock save data
    const mockSaveData = JSON.stringify({
      player: { name: 'SavedPlayer' },
      time: '2023-01-01 12:00:00'
    });
    localStorageMock.getItem.mockReturnValueOnce(mockSaveData);
    
    const handleLoadGame = vi.fn();
    render(<SaveScene onNewGame={() => {}} onLoadGame={handleLoadGame} />);
    
    // Click LOAD button
    fireEvent.click(screen.getByTestId('flicker-button-LOAD'));
    
    expect(handleLoadGame).toHaveBeenCalledTimes(1);
  });

  it('deletes save data when DELETE button is clicked', async () => {
    // Setup mock save data
    const mockSaveData = JSON.stringify({
      player: { name: 'SavedPlayer' },
      time: '2023-01-01 12:00:00'
    });
    localStorageMock.getItem.mockReturnValueOnce(mockSaveData);
    
    render(<SaveScene onNewGame={() => {}} onLoadGame={() => {}} />);
    
    // Find and click DELETE button
    const deleteButton = screen.getByText('DELETE');
    fireEvent.click(deleteButton);
    
    // Confirm should be called and removeItem should be called with the correct key
    expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to delete this save?');
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('slot1');
  });
});