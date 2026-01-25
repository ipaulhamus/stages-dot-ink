export function convertTimeString(timeString) {
    const date = new Date(timeString);

    const options = {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
    }

    //"to locale string" converts to local time zone automatically
    return date.toLocaleString('en-US', options);
}