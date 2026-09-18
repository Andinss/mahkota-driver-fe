import FinanceDetailPage from "./detail-finance";

export default async function Page(props: { searchParams: Promise<{ id?: string }> }) {
  const { id } = await props.searchParams;
  return <FinanceDetailPage id={id ?? null} />;
}
