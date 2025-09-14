import type { TagEntity } from "./types";

interface AddTagPopoverProps {
  tagVM: TagEntity;
  setTagVM: React.Dispatch<React.SetStateAction<TagEntity>>;
  allTags: TagEntity[];
}

const AddTagPopover: React.FC<AddTagPopoverProps> = ({
  tagVM,
  setTagVM,
  allTags,
}) => {
  const inputClass =
    "p-2 rounded-lg border border-white/20 text-white outline-none focus:border-green-400";
  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className="block text-sm text-white/70 mb-1">Tên thẻ (*)</label>
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
          className={`w-full ${inputClass}`}
          placeholder="Nhập tên thẻ..."
        />
      </div>

      <div>
        <label className="block text-sm text-white/70 mb-1">Màu (*)</label>
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
          className="w-16 h-10 p-1 border border-white/20 rounded"
        />
      </div>
    </div>
  );
};

export default AddTagPopover;
