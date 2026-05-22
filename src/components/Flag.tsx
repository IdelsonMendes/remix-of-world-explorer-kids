/**
 * Robust country flag renderer.
 *
 * We previously relied on the `fi fi-XX` background-image classes from the
 * `flag-icons` package. On some desktop browsers/build environments the CSS
 * background was not painting and the underlying ISO code (e.g. "br", "eu")
 * was visible. We render an explicit <img> from a public CDN as the primary
 * source and keep the `fi` class as a CSS background fallback layered behind.
 */
type Props = {
  iso: string;
  name: string;
  className?: string;
  /** Rendered as a square block by default. */
  rounded?: string;
};

export function Flag({ iso, name, className = "", rounded = "" }: Props) {
  const code = iso.toLowerCase();
  return (
    <span
      className={`absolute inset-0 block overflow-hidden ${rounded} ${className}`}
      aria-label={`Bandeira de ${name}`}
    >
      {/* CSS fallback layer (covers if the network image is slow) */}
      <span
        aria-hidden
        className={`fi fi-${code}`}
        style={{
          position: "absolute",
          inset: 0,
          display: "block",
          width: "100%",
          height: "100%",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      {/* Primary <img> from flagcdn — guaranteed to render on every browser. */}
      <img
        src={`https://flagcdn.com/w320/${code}.png`}
        srcSet={`https://flagcdn.com/w160/${code}.png 1x, https://flagcdn.com/w320/${code}.png 2x`}
        alt=""
        loading="lazy"
        decoding="async"
        className="absolute inset-0 w-full h-full object-cover"
        onError={(e) => {
          // If the CDN fails, hide the broken image and rely on the CSS layer.
          (e.currentTarget as HTMLImageElement).style.display = "none";
        }}
      />
    </span>
  );
}
