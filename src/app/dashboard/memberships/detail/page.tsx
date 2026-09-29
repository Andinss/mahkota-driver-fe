import MembershipDetail from "./detail-membership";

export default async function Page(props: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await props.searchParams;
  return <MembershipDetail id={id ?? null} />;
}
