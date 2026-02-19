import { SearchInput } from "@/components/ui/search-input";
import { IconButton } from "@/components/ui/icon-button";
import { Avatar } from "@/components/ui/avatar";

const Topbar = () => {
  return (
    <header className="flex flex-col gap-1 p-7">
      <div className="flex justify-between items-start md:items-center flex-col md:flex-row gap-4">
        <div>
          <h2 className="text-slate-900 dark:text-white text-3xl font-black leading-tight tracking-tight">
            Dashboard
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-base font-normal mt-1">
            Welcome back, Administrator. Here is an overview of user activity.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative hidden sm:block">
            <SearchInput
              className="w-64 shadow-sm"
              placeholder="Search users..."
            />
          </div>
          <IconButton name="notifications" badge />
          <Avatar
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBBWlskkdFoTQprusiYVu7an4AXhl_9-FDQvUqoV7CfJSu11thcCE5vg56M68qimVlCi6UKLy0TemBcJADCyasSX01GUoGRkbawpjU1ZmAMY-Q3l5L8MipeG8HQfoPZ7oLbMtatSz_6mnssWAwAAQC7qn7FDiraGFp_qcQ2JBGyR0Esxy0mOpcPFgg_qckqazyxa9aCAwYO9nZE9cDtkWMv81L4VX6zliMkx7Y5fj1RwV8KCuCKEGshMHI6DMr3a54zGOa8-eyg_jWH"
            alt="Admin user profile avatar"
          />
        </div>
      </div>
    </header>
  );
};
export default Topbar;
