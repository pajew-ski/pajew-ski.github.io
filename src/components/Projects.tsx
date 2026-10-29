import { m } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { anchorLinkClass, enContent, slugify } from '../anchors';
import { reveal, viewportOnce } from '../motion';

interface ProjectData {
  id: string;
  kind: string;
  title: string;
  desc: string;
  note?: string;
  href: string;
  linkLabel: string;
}

// The destination link is louder than the quiet heading self-links: it is the
// one thing on the card that leads somewhere else, and the site's depth hangs
// on it being taken.
const projectLinkClass =
  'mt-auto text-type-sm font-light text-muted-foreground underline decoration-1 underline-offset-[0.25em] decoration-border hover:text-foreground hover:decoration-muted-foreground focus-visible:text-foreground transition-colors duration-300';

export function Projects() {
  const { t } = useTranslation();

  const items = t('projects.items', { returnObjects: true }) as ProjectData[];

  return (
    <section
      id="projects"
      className="py-[max(16vmin,128px)] px-step-4 md:px-step-5 max-w-shell mx-auto"
      aria-labelledby="projects-heading"
    >
      <div className="mb-step-6 space-y-step-5">
        <m.h2
          id="projects-heading"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={viewportOnce}
          transition={reveal()}
          className="text-type-2 md:text-type-3 font-bold tracking-tighter"
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
          className="text-type-1 text-muted-foreground max-w-text font-light"
        >
          {t('projects.copy')}
        </m.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-step-5">
        {items.map((project, index) => (
          <m.article
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={reveal(index * 0.07)}
            className="flex flex-col gap-step-5 border border-border p-step-5"
          >
            {/* header, not div: Readability deletes small link-and-text divs */}
            <header className="space-y-step-3">
              <p className="text-type-sm uppercase tracking-[0.3em] text-muted-foreground font-light">
                {project.kind}
              </p>
              <h3
                id={slugify(enContent.projects.items[index].title)}
                className="text-type-1 font-semibold tracking-tight"
              >
                <a
                  href={`#${slugify(enContent.projects.items[index].title)}`}
                  className={anchorLinkClass}
                >
                  {project.title}
                </a>
              </h3>
            </header>
            <p className="text-muted-foreground font-light">{project.desc}</p>
            {project.note && (
              <p className="text-type-sm text-muted-foreground font-light">{project.note}</p>
            )}
            <a href={project.href} className={projectLinkClass}>
              {project.linkLabel}
            </a>
          </m.article>
        ))}
      </div>
    </section>
  );
}
