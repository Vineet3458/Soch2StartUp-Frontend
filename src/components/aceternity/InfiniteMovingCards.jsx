import { useMemo } from "react";

export function InfiniteMovingCards({
  items = [],
  direction = "left",
  speed = "normal",
  pauseOnHover = true,
  className = "",
  renderItem,
}) {
  const displayItems = useMemo(() => {
    if (!items || items.length === 0) return [];
    let list = items;
    while (list.length < 10) {
      list = [...list, ...items];
    }
    return list;
  }, [items]);

  if (!displayItems.length) return null;

  return (
    <div
      className={`aceternity-moving-cards-container ${className} ${
        pauseOnHover ? "pause-on-hover" : ""
      }`}
    >
      <div
        className={`aceternity-moving-cards-track dir-${direction} spd-${speed}`}
      >
        <div className="aceternity-moving-cards-group">
          {displayItems.map((item, idx) => (
            <div key={`track1-${idx}`} className="moving-card-cell">
              {renderItem ? renderItem(item, idx) : item}
            </div>
          ))}
        </div>
        <div className="aceternity-moving-cards-group" aria-hidden="true" inert="">
          {displayItems.map((item, idx) => (
            <div key={`track2-${idx}`} className="moving-card-cell">
              {renderItem ? renderItem(item, idx) : item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
