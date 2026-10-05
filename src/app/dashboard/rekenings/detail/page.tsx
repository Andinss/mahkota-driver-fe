import RekeningDetail from "./detail-rekening";

export default async function Page(props: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await props.searchParams;
  return <RekeningDetail id={id ?? null} />;
}