import type { ImageMetadata } from 'astro';
import g1 from '../assets/gallery/gallery-1.jpg';
import g2 from '../assets/gallery/gallery-2.jpg';
import g3 from '../assets/gallery/gallery-3.jpg';
import g4 from '../assets/gallery/gallery-4.jpg';
import g5 from '../assets/gallery/gallery-5.jpg';
import g6 from '../assets/gallery/gallery-6.jpg';
import g7 from '../assets/gallery/gallery-7.jpg';
import g8 from '../assets/gallery/gallery-8.jpg';

export interface Photo {
  src: ImageMetadata;
  alt: string;
  caption: string;
  shape: 'portrait' | 'landscape' | 'square';
  position: string;
}

export const photos: Photo[] = [
  { src: g2, alt: 'Double bedroom with a window looking out over the sea', caption: 'Comfortable rooms, many with views over the Irish Sea', shape: 'portrait', position: '50% 58%' },
  { src: g6, alt: 'Guest lounge with sofas, warm lighting and a patterned rug', caption: 'The guest lounge — a calm spot to unwind in the evening', shape: 'landscape', position: '50% 55%' },
  { src: g5, alt: 'Coffee bar with stools, hanging plants and warm lighting', caption: 'Our coffee bar, open through the day', shape: 'portrait', position: '50% 54%' },
  { src: g3, alt: "Children's play corner with a toy kitchen and game zone sign", caption: 'A play corner the little ones never want to leave', shape: 'square', position: '50% 55%' },
  { src: g4, alt: "Little Town toy coffee cart in the children's play area", caption: 'Little touches for our youngest guests', shape: 'portrait', position: '50% 56%' },
  { src: g1, alt: 'Hallway and staircase with the seafront visible through the front door', caption: 'The sea, right through the front door', shape: 'portrait', position: '50% 50%' },
  { src: g7, alt: 'Warmly lit hallway with stairs and breakfast pastries on the side', caption: 'Warm hallways and homely corners throughout', shape: 'portrait', position: '50% 54%' },
  { src: g8, alt: 'Sunset over a calm sea at Blackpool', caption: 'Blackpool sunsets, moments from the doorstep', shape: 'landscape', position: '50% 50%' },
];
