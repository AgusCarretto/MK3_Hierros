import Status from '../assets/constants/status';
import Priority from '../assets/constants/priority';

export interface Work {
  id: number;
  title: string;
  description: string;
  image: string;
  measures: string;
  category: string;
  priority: string;
  status: string;
  endDate: Time;
  createAt: Time;
  price: int;
  finalPrice: int
}