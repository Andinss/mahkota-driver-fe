import NewMembership from "./new-membership";

export default async function Page(props: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await props.searchParams;
  return <NewMembership id={id ?? null} />;
}
