export function formatISODate(isoDate: string) : string {

    let formattedNumber = (number: number) : string => {
        if(number < 10) return "0" + number;
        return number.toString();
    }

    const date = new Date(isoDate);
    const year = date.getUTCFullYear();
    const month = formattedNumber(date.getUTCMonth() + 1);
    const day = formattedNumber(date.getUTCDate());

    const hour = formattedNumber(date.getUTCHours());
    const minutes = formattedNumber(date.getUTCMinutes());

    return `${day}/${month}/${year} ${hour}:${minutes}`;
}