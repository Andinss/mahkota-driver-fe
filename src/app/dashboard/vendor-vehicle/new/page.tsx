import NewVendorForm from "./new-vendor";

export default async function Page(props: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await props.searchParams;
  return <NewVendorForm id={id ?? null} />;
}