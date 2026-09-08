import { m } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { anchorLinkClass, enContent, slugify } from '../anchors';
import { reveal, viewportOnce } from '../motion';

interface ProjectData {
  id: string;
  kind: string;
  title: string;
  desc: string;
  href: string;
  linkLabel: string;
}

// The destination link is louder than the quiet heading self-links: it is the
// one thing on the card that leads somewhere else, and the site's depth hangs
// on it being taken.
const projectLinkClass =
  'mt-auto text-sm font-light text-muted-foreground underline decoration-1 underline-offset-[0.25em] decoration-foreground/20 hover:text-foreground hover:decoration-foreground/40 focus-visible:text-foreground transition-colors duration-300';

export function Projects() {
  const { t } = useTranslation();

  const items = t('projects.items', { returnObjects: true }) as ProjectData[];

  return (
    <section
      id="projects"
      className="py-[max(14.6vmin,6.854rem)] px-phi-sm md:px-phi-xl max-w-7xl mx-auto"
      aria-labelledby="projects-heading"
    >
      <div className="mb-phi-5xl space-y-phi-lg">
        <m.h2
          id="projects-heading"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={viewportOnce}
          transition={reveal()}
          className="text-4xl md:text-6xl font-bold tracking-tighter"
        >
          <a href="#projects" className={anchorLinkClass}>
            {t('projects.h2')}
          </a>
        </m.h2>
        <m.p
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={viewportOnce}
          transition={reveal(0.1)}
          className="text-xl md:text-2xl text-muted-foreground max-w-3xl font-light"
        >
          {t('projects.copy')}
        </m.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-phi-xl">
        {items.map((project, index) => (
          <m.article
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={reveal(index * 0.07)}
            className="flex flex-col gap-phi-lg border border-foreground/10 p-phi-xl md:p-phi-2xl"
          >
            {/* header, not div: Readability deletes small link-and-text divs */}
            <header className="space-y-phi-2xs">
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground font-light">
                {project.kind}
              </p>
              <h3
                id={slugify(enContent.projects.items[index].title)}
                className="text-2xl font-semibold tracking-tight"
              >
                <a
                  href={`#${slugify(enContent.projects.items[index].title)}`}
                  className={anchorLinkClass}
                >
                  {project.title}
                </a>
              </h3>
            </header>
            <p className="text-foreground/75 font-light">{project.desc}</p>
            <a href={project.href} className={projectLinkClass}>
              {project.linkLabel}
            </a>
          </m.article>
        ))}
      </div>
    </section>
  );
}
