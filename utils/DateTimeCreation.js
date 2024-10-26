import { format } from 'date-fns'
export const CreateCurrentFullDate = () => {
    const currentDate = new Date();
    const formattedDate = format(currentDate, 'yyyy-MM-dd HH:mm');
  
    return formattedDate
}