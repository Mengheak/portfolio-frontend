export interface Project {
  id: string;
  title: string;
  description: string;
  body: string;
  technologies: string[];
  imageUrl: string;
  liveUrl: string;
  repoUrl: string;
  featured: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}
