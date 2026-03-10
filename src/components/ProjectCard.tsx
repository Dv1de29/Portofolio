/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import type { GitHubRepo } from '../types/types'; // Adjust import path

import fallbackLanguages from '../data/fallback-languages.json';

interface ProjectCardProps {
    project: GitHubRepo;
    onLanguageFound: (project: GitHubRepo, langs: string[]) => void;
}

function ProjectCard({ project, onLanguageFound }: ProjectCardProps) {
  const [topLanguages, setTopLanguages] = useState<string[]>([]);

  useEffect(() => {
    const cacheKey = `langs-${project.id}`;
    const cachedData = sessionStorage.getItem(cacheKey);

    if (cachedData) {
      const parsedData = JSON.parse(cachedData);
      processLanguages(parsedData);
    } else {
      fetch(project.languages_url)
        .then(res => res.json())
        .then(data => {
          if (data.message) throw new Error(data.message);
          
          sessionStorage.setItem(cacheKey, JSON.stringify(data));
          processLanguages(data);
        })
        .catch(err => {
          console.warn(`API limit or error for ${project.name} languages. Using fallback.`, err.message);
          
          const fallbackData = (fallbackLanguages as any)[project.id];
          
          if (fallbackData) {
              processLanguages(fallbackData);
          } else {
              processLanguages({});
          }
        });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function processLanguages(data: any) {
      const langs = Object.keys(data);
      
      onLanguageFound(project, langs);

      const sortedLangs = Object.entries(data)
        .sort((a: any, b: any) => b[1] - a[1]) 
        .slice(0, 3)
        .map(lang => lang[0]);

      setTopLanguages(sortedLangs);
    }
  }, [project, onLanguageFound]);

  return (
    <div className="project-card cursor-target">
      <div className="project-main-content">
        <h3 className="project-title">{project.name.replace(/-/g, ' ')}</h3>
        <p className="project-desc">
          {project.description || "A deep dive into software engineering and clean code architecture."}
        </p>
      </div>

      <div className="project-bottom">
        <div className="languages-badges">
          {topLanguages.map((lang, index) => (
            <span key={index} className="lang-badge">
              {lang}
            </span>
          ))}
        </div>

        <div className="project-links-bottom">
          {/* External Demo Link (Only shows if repo has a homepage URL) */}
          {project.homepage && (
            <a href={project.homepage} target="_blank" rel="noreferrer" className="link-demo">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
              Demo
            </a>
          )}
          
          {/* GitHub Code Link */}
          <a href={project.html_url} target="_blank" rel="noreferrer" className="link-code">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
            Code
          </a>
        </div>
      </div>
    </div>
  );
}

export default ProjectCard;