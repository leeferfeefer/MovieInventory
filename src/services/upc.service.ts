// API for looking up movie info by UPC

// https://api.upcitemdb.com/prod/trial/lookup?upc=683904632197

export async function getMovieInfo(upc: string): Promise<UpcDBResponse | undefined> {
  try {
    const response = await fetch(`http://localhost:3000/api/movie_info?upc=${upc}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching movie info:', error);
    throw error;
  }
}
