import { useEffect } from "react";

const setMeta = (attr: "name" | "property", key: string, content: string) => {
  let tag = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attr, key);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
};

interface SeoProps {
  title: string;
  description: string;
  /** Optional page-specific structured data (e.g. FAQPage). Rendered as JSON-LD.
   *  Note: since this runs client-side, it's visible to Google/Bing (which render JS)
   *  but not to crawlers that only fetch raw HTML — see docs/STATUS.md. */
  jsonLd?: Record<string, unknown>;
}

const JSON_LD_ID = "page-json-ld";

const Seo = ({ title, description, jsonLd }: SeoProps) => {
  useEffect(() => {
    document.title = title;
    setMeta("name", "description", description);
    setMeta("property", "og:title", title);
    setMeta("property", "og:description", description);
    setMeta("property", "og:type", "website");
    setMeta("name", "twitter:card", "summary_large_image");

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = window.location.origin + window.location.pathname;

    const existing = document.getElementById(JSON_LD_ID);
    if (existing) existing.remove();
    if (jsonLd) {
      const script = document.createElement("script");
      script.id = JSON_LD_ID;
      script.type = "application/ld+json";
      script.textContent = JSON.stringify(jsonLd);
      document.head.appendChild(script);
    }

    return () => {
      document.getElementById(JSON_LD_ID)?.remove();
    };
  }, [title, description, jsonLd]);

  return null;
};

export default Seo;
