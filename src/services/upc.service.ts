// API for looking up movie info by UPC

// https://api.upcitemdb.com/prod/trial/lookup?upc=683904632197

export async function getMovieInfo(
  upc: string
): Promise<UpcDBResponse | undefined> {
  let data: UpcDBResponse | undefined;
  try {
    const response = await fetch(
      `https://api.upcitemdb.com/prod/trial/lookup?upc=${upc}`
    );
    data = await response.json();
  } catch (error) {
    console.error("Error fetching movie info:", error);
  }
  return data;
}
