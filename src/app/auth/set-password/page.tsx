import SetPasswordPage from "./set-password";

interface PageProps {
  searchParams: Promise<{ token?: string }>;
}

export default async function SetPassword({ searchParams }: PageProps) {
  const { token } = await searchParams;
  return <SetPasswordPage token={token || ""} />;
}
