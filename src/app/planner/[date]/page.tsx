import { AppShell } from "@/components/layout/AppShell";

interface Props {
  params: Promise<{ date: string }>;
}

export default async function PlannerPage({ params }: Props) {
  const { date } = await params;
  return <AppShell dateKey={date} />;
}
