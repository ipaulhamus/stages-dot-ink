//Converts a time string from the API to a readable format
//ex: 2026-01-17T00:00:00Z -> 12:00 AM (no date, just time)
export function convertTimeString(timeString) {
    const date = new Date(timeString);

    const options = {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
    }

    return date.toLocaleString('en-US', options);
}