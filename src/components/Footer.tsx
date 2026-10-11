import { REPO, SITE_REPO } from "../lib/data";

export function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer-row">
        <div>
          <span className="wordmark">DEs-UI</span>
          <p>A sci-fi terminal desktop for Linux. MIT licensed.</p>
        </div>
        <p>
          It began as a rewrite of <a href="https://github.com/GitSquared/edex-ui">eDEX-UI</a>. The compositor is
          derived from <a href="https://github.com/Smithay/smithay">Smithay</a>'s smallvil example. The typefaces
          are Chakra Petch and JetBrains Mono, under the SIL Open Font License.
        </p>
        <nav aria-label="Project links">
          <a href={REPO}>Source</a>
          <a href={`${REPO}/issues`}>Issues</a>
          <a href={`${REPO}#readme`}>README</a>
          <a href={SITE_REPO}>This site</a>
        </nav>
      </div>
    </footer>
  );
}
