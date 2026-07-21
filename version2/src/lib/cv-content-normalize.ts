// gpt-4o-mini's JSON mode doesn't reliably honor a `"content": "..."` hint
// in a prompt — when the underlying facts have obvious structure (several
// jobs, several qualifications), it sometimes nests them as objects/arrays
// instead of a flat string, even though every prompt that produces CV
// sections explicitly asks for a string. That crashed rendering outright:
// escapeHtml() calls `.replace()` on the value, which doesn't exist on an
// array or object. Confirmed via direct testing (not just a code read) —
// the same background text produced a plain string on one AI call and a
// nested array on the next, so this is a real, intermittent failure mode,
// not a hypothetical. Every place that accepts AI-produced section content
// must run it through this before it reaches a template or the DB.
export function normalizeSectionContent(content: unknown): string {
  if (typeof content === "string") return content;

  if (Array.isArray(content)) {
    return content.map(normalizeEntry).filter(Boolean).join("\n\n");
  }

  if (content && typeof content === "object") {
    return normalizeEntry(content);
  }

  return content == null ? "" : String(content);
}

function normalizeEntry(item: unknown): string {
  if (typeof item === "string") return item;
  if (item == null) return "";
  if (typeof item !== "object") return String(item);

  const obj = item as Record<string, unknown>;
  const firstString = (...keys: string[]) => {
    for (const k of keys) {
      const v = obj[k];
      if (typeof v === "string" && v.trim()) return v;
    }
    return undefined;
  };

  const lines: string[] = [];

  const heading = firstString("job_title", "role", "title", "qualification", "position");
  const org = firstString("employer", "company", "institution", "school", "organisation", "organization");
  const dates = firstString("duration", "dates", "date", "period", "year", "years");

  const headingLine = [heading, org].filter(Boolean).join(", ");
  if (headingLine) {
    lines.push(dates ? `${headingLine} (${dates})` : headingLine);
  }

  const bulletSource =
    obj.responsibilities ?? obj.bullets ?? obj.details ?? obj.description ?? obj.achievements;

  if (Array.isArray(bulletSource)) {
    for (const b of bulletSource) {
      if (typeof b === "string" && b.trim()) lines.push(b);
    }
  } else if (typeof bulletSource === "string" && bulletSource.trim()) {
    lines.push(bulletSource);
  }

  if (lines.length === 0) {
    // Unknown shape — flatten whatever string/array values exist rather
    // than losing real, fact-derived content to a dropped section.
    for (const v of Object.values(obj)) {
      if (typeof v === "string" && v.trim()) {
        lines.push(v);
      } else if (Array.isArray(v)) {
        const flat = v.filter((x) => typeof x === "string").join(", ");
        if (flat) lines.push(flat);
      }
    }
  }

  return lines.join("\n");
}

export function normalizeSections<T extends { content: unknown }>(
  sections: T[]
): (Omit<T, "content"> & { content: string })[] {
  return sections.map((s) => ({ ...s, content: normalizeSectionContent(s.content) }));
}
