<<<<<<< Updated upstream
import Status from '../assets/constants/status';
import Priority from '../assets/constants/priority';
=======
import WorkImage from './workImage.ts'
>>>>>>> Stashed changes

export interface Work {
  id: number;
  title: string;
  description: string;
  images: WorkImage[];
  measures: string;
  category: string;
  priority: string;
  status: string;
  endDate: Time;
  createAt: Time;
  price: int;
  finalPrice: int
}