export interface LinkType {
  github: string;
  website: string;
}

export interface ContentType {
  id: number;
  date: string;
  title: string;
  links: LinkType;
  dataType: "markdown" | "xml" | "json";
  category:
    | "project"
    | "company"
    | "team"
    | "academic"
    | "article"
    | "work_experience"
    | "award"
    | "etc";
  content: string;
  edge: { id: number; content: string }[];
}

export interface DiaryType {
  slug: string; // file name without .json
  date: string;
  title: string;
  content: string;
}
