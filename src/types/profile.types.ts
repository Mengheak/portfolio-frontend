export interface Profile {
  name: string;
  title: string;
  bio: string;
  avatarUrl: string;
  resumeUrl: string;
  contactEmail: string;
  socialLinks: {
    github: string;
    linkedin: string;
    facebook: string;
    telegram: string;
    phone: string;
    website: string;
  };
}
