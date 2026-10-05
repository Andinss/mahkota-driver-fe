import NewRekening from "./new-rekenin";

export default async function Page(props: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await props.searchParams;
  return <NewRekening id={id ?? null} />;
}