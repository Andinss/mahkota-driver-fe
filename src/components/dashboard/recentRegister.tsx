const RecentCard = () => {
  return (
    <section className="rounded-xl bg-white dark:bg-slate-850 mt-5 border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-700 flex flex-wrap gap-4 justify-between items-center">
        <h3 className="text-slate-900 dark:text-white text-lg font-bold">
          Recent Registrations
        </h3>
        <a
          className="text-primary hover:text-blue-700 text-sm font-medium flex items-center gap-1"
          href="#"
        >
          View all users{" "}
          <span className="material-symbols-outlined text-sm">
            arrow_forward
          </span>
        </a>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
            <tr>
              <th className="px-6 py-4 font-semibold">User</th>
              <th className="px-6 py-4 font-semibold">Role</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold">Joined Date</th>
              <th className="px-6 py-4 font-semibold text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
            {/* Row 1 - John Doe */}
            <tr className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div
                    className="size-9 rounded-full bg-slate-200 dark:bg-slate-700 bg-cover bg-center"
                    data-alt="Avatar for John Doe"
                    style={{
                      backgroundImage:
                        'url("https://lh3.googleusercontent.com/aida-public/AB6AXuC-2NVFm20440xacKVGBMS1Rhwy8pU70P8kgJa0ZM_RRHdrMv4ibxTLwzDuc9HUx8a_wcWxjZpDYz0BuAQkYQ0EzDesTnTn5KcO1fJnWq2uYDw7XnoYFXBVm-F6NdTTOuZKdO6DgKj5OpQg2tsISsf7Ze0INs51d4mnK_Bspi0OL95lKn-8l1iM72QdpZjxyAxddIPM5xB-bN_WcqjO9YdvWp84yWgTdrpO4TZpl2OdudJrp43mW-8Zu7vfbNBRqyrVh1AuItATNT8h")',
                    }}
                  ></div>
                  <div>
                    <p className="text-slate-900 dark:text-white font-medium">
                      John Doe
                    </p>
                    <p className="text-slate-500 dark:text-slate-400 text-xs">
                      john.doe@example.com
                    </p>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 text-slate-700 dark:text-slate-300">
                Customer
              </td>
              <td className="px-6 py-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-400">
                  Active
                </span>
              </td>
              <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                Oct 24, 2023
              </td>
              <td className="px-6 py-4 text-right">
                <button className="text-slate-400 hover:text-primary transition-colors">
                  <span className="material-symbols-outlined">more_vert</span>
                </button>
              </td>
            </tr>

            {/* Row 2 - Alice Smith */}
            <tr className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div
                    className="size-9 rounded-full bg-slate-200 dark:bg-slate-700 bg-cover bg-center"
                    data-alt="Avatar for Alice Smith"
                    style={{
                      backgroundImage:
                        'url("https://lh3.googleusercontent.com/aida-public/AB6AXuATa3H5m1U4I1Q-zdICNVuLESW-L8sYn4pLEfdXNzL8nuZDMywTLvPD0D9dRsMHjrK0SwkrjR5la1wFjFISMqvRC_9VACov87szjI_8eRoY8n8paAzkcgaMVdjjtnS3n1rjoJyjMwJvqMYazmsFPBdwd4vWzCjzb6PJRgMDtr44hRilz6Di2RPt04vRQgSEEgcy5kidcYyHtVKeW1Deyiv5MnWWyz6TfSQ4LRpRPmI5xD3pkWIQz2rpFCUvTewzJp-xWXtvw1z9R_L7")',
                    }}
                  ></div>
                  <div>
                    <p className="text-slate-900 dark:text-white font-medium">
                      Alice Smith
                    </p>
                    <p className="text-slate-500 dark:text-slate-400 text-xs">
                      alice.s@example.com
                    </p>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 text-slate-700 dark:text-slate-300">
                Customer
              </td>
              <td className="px-6 py-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-400">
                  Pending
                </span>
              </td>
              <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                Oct 24, 2023
              </td>
              <td className="px-6 py-4 text-right">
                <button className="text-slate-400 hover:text-primary transition-colors">
                  <span className="material-symbols-outlined">more_vert</span>
                </button>
              </td>
            </tr>

            {/* Row 3 - Robert Johnson */}
            <tr className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div
                    className="size-9 rounded-full bg-slate-200 dark:bg-slate-700 bg-cover bg-center"
                    data-alt="Avatar for Robert Johnson"
                    style={{
                      backgroundImage:
                        'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAiWX_6As8vVUqHj1H6ygzDbzdQhm9JOZa43FR26P5_BNU5vGSMoOW4INBh30ctuOUoJbIJ4wojr7FHKus-pIasZZjl_W7SvpbkUuEwG-EcCAUZTOvJz6KGM_WwJySGO755sjruj4Wtukc2DQs6-EPRwWxajNtwyzO3_n6QPyKVzgDuB2cp8jBrqM0CHLh3xAkWB7ay2oTpK9-hw54rp4t8QfAdcs1dny-UItQyf9dIkOD8Mn-G0rEXPWIkpBlcilJjvHw-jFXMU64v")',
                    }}
                  ></div>
                  <div>
                    <p className="text-slate-900 dark:text-white font-medium">
                      Robert Johnson
                    </p>
                    <p className="text-slate-500 dark:text-slate-400 text-xs">
                      robert.j@example.com
                    </p>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 text-slate-700 dark:text-slate-300">
                Staff
              </td>
              <td className="px-6 py-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-400">
                  Active
                </span>
              </td>
              <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                Oct 23, 2023
              </td>
              <td className="px-6 py-4 text-right">
                <button className="text-slate-400 hover:text-primary transition-colors">
                  <span className="material-symbols-outlined">more_vert</span>
                </button>
              </td>
            </tr>

            {/* Row 4 - Maria Lopez */}
            <tr className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div
                    className="size-9 rounded-full bg-slate-200 dark:bg-slate-700 bg-cover bg-center"
                    data-alt="Avatar for Maria Lopez"
                    style={{
                      backgroundImage:
                        'url("https://lh3.googleusercontent.com/aida-public/AB6AXuD_23xkSDG9wdiuzNu8Fl3LI6P2JkBhuH-xLKo9mFDbwRzdjF6orzTf2qSRmYOKKlRQLJMhTmA204woR35ZTzaf4KZeVgN8zVtaAC6HKQHfdMwHExEDG04tLOvFHy6hQYCdwaZ5dqoKDdL3rVlUhGYkj2ov88IOFWbrbfdPf0XctvEA-m57cvkYBh9L-Iqs-IHZxSKh5sgYEyg6kX6G3UgrH-2CIO62ZZ2n83_QH0w0zDswB5LXkZxQfX6gi8gvokkz3MYrHsH1R0GN")',
                    }}
                  ></div>
                  <div>
                    <p className="text-slate-900 dark:text-white font-medium">
                      Maria Lopez
                    </p>
                    <p className="text-slate-500 dark:text-slate-400 text-xs">
                      m.lopez@example.com
                    </p>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 text-slate-700 dark:text-slate-300">
                Customer
              </td>
              <td className="px-6 py-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300">
                  Inactive
                </span>
              </td>
              <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                Oct 22, 2023
              </td>
              <td className="px-6 py-4 text-right">
                <button className="text-slate-400 hover:text-primary transition-colors">
                  <span className="material-symbols-outlined">more_vert</span>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default RecentCard;
