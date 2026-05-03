import Image from "next/image";

type Tone = "light" | "dark";

export default function BrandLockup({
  tone = "light",
  size = "sm",
  showTagline = false,
}: {
  tone?: Tone;
  size?: "sm" | "md" | "lg";
  showTagline?: boolean;
}) {
  const emblem = "/brand/emblem-bh.svg";
  const wordColor = tone === "dark" ? "text-bh-white" : "text-bh-black";
  const endorseColor = tone === "dark" ? "text-bh-white/60" : "text-bh-graphite";
  const taglineColor = "text-bh-orange";

  const dims = {
    sm: { h: 22, fontSize: 13, gap: 1, endorse: 8, tagline: 8.5, letterSpacing: "0.18em" },
    md: { h: 28, fontSize: 17, gap: 2, endorse: 9.5, tagline: 10, letterSpacing: "0.16em" },
    lg: { h: 40, fontSize: 24, gap: 3, endorse: 10.5, tagline: 11, letterSpacing: "0.16em" },
  }[size];

  return (
    <span className="inline-flex items-center gap-2.5">
      <Image
        src={emblem}
        alt=""
        width={Math.round((dims.h * 255.21) / 195.97)}
        height={dims.h}
        priority
        style={{ height: dims.h, width: "auto" }}
        className="block"
      />
      <span className="flex flex-col leading-none">
        <span
          className={`${wordColor} font-semibold uppercase`}
          style={{
            fontSize: dims.fontSize,
            letterSpacing: "0.04em",
          }}
        >
          BUILDHAWK
        </span>
        <span
          className={`${endorseColor} mt-1 uppercase`}
          style={{
            fontSize: dims.endorse,
            letterSpacing: "0.16em",
          }}
        >
          Powered by Hawktress<sup style={{ fontSize: "0.7em", marginLeft: "0.1em" }}>™</sup>
        </span>
        {showTagline && (
          <span
            className={`${taglineColor} mt-1 uppercase`}
            style={{
              fontSize: dims.tagline,
              letterSpacing: dims.letterSpacing,
            }}
          >
            Precision Estimating. Disciplined Delivery.
          </span>
        )}
      </span>
    </span>
  );
}
