/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useRef, useState } from 'react';
import '../styles/Projects.css';
import ProjectCard from '../components/ProjectCard';
import type { GitHubRepo, LanguageMap } from '../types/types';

import fallbackRepos from '../data/fallback-repos.json';

const ProjectsPage = () => {
    const [repos, setRepos] = useState<GitHubRepo[]>([]);
    const [displayRepos, setDisplayRepos] = useState<GitHubRepo[]>([]);
    const [loading, setLoading] = useState(true);
    
    // The visual list of unique languages (e.g., ["JavaScript", "Python", "React"])
    const [displayLanguages, setDisplayLanguages] = useState<string[]>([]);
    const languagesRef = useRef(new Set<string>());

    // NEW: The object mapping each language to its respective projects
    const [languageMap, setLanguageMap] = useState<LanguageMap>({});

    // Updated to accept BOTH the project object and its languages
    const handleLanguageFound = useCallback((project: GitHubRepo, langs: string[]) => {
        // 1. Update the unique list of languages
        let changed = false;
        langs.forEach(lang => {
            if (!languagesRef.current.has(lang)) {
                languagesRef.current.add(lang);
                changed = true;
            }
        });

        if (changed) {
            setDisplayLanguages(Array.from(languagesRef.current).sort());
        }

        // 2. Map the project to each of its languages
        setLanguageMap(prevMap => {
            const newMap = { ...prevMap };
            
            langs.forEach(lang => {
                // If this language doesn't exist in the map yet, create an empty array for it
                if (!newMap[lang]) {
                    newMap[lang] = [];
                }
                
                // Add the project to this language's array (preventing duplicates)
                if (!newMap[lang].some(r => r.id === project.id)) {
                    newMap[lang] = [...newMap[lang], project];
                }
            });
            
            return newMap;
        });
    }, []);

    useEffect(() => {
        const cachedRepos = sessionStorage.getItem("Repos");

        if (cachedRepos) {
            const fetchedRepos = JSON.parse(cachedRepos);
            setRepos(fetchedRepos);
            setDisplayRepos(fetchedRepos);
            setLoading(false);
        } else {
            fetch('https://api.github.com/users/Dv1de29/repos?sort=updated')
                .then(response => response.json())
                .then(data => {
                    if (Array.isArray(data)) {
                        const myRepos = data.filter((repo: any) => !repo.fork);
                        setRepos(myRepos);
                        setDisplayRepos(myRepos);
                        sessionStorage.setItem("Repos", JSON.stringify(myRepos));
                    } else {
                        // 2. GitHub sent an error (Rate Limit Exceeded)
                        console.warn("GitHub API limit reached. Using fallback data.");
                        setRepos(fallbackRepos);
                        setDisplayRepos(fallbackRepos);
                    }
                    setLoading(false);
                })
                .catch(err => {
                    // 3. Network error (User is offline, etc.)
                    console.error("Network error fetching repos. Using fallback.", err);
                    setRepos(fallbackRepos);
                    setDisplayRepos(fallbackRepos);
                    setLoading(false);
                });
            }
    }, []);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        // 1. Convert to lowercase and remove extra spaces for accurate matching
        const searchTerm = e.target.value.toLowerCase().trim();

        // 2. If the search bar is cleared, show all repos again
        if (!searchTerm) {
            setDisplayRepos(repos);
            return;
        }

        // 3. Find any languages in our map that match the search term
        // (e.g., typing "re" will match "React" and "Reason")
        const matchingLanguages = Object.keys(languageMap).filter(lang => 
            lang.toLowerCase().includes(searchTerm)
        );

        // 4. Collect the IDs of all projects that use those matching languages
        const matchedLanguageRepoIds = new Set<number>();
        matchingLanguages.forEach(lang => {
            languageMap[lang].forEach(repo => matchedLanguageRepoIds.add(repo.id));
        });

        // 5. Filter the master 'repos' list
        const filteredRepos = repos.filter(repo => {
            // Check if the title matches
            // (Replacing dashes with spaces so typing "my project" matches "my-project")
            const matchesName = repo.name.replace(/-/g, ' ').toLowerCase().includes(searchTerm);
            
            // Check if the description matches
            const matchesDescription = repo.description?.toLowerCase().includes(searchTerm);

            // Check if it's in our Set of language matches
            const matchesLanguage = matchedLanguageRepoIds.has(repo.id);

            // If ANY of these are true, keep the project in the display list
            return matchesName || matchesDescription || matchesLanguage;
        });

        // 6. Update the screen with the filtered results
        setDisplayRepos(filteredRepos);
    };

    return (
        <div className="projects-container">
            <h1 className="projects-title">My Projects</h1>
            
            {/* New Search Bar mimicking the design */}
            <div className="search-wrapper">
                <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                <input 
                    type="text" 
                    className="search-input" 
                    placeholder="Search projects by title, description, or tags..."
                    onChange={handleSearch}
                />
            </div>
            
            {loading ? (
                <div className="loader">Loading Repositories...</div>
            ) : (
                <>
                    {/* Optional: You can hide this if you only want the search bar, or keep it as extra filters */}
                    <div className="languages-filter-bar" style={{ display: 'none' }}>
                        {displayLanguages.map(lang => (
                            <span key={lang} className="filter-badge">{lang}</span>
                        ))}
                    </div>

                    <div className="projects-grid">
                        {displayRepos.map((repo) => (
                            <ProjectCard 
                                key={repo.id} 
                                project={repo} 
                                onLanguageFound={handleLanguageFound} // Pass the updated function
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default ProjectsPage;