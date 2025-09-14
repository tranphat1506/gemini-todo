import { useState } from "react";
import { LuX } from "react-icons/lu";
import { RiArrowLeftSLine, RiSearch2Line } from "react-icons/ri";

const mockResults = [
  "Buy groceries",
  "Finish homework",
  "Prepare presentation",
  "Go jogging",
  "Read a book",
];

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [isMobileOpen, setMobileOpen] = useState(false);

  const filtered = mockResults.filter((item) =>
    item.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <>
      {/* Desktop */}
      <div className="hidden sm:block relative w-full">
        <div className="rounded-xl bg-[#111] px-4 py-4 text-white outline-none flex items-center gap-3 focus-within:ring-2 ring-green-400">
          <RiSearch2Line size={"1.25rem"} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search..."
            className="w-full bg-transparent text-white outline-none"
          />
          {query && (
            <button onClick={() => setQuery("")}>
              <LuX className="text-white text-xl" />
            </button>
          )}
        </div>
        {query && (
          <div className="absolute left-0 right-0 mt-2 rounded-lg backdrop-blur-sm bg-black/50 shadow-xl border-2 border-green-400/20">
            {filtered.length ? (
              filtered.map((item) => (
                <div
                  key={item}
                  className="px-4 py-2 text-white hover:bg-[#333] cursor-pointer"
                >
                  {item}
                </div>
              ))
            ) : (
              <div className="my-auto px-4 py-4 font-bold text-2xl text-white">
                No results
              </div>
            )}
          </div>
        )}
      </div>

      {/* Mobile */}
      <div className="sm:hidden">
        {!isMobileOpen ? (
          <div className="rounded-xl bg-[#111] px-4 py-4 text-white outline-none flex items-center gap-3">
            <RiSearch2Line size={"1.25rem"} />
            <button
              onClick={() => setMobileOpen(true)}
              className="w-full text-left outline-none text-[#9a9a9a]"
            >
              Search...
            </button>
          </div>
        ) : (
          <div className="fixed inset-0 z-50 flex flex-col backdrop-blur-xl bg-black/60">
            {/* Header */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-[#333]">
              <button onClick={() => setMobileOpen(false)}>
                <RiArrowLeftSLine size={"1.25rem"} />
              </button>
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search..."
                className="flex-1 bg-transparent px-4 py-3 text-white outline-none"
              />
              {query && (
                <button onClick={() => setQuery("")}>
                  <LuX className="text-white text-xl" />
                </button>
              )}
            </div>

            {/* Results */}
            <div className="flex-1 overflow-y-auto">
              {filtered.length ? (
                filtered.map((item) => (
                  <div
                    key={item}
                    className="px-4 py-3 border-b border-[#222] text-white"
                  >
                    {item}
                  </div>
                ))
              ) : (
                <div className="px-4 py-3 text-gray-400">No results</div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
