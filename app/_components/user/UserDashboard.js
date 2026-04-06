import {
  Card,
  Metric,
  Text,
  Flex,
  ProgressBar,
  Grid,
  Badge,
  Table,
  TableHead,
  TableRow,
  TableHeaderCell,
  TableBody,
  TableCell,
} from "@tremor/react";

export default function UserDashboard({ applications, stats }) {
  return (
    <main className="p-4 sm:p-10 space-y-8">
      {/* 1. الترحيب والإحصائيات السريعة */}
      <div>
        <h1 className="text-2xl font-black text-[#2d2e3e]">
          Välkommen tillbaka, Mahmod! 👋
        </h1>
        <Text>Här är en översikt av din jobbsökning.</Text>
      </div>

      <Grid numItemsMd={2} numItemsLg={3} className="gap-6">
        <Card
          className="rounded-4xl"
          decoration="top"
          decorationColor="emerald"
        >
          <Text className="font-bold">Skickade ansökningar</Text>
          <Metric className="font-black">12</Metric>
        </Card>
        <Card className="rounded-4xl" decoration="top" decorationColor="blue">
          <Text className="font-bold">Sparade jobb</Text>
          <Metric className="font-black">5</Metric>
        </Card>
        <Card className="rounded-4xl">
          <Flex>
            <Text className="font-bold">Profilstyrka</Text>
            <Text className="font-bold">85%</Text>
          </Flex>
          <ProgressBar value={85} color="emerald" className="mt-3" />
        </Card>
      </Grid>

      {/* 2. جدول الطلبات الأخيرة */}
      <Card className="rounded-[2.5rem] mt-8 border-none shadow-sm">
        <h3 className="text-lg font-bold text-[#2d2e3e] mb-4">
          Dina senaste ansökningar
        </h3>
        <Table className="mt-5">
          <TableHead>
            <TableRow>
              <TableHeaderCell>Företag</TableHeaderCell>
              <TableHeaderCell>Roll</TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
              <TableHeaderCell>Datum</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* هنا تعمل ماب للطلبات الحقيقية */}
            <TableRow>
              <TableCell className="font-bold">Spotify</TableCell>
              <TableCell>Frontend Developer</TableCell>
              <TableCell>
                <Badge color="orange">Intervju</Badge>
              </TableCell>
              <TableCell>2024-03-20</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Card>
    </main>
  );
}
