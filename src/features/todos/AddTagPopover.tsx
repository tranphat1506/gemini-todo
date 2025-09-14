import clsx from "clsx";
import type { TagEntity } from "./types";

interface AddTagPopoverProps {
  tagVM: TagEntity;
  setTagVM: React.Dispatch<React.SetStateAction<TagEntity>>;
  allTags: TagEntity[];
  getFieldError?: (fieldName: string) => string | undefined;
}

const AddTagPopover: React.FC<AddTagPopoverProps> = ({
  tagVM,
  setTagVM,
  allTags,
  getFieldError,
}) => {
  const inputClass =
    "p-2 rounded-lg border border-white/20 text-white outline-none focus:border-green-400";
  const errorInputClass =
    "p-2 rounded-lg border border-red-500 text-white outline-none focus:border-red-400";

  const textError = getFieldError?.("text");
  const colorError = getFieldError?.("color");

  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className="block text-sm text-white/70 mb-1">
          Tên thẻ <span className="text-red-400">*</span>
        </label>
        <input
          value={tagVM.text}
          onChange={(e) =>
            setTagVM({
              ...tagVM,
              text: e.target.value,
              createdAt: Date.now(),
              updatedAt: Date.now(),
            })
          }
          className={clsx("w-full", textError ? errorInputClass : inputClass)}
          placeholder="Nhập tên thẻ..."
        />
        {textError && <p className="text-red-400 text-xs mt-1">{textError}</p>}

        {/* Hiển thị các tag hiện có để người dùng tham khảo */}
        <div className="mt-2">
          <p className="text-xs text-white/50 mb-1">Các thẻ hiện có:</p>
          <div className="flex flex-wrap gap-1 max-h-16 overflow-y-auto">
            {allTags.map((tag) => (
              <span
                key={tag.id}
                className="px-2 py-1 text-xs rounded-full text-white"
                style={{ backgroundColor: tag.color }}
              >
                #{tag.text}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm text-white/70 mb-1">
          Màu <span className="text-red-400">*</span>
        </label>
        <div className="flex items-center gap-3">
          <input
            type="color"
            value={tagVM.color}
            onChange={(e) =>
              setTagVM({
                ...tagVM,
                color: e.target.value,
                createdAt: Date.now(),
                updatedAt: Date.now(),
              })
            }
            className="w-16 h-10 p-1 border border-white/20 rounded cursor-pointer"
          />

          {/* Preview */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-white/70">Preview:</span>
            <span
              className="px-3 py-1 rounded-full text-sm font-medium text-white"
              style={{ backgroundColor: tagVM.color }}
            >
              #{tagVM.text || "example"}
            </span>
          </div>
        </div>
        {colorError && (
          <p className="text-red-400 text-xs mt-1">{colorError}</p>
        )}
      </div>

      {/* Quick Color Presets */}
      <div>
        <label className="block text-sm text-white/70 mb-2">Màu gợi ý:</label>
        <div className="flex flex-wrap gap-2">
          {[
            "#3b82f6", // blue
            "#10b981", // emerald
            "#f59e0b", // amber
            "#8b5cf6", // violet
            "#ef4444", // red
            "#f97316", // orange
            "#06b6d4", // cyan
            "#84cc16", // lime
            "#ec4899", // pink
            "#6b7280", // gray
          ].map((color) => (
            <button
              key={color}
              onClick={() =>
                setTagVM({
                  ...tagVM,
                  color,
                  createdAt: Date.now(),
                  updatedAt: Date.now(),
                })
              }
              className={clsx(
                "w-8 h-8 rounded-full border-2 hover:scale-110 transition-transform",
                tagVM.color === color
                  ? "border-white shadow-lg scale-110"
                  : "border-white/30"
              )}
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AddTagPopover;
