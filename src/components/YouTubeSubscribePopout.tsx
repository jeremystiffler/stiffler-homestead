import { SITE_CONFIG } from "@/lib/config";

export default function YouTubeSubscribePopout() {
  return (
    <aside className="youtube-popout" aria-label="Subscribe to Stiffler Homestead on YouTube">
      <a
        href={SITE_CONFIG.youtubeSubscribeUrl}
        target="_blank"
        rel="noreferrer"
        className="youtube-popout-link"
      >
        <span className="youtube-popout-tab" aria-hidden="true">
          ▶
        </span>
        <span className="youtube-popout-panel">
          <span className="youtube-popout-kicker">Follow the homestead</span>
          <span className="youtube-popout-title">Subscribe on YouTube</span>
          <span className="youtube-popout-copy">Builds, animals, food sales, and family homesteading updates.</span>
        </span>
      </a>
    </aside>
  );
}
