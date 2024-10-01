"use client";

export function TOC({
  items,
}: {
  items: {
    title: string;
    page: string;
    href: string;
    children?: {
      title: string;
      page: string;
      href: string;
    }[];
  }[];
}) {
  let audio = new Audio("/audio/page-flip.mp3");

  const start = () => {
    audio.play();
  };

  return (
    <ol className="toc-list" role="list">
      {items.map((item) => (
        <li key={item.href}>
          <a href={item.href} onClick={start}>
            <span className="title">
              {item.title}
              <span className="leaders" aria-hidden="true"></span>
            </span>{" "}
            <span data-href={item.href} className="page">
              <span className="visually-hidden">Page&nbsp;</span>
              {item.page}
            </span>
          </a>
          <ol role="list">
            {item.children?.map((child) => (
              <li>
                <a href={child.href} onClick={start}>
                  <span className="title">
                    {child.title}
                    <span className="leaders" aria-hidden="true"></span>
                  </span>{" "}
                  <span data-href={child.href} className="page">
                    <span className="visually-hidden">Page&nbsp;</span>
                    {child.page}
                  </span>
                </a>
              </li>
            ))}
          </ol>
        </li>
      ))}
    </ol>
  );
}
