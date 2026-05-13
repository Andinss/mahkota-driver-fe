import { SearchInput } from "@/components/ui/search-input";
import { Select } from "@/components/ui/select";

export const TaskFilters = () => {
  return (
    <div className="rounded-xl border border-[#dbe0e6] dark:border-[#2a3845] bg-white dark:bg-[#1a2632] p-4 shadow-sm">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
        <SearchInput
          className="w-full md:max-w-md"
          placeholder="Search vehcile or driver..."
        />
        <div className="flex gap-3 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
           <Select
            id="all-task"
            label=""
            className="min-w-[140px]"
            defaultValue=""
          >
            <option value="">All Task</option>
            <option value="Retrievals">Retrievals</option>
            <option value="Maintenance">Maintenance</option>
            <option value="Completed">Completed</option>
          </Select> 
          <Select
            id="task-filters"
            label=""
            className="min-w-[140px]"
            defaultValue=""
          >
            <option value="">All Status</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Scheduled">Scheduled</option>
          </Select>
        </div>
      </div>
    </div>
  );
};
