export interface Schiff {
  id: number;
  name: string;
  type: string;
  capacity: number;
  preisProNacht: number;
  inhalt: string;
  bildUrls: string[];
  hafenId: number;
  hafenName: string;
}