import { AdminBreadcrumb } from "@/components/layout/admin-breadcrumb";

export default function MembersPage() {
  return (
    <div>
      <AdminBreadcrumb
        page="Membres"
        ancestors={[
          {
            name: "Accueil",
            href: "/admin",
          },
        ]}
      />
      <h1>Liste des membres</h1>
    </div>
  );
}
