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
    | "academic"
    | "article"
    | "work_experience"
    | "award"
    | "etc";
  content: string;
  edge: { id: number; content: string }[];
}
