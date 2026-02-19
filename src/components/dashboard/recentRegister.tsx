import { SectionHeader } from "@/components/ui/section-header";
import { Table, TableRow, TableCell } from "@/components/ui/table";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { IconButton } from "@/components/ui/icon-button";

interface User {
  name: string;
  email: string;
  avatar: string;
  role: string;
  status: "active" | "pending" | "inactive";
  joinedDate: string;
}

const users: User[] = [
  {
    name: "John Doe",
    email: "john.doe@example.com",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuC-2NVFm20440xacKVGBMS1Rhwy8pU70P8kgJa0ZM_RRHdrMv4ibxTLwzDuc9HUx8a_wcWxjZpDYz0BuAQkYQ0EzDesTnTn5KcO1fJnWq2uYDw7XnoYFXBVm-F6NdTTOuZKdO6DgKj5OpQg2tsISsf7Ze0INs51d4mnK_Bspi0OL95lKn-8l1iM72QdpZjxyAxddIPM5xB-bN_WcqjO9YdvWp84yWgTdrpO4TZpl2OdudJrp43mW-8Zu7vfbNBRqyrVh1AuItATNT8h",
    role: "Customer",
    status: "active",
    joinedDate: "Oct 24, 2023",
  },
  {
    name: "Alice Smith",
    email: "alice.s@example.com",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuATa3H5m1U4I1Q-zdICNVuLESW-L8sYn4pLEfdXNzL8nuZDMywTLvPD0D9dRsMHjrK0SwkrjR5la1wFjFISMqvRC_9VACov87szjI_8eRoY8n8paAzkcgaMVdjjtnS3n1rjoJyjMwJvqMYazmsFPBdwd4vWzCjzb6PJRgMDtr44hRilz6Di2RPt04vRQgSEEgcy5kidcYyHtVKeW1Deyiv5MnWWyz6TfSQ4LRpRPmI5xD3pkWIQz2rpFCUvTewzJp-xWXtvw1z9R_L7",
    role: "Customer",
    status: "pending",
    joinedDate: "Oct 24, 2023",
  },
  {
    name: "Robert Johnson",
    email: "robert.j@example.com",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAiWX_6As8vVUqHj1H6ygzDbzdQhm9JOZa43FR26P5_BNU5vGSMoOW4INBh30ctuOUoJbIJ4wojr7FHKus-pIasZZjl_W7SvpbkUuEwG-EcCAUZTOvJz6KGM_WwJySGO755sjruj4Wtukc2DQs6-EPRwWxajNtwyzO3_n6QPyKVzgDuB2cp8jBrqM0CHLh3xAkWB7ay2oTpK9-hw54rp4t8QfAdcs1dny-UItQyf9dIkOD8Mn-G0rEXPWIkpBlcilJjvHw-jFXMU64v",
    role: "Staff",
    status: "active",
    joinedDate: "Oct 23, 2023",
  },
  {
    name: "Maria Lopez",
    email: "m.lopez@example.com",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuD_23xkSDG9wdiuzNu8Fl3LI6P2JkBhuH-xLKo9mFDbwRzdjF6orzTf2qSRmYOKKlRQLJMhTmA204woR35ZTzaf4KZeVgN8zVtaAC6HKQHfdMwHExEDG04tLOvFHy6hQYCdwaZ5dqoKDdL3rVlUhGYkj2ov88IOFWbrbfdPf0XctvEA-m57cvkYBh9L-Iqs-IHZxSKh5sgYEyg6kX6G3UgrH-2CIO62ZZ2n83_QH0w0zDswB5LXkZxQfX6gi8gvokkz3MYrHsH1R0GN",
    role: "Customer",
    status: "inactive",
    joinedDate: "Oct 22, 2023",
  },
];

const statusVariant: Record<User["status"], "success" | "warning" | "neutral"> = {
  active: "success",
  pending: "warning",
  inactive: "neutral",
};

const RecentCard = () => {
  return (
    <section className="rounded-xl bg-white dark:bg-slate-850 mt-5 border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
      <SectionHeader
        title="Recent Registrations"
        action={
          <a className="text-primary hover:text-blue-700 text-sm font-medium flex items-center gap-1" href="#">
            View all users <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </a>
        }
      />
      <div className="overflow-x-auto">
        <Table headers={["User", "Role", "Status", "Joined Date", ""]}>
          {users.map((user, index) => (
            <TableRow key={index}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar src={user.avatar} alt={`Avatar for ${user.name}`} />
                  <div>
                    <p className="text-slate-900 dark:text-white font-medium">{user.name}</p>
                    <p className="text-slate-500 dark:text-slate-400 text-xs">{user.email}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-slate-700 dark:text-slate-300">{user.role}</TableCell>
              <TableCell>
                <Badge variant={statusVariant[user.status]} size="md">
                  {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                </Badge>
              </TableCell>
              <TableCell className="text-slate-500 dark:text-slate-400">{user.joinedDate}</TableCell>
              <TableCell className="text-right">
                <IconButton name="more_vert" size="sm" variant="ghost" />
              </TableCell>
            </TableRow>
          ))}
        </Table>
      </div>
    </section>
  );
};

export default RecentCard;
