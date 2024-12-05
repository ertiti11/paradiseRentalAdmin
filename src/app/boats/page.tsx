import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import TableBoat from "../../components/Tables/TableBoat.tsx";

import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

export const metadata: Metadata = {
  title: "Next.js Tables | ParadiseRentalAdmin - Next.js Dashboard Template",
  description:
    "This is Next.js Tables page for ParadiseRentalAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

const TablesPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Tables" />

      <div className="flex flex-col gap-10">
        <TableBoat />
      </div>
    </DefaultLayout>
  );
};

export default TablesPage;
