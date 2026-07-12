"use client";

import { track } from "@vercel/analytics";
import { useEffect } from "react";

const AFFILIATE_HOSTS = [
  "amazon.com",
  "www.amazon.com",
  "amzn.to",
  "wisephone.com",
  "covenanteyes.sjv.io",
];

function isAffiliateLink(url: URL) {
  return AFFILIATE_HOSTS.some((host) => url.hostname === host || url.hostname.endsWith(`.${host}`));
}

export default function OutboundClickTracker() {
  useEffect(() => {
    function handleClick(event: MouseEvent) {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const anchor = target.closest<HTMLAnchorElement>("a[href]");
      if (!anchor) return;

      let url: URL;
      try {
        url = new URL(anchor.href);
      } catch {
        return;
      }

      if (!isAffiliateLink(url)) return;

      track("affiliate_click", {
        host: url.hostname,
        path: window.location.pathname,
        linkText: (anchor.textContent || "").trim().slice(0, 80),
      });
    }

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, []);

  return null;
}
