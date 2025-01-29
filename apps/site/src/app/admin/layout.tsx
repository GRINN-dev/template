import { redirect } from "next/navigation";

import { graphql } from "@grinn/graphql";

import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { ApolloWrapper } from "@/graphql/apollo-wrapper";
import { query } from "@/graphql/server";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data } = await query({ query: LoggedInUserQuery });

  if (!data.currentUser) {
    redirect("/connexion");
  }

  return (
    <SidebarProvider>
      <AdminSidebar
        currentUser={{
          email: data.currentUser.email,
          id: data.currentUser.id,
          avatar: data.currentUser.avatarUrl,
          name: data.currentUser.firstname + " " + data.currentUser.lastname,
        }}
      />
      <SidebarInset>
        <ApolloWrapper>{children}</ApolloWrapper>
      </SidebarInset>
    </SidebarProvider>
  );
}

const LoggedInUserQuery = graphql(`
  query LoggedInUserQuery {
    currentUser {
      id
      email
      firstname
      lastname
      avatarUrl
    }
  }
`);
