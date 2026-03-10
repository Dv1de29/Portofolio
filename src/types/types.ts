export interface GitHubRepo {
    id: number;
    name: string;
    description: string | null;
    html_url: string;
    homepage: string | null;
    languages_url: string;
    fork: boolean;
}

// This is the type for your new mapping object
export type LanguageMap = Record<string, GitHubRepo[]>;