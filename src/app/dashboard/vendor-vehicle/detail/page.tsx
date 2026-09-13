import VendorDetailPage from "./detail-vendor";

export default async function Page(props: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await props.searchParams;
  return <VendorDetailPage id={id ?? null} />;
}