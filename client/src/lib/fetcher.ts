export class FetchError extends Error {
  info: any;
  status: number;
  constructor(message: string, info: any, status: number) {
    super(message);
    this.info = info;
    this.status = status;
  }
}

// Fetcher function for SWR that includes credentials and handles non-200 responses
export const fetcher = async (url: string) => {
  try {
    const res = await fetch(url, {
      credentials: "include",
      headers: {
        "Accept": "application/json",
        "Cache-Control": "no-cache"
      }
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ error: "Unknown error occurred" }));
      const error = new FetchError(
        `An error occurred while fetching the data.`,
        errorData,
        res.status,
      );
      throw error;
    }

    const data = await res.json();
    return data;
  } catch (error) {
    if (error instanceof FetchError) {
      throw error;
    }
    
    // Handle network errors or other unexpected errors
    throw new FetchError(
      "Failed to fetch data",
      { error: error instanceof Error ? error.message : "Unknown error" },
      500
    );
  }
};
