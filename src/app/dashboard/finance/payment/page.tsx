import ManualPaymentPage from "./manual-payment";

export default async function Page(props: { searchParams: Promise<{ id?: string }> }) {
  const { id } = await props.searchParams;
  return <ManualPaymentPage id={id ?? null} />;
}
