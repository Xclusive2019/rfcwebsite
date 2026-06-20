import { useEffect } from "react";

export function useScrollReveal(threshold = 0.1, deps: unknown[] = []) {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold, rootMargin: "0px 0px -40px 0px" }
    );

    const elements = document.querySelectorAll(".reveal");
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
    // Re-scan when `deps` change so async-loaded `.reveal` elements get observed.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [threshold, ...deps]);
}
