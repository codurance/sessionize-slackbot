import DateTime from "../Models/DateTime";

export function formatISODate(isoDate: DateTime) : string {

    let formattedNumber = (number: number) : string => {
        if(number < 10) return "0" + number;
        return number.toString();
    }

    const date = new Date(isoDate.value);
    const year = date.getUTCFullYear();
    const month = formattedNumber(date.getUTCMonth() + 1);
    const day = formattedNumber(date.getUTCDate());

    const hour = formattedNumber(date.getUTCHours());
    const minutes = formattedNumber(date.getUTCMinutes());

    return `${day}/${month}/${year} ${hour}:${minutes}`;
}