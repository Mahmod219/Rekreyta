import { getReview } from "@/app/_lib/data-service";
import AdminreviewList from "./AdminreviewList";
import ApplicationsAdmin from "./ApplicationsAdmin";

export default async function AdminStrationOp({ application }) {
  const { id } = application;
  const reviews = (await getReview(id)) || [];
  return (
    <div>
      {reviews.map((rev) => (
        <AdminreviewList rev={rev} key={rev.id} application={application} />
      ))}
    </div>
  );
}
