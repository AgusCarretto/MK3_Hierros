import WorkImage from './workImage.ts'

export interface Work {
  id: string;
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