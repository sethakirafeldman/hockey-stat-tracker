import dayjs from 'dayjs'

export const getCurrentDate = () => {
    let now = dayjs();
    let date = dayjs(now).format('YYYY-MM-DD');
    return date;
}

