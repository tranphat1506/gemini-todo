import { useState } from "react";
import type { ProjectViewModel } from "./types";

interface AddProjectPopoverProps {
  projectVM: ProjectViewModel;
  setProjectVM: React.Dispatch<React.SetStateAction<ProjectViewModel>>;
  allProjects: ProjectViewModel[];
}

const AddProjectPopover: React.FC<AddProjectPopoverProps> = ({
  projectVM,
  setProjectVM,
  allProjects,
}) => {
  const inputClass =
    "p-2 rounded-lg border border-white/20 text-white outline-none focus:border-green-400";

  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className="block text-sm text-white/70 mb-1">
          Tên dự án (*)
        </label>
        <input
          value={projectVM.projectName}
          onChange={(e) =>
            setProjectVM({
              ...projectVM,
              projectName: e.target.value,
              createdAt: Date.now(),
              updatedAt: Date.now(),
            })
          }
          className={`${inputClass} w-full`}
          placeholder="Nhập tên dự án..."
        />
      </div>

      <div>
        <label className="block text-sm text-white/70 mb-1">Màu (*)</label>
        <input
          type="color"
          value={projectVM.color}
          onChange={(e) =>
            setProjectVM({
              ...projectVM,
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

export default AddProjectPopover;
