interface WaybackResponse {
  archived_snapshots?: {
    closest?: {
      available: boolean;
      url: string;
      timestamp: string;
      status: string;
    }
  }
}

export interface Domain {
  name: string;
}

/**
 * Fetches a random domain from the domains.json file
 */
export async function getRandomDomain(): Promise<string> {
  try {
    const response = await fetch('/domains.json');
    const domains: Domain[] = await response.json();
    const randomIndex = Math.floor(Math.random() * domains.length);
    return domains[randomIndex].name;
  } catch (error) {
    console.error('Error fetching random domain:', error);
    // Fallback domains in case the file can't be loaded
    const fallbackDomains = [
      'yahoo.com', 'aol.com', 'geocities.com', 'angelfire.com', 
      'myspace.com', 'altavista.com', 'netscape.com', 'lycos.com'
    ];
    const randomIndex = Math.floor(Math.random() * fallbackDomains.length);
    return fallbackDomains[randomIndex];
  }
}

/**
 * Generates a random date between 1996 and 2015
 */
export function getRandomDate(startYear = 1996, endYear = 2015): string {
  const year = Math.floor(Math.random() * (endYear - startYear + 1)) + startYear;
  const month = Math.floor(Math.random() * 12) + 1;
  const day = Math.floor(Math.random() * 28) + 1; // Using 28 to avoid invalid dates
  
  // Format as YYYYMMDD
  return `${year}${month.toString().padStart(2, '0')}${day.toString().padStart(2, '0')}`;
}

/**
 * Formats a timestamp from YYYYMMDD format to a readable date
 */
export function formatDate(timestamp: string): string {
  const year = timestamp.substring(0, 4);
  const month = timestamp.substring(4, 6);
  const day = timestamp.substring(6, 8);
  
  const date = new Date(`${year}-${month}-${day}`);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
}

/**
 * Checks if a snapshot is available for a given domain and timestamp
 */
export async function checkWaybackAvailability(domain: string, timestamp: string): Promise<WaybackResponse | null> {
  try {
    const url = `https://archive.org/wayback/available?url=${domain}&timestamp=${timestamp}`;
    const response = await fetch(url);
    return await response.json();
  } catch (error) {
    console.error('Error checking Wayback Machine availability:', error);
    return null;
  }
}

/**
 * Creates a proper Wayback Machine URL that works in iframes
 */
export function createWaybackUrl(url: string, timestamp: string): string {
  // Remove any existing web.archive.org prefix if present
  const cleanUrl = url.replace(/^(?:https?:\/\/)?(?:web\.archive\.org\/web\/[^\/]+\/)?(.+)$/, '$1');
  
  // Ensure the URL has a protocol
  const urlWithProtocol = cleanUrl.startsWith('http') ? cleanUrl : `http://${cleanUrl}`;
  
  // Create the final archive URL
  return `https://web.archive.org/web/${timestamp}/${urlWithProtocol}`;
}

/**
 * Finds an available snapshot for a random domain and date
 * Will retry up to maxAttempts times
 */
export async function findAvailableSnapshot(
  maxAttempts = 10, 
  startYear = 1996, 
  endYear = 2015
): Promise<{ domain: string; timestamp: string; archiveUrl: string } | null> {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const domain = await getRandomDomain();
    const timestamp = getRandomDate(startYear, endYear);
    
    const data = await checkWaybackAvailability(domain, timestamp);
    
    if (data?.archived_snapshots?.closest?.available) {
      const snapshotTimestamp = data.archived_snapshots.closest.timestamp;
      
      // Create a clean, properly formatted archive URL
      const archiveUrl = createWaybackUrl(domain, snapshotTimestamp);
      
      return { 
        domain, 
        timestamp: snapshotTimestamp, 
        archiveUrl 
      };
    }
  }
  
  return null;
}