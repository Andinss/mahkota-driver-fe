import ResetPasswordPage from "./reset";

interface PageProps {
  searchParams: Promise<{ token?: string }>;
}

export default async function ResetPassword({ searchParams }: PageProps) {
  const { token } = await searchParams;
  return <ResetPasswordPage token={token || ""} />;
}
