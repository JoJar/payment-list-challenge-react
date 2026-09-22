export const formatDateTime = (dateTimeString: string): string => {
    const date = new Date(dateTimeString);
    const timeString = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
    const dateString = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
    return dateString + ' ' + timeString;
}