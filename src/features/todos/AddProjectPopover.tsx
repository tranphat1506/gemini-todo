import clsx from "clsx";
import { getContrastColor } from "@/utils/color";
import type { ProjectViewModel } from "./types";

interface AddProjectPopoverProps {
  projectVM: ProjectViewModel;
  setProjectVM: React.Dispatch<React.SetStateAction<ProjectViewModel>>;
  allProjects: ProjectViewModel[];
  getFieldError?: (fieldName: string) => string | undefined;
}

const AddProjectPopover: React.FC<AddProjectPopoverProps> = ({
  projectVM,
  setProjectVM,
  allProjects,
  getFieldError,
}) => {
  const inputClass =
    "p-2 rounded-lg border border-white/20 text-white outline-none focus:border-green-400";
  const errorInputClass =
    "p-2 rounded-lg border border-red-500 text-white outline-none focus:border-red-400";

  const projectNameError = getFieldError?.("projectName");
  const colorError = getFieldError?.("color");

  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className="block text-sm text-white/70 mb-1">
          Tên dự án <span className="text-red-400">*</span>
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
          className={clsx(
            "w-full",
            projectNameError ? errorInputClass : inputClass
          )}
          placeholder="Nhập tên dự án..."
        />
        {projectNameError && (
          <p className="text-red-400 text-xs mt-1">{projectNameError}</p>
        )}

        {/* Hiển thị các dự án hiện có để người dùng tham khảo */}
        <div className="mt-2">
          <p className="text-xs text-white/50 mb-1">Các dự án hiện có:</p>
          <div className="flex flex-wrap gap-2 max-h-16 overflow-y-auto">
            {allProjects.map((project) => (
              <span
                key={project.id}
                className="px-3 py-1 text-sm font-medium rounded-md"
                style={{
                  backgroundColor: project.color,
                  color: getContrastColor(project.color),
                }}
              >
                {project.projectName}
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
            value={projectVM.color}
            onChange={(e) =>
              setProjectVM({
                ...projectVM,
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
              className="px-3 py-1 rounded-md text-sm font-medium"
              style={{
                backgroundColor: projectVM.color,
                color: getContrastColor(projectVM.color),
              }}
            >
              {projectVM.projectName || "Project Example"}
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
            "#06b6d4", // cyan (default)
            "#3b82f6", // blue
            "#10b981", // emerald
            "#8b5cf6", // violet
            "#f59e0b", // amber
            "#ef4444", // red
            "#f97316", // orange
            "#84cc16", // lime
            "#ec4899", // pink
            "#64748b", // slate
          ].map((color) => (
            <button
              key={color}
              onClick={() =>
                setProjectVM({
                  ...projectVM,
                  color,
                  createdAt: Date.now(),
                  updatedAt: Date.now(),
                })
              }
              className={clsx(
                "w-8 h-8 rounded-full border-2 hover:scale-110 transition-transform",
                projectVM.color === color
                  ? "border-white shadow-lg scale-110"
                  : "border-white/30"
              )}
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>
      </div>

      {/* Project Description Preview */}
      <div className="bg-white/5 rounded-lg p-3">
        <h4 className="text-sm font-medium text-white/70 mb-2">Mô tả dự án:</h4>
        <div className="text-xs text-white/60 space-y-1">
          <p>• Dự án sẽ được hiển thị trong sidebar</p>
          <p>• Có thể gán Todo vào dự án này</p>
          <p>• Màu sắc giúp phân biệt các dự án</p>
        </div>
      </div>
    </div>
  );
};

export default AddProjectPopover;
